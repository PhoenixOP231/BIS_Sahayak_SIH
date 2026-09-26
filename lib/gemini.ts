import { GoogleGenAI } from '@google/genai';
import { searchHybridStandards } from './vector-store';
import { ALL_STANDARDS, getStandardById, SourceMetadata } from './standards-data';
import { Language } from './translations';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CitationItem {
  id: string;
  isNumber: string;
  title: string;
  category: string;
  status: string;
  clauseNumber?: string;
  sourceMetadata?: SourceMetadata;
}

export interface AIResponse {
  answer: string;
  citations: CitationItem[];
  mode: 'consumer' | 'industry';
  language: Language;
  fallback?: boolean;
}

const BASE_GROUNDING_RULES = `
CRITICAL SAFETY & SOURCE PROVENANCE RULES:
1. Ground answers in the RETRIEVED DEMONSTRATION SUMMARIES of Indian Standards provided below. These summaries are not official standard extracts.
2. If the retrieved context does NOT contain the specific numeric tolerance, test method, or standard needed to answer the query, CLEARLY STATE THAT YOU CANNOT CONFIRM the specific figure from indexed records and advise the user to consult the official standard document on the e-BIS / Manakonline portal (https://www.services.bis.gov.in) or BIS Care Mobile App.
3. NEVER guess, extrapolate, or hallucinate technical parameters, pressure limits, voltage tolerances, chemical limits, or license numbers.
4. You are an independent educational and compliance prototype developed for Smart India Hackathon 2026 (SIH26107), not a live government database.
`;

const CONSUMER_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक), a helpful, friendly, and concise independent AI assistant about Indian Standards and BIS services.
${BASE_GROUNDING_RULES}

RESPONSE STRUCTURE:
1. Keep the primary answer very short, crisp, and direct (2 to 3 sentences in plain, everyday language).
2. Follow with 2 to 3 practical bullet points under "### 🔍 Key Takeaways".
3. Place all detailed clause citations, test parameters, and regulatory background inside an expandable HTML details block:
   <details>
   <summary><b>📖 More Information & Technical Specifications</b></summary>
   [Detailed explanation, test tolerances, standard scope, and QCO order]
   </details>
4. If the user asks a casual or greeting question, respond warmly and concisely in 2 sentences.
5. When answering in Hindi, use warm, natural, and accessible Devanagari Hindi.
`;

const INDUSTRY_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक) in Technical Industry & MSME Mode, an expert regulatory and engineering compliance advisor.
${BASE_GROUNDING_RULES}

RESPONSE STRUCTURE:
1. Provide a crisp 2-sentence executive summary first.
2. Follow with key acceptance thresholds in 2-3 concise bullet points.
3. Put deep clause breakdowns, routine testing tables, and conformity scheme details inside:
   <details>
   <summary><b>📖 Technical Specifications & Compliance Clauses</b></summary>
   [Clauses, numerical limits, test methods, QCO mandates]
   </details>
`;

export function generateConversationalNLPAnswer(
  query: string,
  mode: 'consumer' | 'industry',
  language: Language,
  topStd: any
): string {
  const q = query.toLowerCase().trim().replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '');

  // 1. Casual Greetings & Slang
  if (/^(yo|sup|wassup|whatsup|wazzup|hey|hi|hello|namaste|pranam|hola|howdy|hlo|hii|heyy|heya|kaise ho|kya haal|bhai|bro|dost|नमस्ते|प्रणाम|हेलो|हाय|हलो)$/i.test(q) ||
      /^(yo|hey|hi|hello|namaste|pranam|hola|howdy|hlo|hii|heyy)\s+/i.test(q)) {
    if (language === 'hi') {
      return `नमस्ते! मैं आपका **बीआईएस सहायक (BIS Sahayak)** हूँ। 😊

मैं भारतीय मानकों (Indian Standards), उत्पाद सुरक्षा, प्रमाणन योजनाओं और असली **ISI मार्क / हॉलमार्क** की जानकारी के लिए उपस्थित हूँ।

### 🔍 आप मुझसे क्या पूछ सकते हैं:
• किसी भी उत्पाद की सुरक्षा (प्रेशर कुकर, TMT सरिया, हेलमेट, पानी की बोतल आदि)
• बीआईएस प्रमाणन योजनाएं (Scheme-I, CRS, FMCS, Scheme-X)
• सोने की हॉलमार्किंग एवं 6-अंकीय HUID कोड
• एमएसएमई के लिए बीआईएस लाइसेंस आवेदन प्रक्रिया एवं आधिकारिक प्रयोगशालाएं

बताइए, आज मैं आपकी क्या सहायता कर सकता हूँ?`;
    } else {
      return `Hello! I am your **BIS Sahayak (AI Assistant)**. 😊

I am here to help you navigate Indian Standards (IS), mandatory Quality Control Orders (QCOs), certification schemes, and spot genuine **ISI marks & BIS Hallmarks**.

### 🔍 You can ask me about:
• Product safety standards (Pressure Cookers, TMT Rebars, Helmets, Packaged Water)
• BIS Certification Schemes (Scheme-I ISI mark, CRS, FMCS, Scheme-X)
• Gold Hallmarking & 6-digit HUID verification
• MSME licensing application workflows & official BIS test laboratories

How can I help you today?`;
    }
  }

  // 2. Acknowledgments, Thanks & Goodbyes
  if (/^(ok|okay|k|cool|great|awesome|nice|thanks|thank you|thx|tysm|dhanyawad|shukriya|got it|understood|bye|goodbye|see you|tc|take care|ठीक है|धन्यवाद|शुक्रिया|अलविदा)$/i.test(q) ||
      /^(thanks|thank you|dhanyawad|shukriya)\s+/i.test(q)) {
    if (language === 'hi') {
      return `आपका बहुत-बहुत धन्यवाद! 🙏

यदि आपको किसी अन्य उत्पाद, ISI मार्क, हॉलमार्क या भारतीय मानक (IS) के बारे में कोई भी जानकारी चाहिए, तो कभी भी पूछ सकते हैं। सुरक्षित रहें और केवल प्रमाणित सामान खरीदें!`;
    } else {
      return `You're most welcome! Glad I could help. 😊

Feel free to ask anytime if you need help verifying an ISI mark, understanding testing parameters, or learning about BIS certification schemes. Always stay safe and choose certified goods!`;
    }
  }

  // 3. Bot Identity & Purpose
  if (/who are you|what can you do|kya kar sakte|tum kaun|aap kaun|about yourself|तुम्हारा काम/i.test(q)) {
    if (language === 'hi') {
      return `मैं **बीआईएस सहायक (BIS Sahayak)** हूँ — स्मार्ट इंडिया हैकाथॉन 2026 (SIH26107) के लिए विकसित एक स्वतंत्र एआई सहायक प्रोटोटाइप।

### 🔍 प्रमुख क्षमताएं:
• **उपभोक्ता सुरक्षा:** रोजमर्रा के सामान पर असली ISI मार्क एवं हॉलमार्क की पहचान।
• **लाइसेंस प्रारूप सत्यापन:** 7 या 8 अंकों के **CM/L लाइसेंस नंबर** के प्रारूप की जांच।
• **प्रमाणन योजनाएं:** Scheme-I, CRS, FMCS, एवं Scheme-X की विस्तृत जानकारी।
• **उद्योग एवं एमएसएमई:** मानक परीक्षण सीमाएं, 6-चरणीय आवेदन प्रक्रिया एवं प्रयोगशाला खोज।`;
    } else {
      return `I am **BIS Sahayak**, an independent AI assistant prototype developed for Smart India Hackathon 2026 (Problem Statement SIH26107).

### 🔍 Key Capabilities:
• **Consumer Safety:** Clarify product safety standards (IS) and mandatory Quality Control Orders (QCOs).
• **Licence Number Check:** Inspect 7/8-digit **CM/L number** length and open BIS Care for official licence details.
• **Certification Schemes:** Detailed guides on Scheme-I, CRS, FMCS, and Scheme-X.
• **Industry & MSME Support:** In-house lab setups, 6-step licensing workflow, and official BIS test laboratories.`;
    }
  }

  // 4. Hallmarking & HUID Queries
  if (/hallmark|huid|gold|jewellery|jeweler|carat|karat|22k|18k|14k|हॉलमार्क|सोना|कैरट/i.test(q)) {
    if (language === 'hi') {
      return `### ⚡ संक्षिप्त उत्तर
वर्तमान आदेश में शामिल जिलों में, लागू छूट के अधीन **बीआईएस हॉलमार्किंग** अनिवार्य है। हॉलमार्क वाले सोने के आभूषण पर 3 चिह्न होते हैं।

### 🔍 हॉलमार्क के 3 अनिवार्य चिह्न:
• **बीआईएस मानक लोगो:** आधिकारिक त्रिकोणीय BIS चिह्न।
• **शुद्धता एवं कैरट:** **22K916** (91.6% शुद्ध), **18K750** (75.0% शुद्ध), या **14K585** (58.5% शुद्ध)।
• **6-अंकीय HUID कोड:** अल्फ़ान्यूमेरिक विशिष्ट पहचान कोड (उदा. AB1234)।

<details>
<summary><b>📖 HUID सत्यापन एवं उपभोक्ता अधिकार (Click to expand)</b></summary>

**HUID कैसे सत्यापित करें:**
उपभोक्ता अपने स्मार्टफोन में आधिकारिक **BIS Care App** खोलकर 'Verify HUID' विकल्प में 6-अंकीय कोड दर्ज कर सकते हैं। यह ऐप जौहरी का पंजीकरण नंबर, एएचसी (Assaying & Hallmarking Centre) और हॉलमार्किंग की तारीख दिखाता है।
</details>`;
    } else {
      return `### ⚡ Quick Answer
**BIS Hallmarking** is mandatory in districts covered by the current order, subject to exemptions. Hallmarked gold jewellery carries 3 identifying marks.

### 🔍 3 Mandatory Hallmark Signs:
• **BIS Logo:** The official triangular Bureau of Indian Standards emblem.
• **Purity in Carat & Fineness:** **22K916** (91.6% pure gold), **18K750** (75.0%), or **14K585** (58.5%).
• **6-Digit HUID Code:** A unique alphanumeric code (e.g. AB1234) laser-engraved on each piece.

<details>
<summary><b>📖 HUID Verification & Consumer Rights (Click to expand)</b></summary>

**How to verify on BIS Care:**
Open the official **BIS Care Mobile App**, select **'Verify HUID'**, and enter the 6-digit code. The app retrieves the jeweller's BIS registration number, assaying centre details, article type, and hallmarking timestamp.
</details>`;
    }
  }

  // 5. Certification Schemes (Scheme-I, CRS, FMCS, Scheme-X)
  if (/scheme|crs|fmcs|scheme-x|scheme-1|scheme-i|certification scheme|प्रमाणन योजना/i.test(q)) {
    if (language === 'hi') {
      return `### ⚡ संक्षिप्त उत्तर
बीआईएस उत्पाद अनुरूपता मूल्यांकन विनियम, 2018 के तहत विभिन्न विनिर्माण श्रेणियों के लिए 4 प्रमुख प्रमाणन योजनाएं संचालित करता है।

### 🔍 4 प्रमुख बीआईएस प्रमाणन योजनाएं:
• **Scheme-I (ISI मार्क योजना):** घरेलू निर्माताओं के लिए। फैक्ट्री ऑडिट और तीसरे पक्ष के नमूना परीक्षण के बाद CM/L लाइसेंस प्रदान किया जाता है।
• **CRS (अनिवार्य पंजीकरण योजना):** इलेक्ट्रॉनिक्स, आईटी और सौर उत्पादों के लिए। MeitY के आदेशानुसार स्व-घोषणा आधारित।
• **FMCS (विदेशी निर्माता प्रमाणन):** भारत के बाहर स्थित विदेशी विनिर्माण संयंत्रों के लिए।
• **Scheme-X:** भारी मशीनरी, टर्बाइन, और पूंजीगत इंजीनियरिंग उपकरणों के लिए सरलीकृत योजना।

<details>
<summary><b>📖 योजना विवरण एवं आधिकारिक पोर्टल (Click to expand)</b></summary>

आवेदन और शुल्क की जानकारी के लिए संबंधित आधिकारिक BIS पोर्टल देखें। Scheme-I में वार्षिक न्यूनतम मार्किंग शुल्क पर रियायतें उद्यम की श्रेणी पर निर्भर करती हैं।
</details>`;
    } else {
      return `### ⚡ Quick Answer
Under the BIS Conformity Assessment Regulations 2018, the Bureau operates 4 primary certification schemes tailored to different industrial sectors.

### 🔍 4 Core BIS Certification Schemes:
• **Scheme-I (ISI Mark Scheme):** For domestic manufacturers. Requires in-house laboratory, factory inspection, and product sampling before CM/L licence grant.
• **CRS (Compulsory Registration Scheme):** For IT, electronics, and solar equipment mandated under MeitY notifications. Based on laboratory test reports.
• **FMCS (Foreign Manufacturers Certification Scheme):** For overseas manufacturing units exporting certified products into India.
• **Scheme-X:** Specialized conformity assessment for heavy machinery, pressure equipment, and capital goods.

<details>
<summary><b>📖 Application Process & Concessions (Click to expand)</b></summary>

Check the relevant official BIS portal for applications and fees. Under Scheme-I, annual minimum marking fee concessions depend on the enterprise category.
</details>`;
    }
  }

  // 6. BIS Laboratories Discovery
  if (/lab|laboratory|testing lab|nabl|sahibabad|testing facility|प्रयोगशाला|लैब|परीक्षण केंद्र/i.test(q)) {
    if (language === 'hi') {
      return `### ⚡ संक्षिप्त उत्तर
बीआईएस की केंद्रीय, क्षेत्रीय और शाखा प्रयोगशालाएं हैं। वर्तमान परीक्षण दायरा आधिकारिक BIS LIMS निर्देशिका पर जांचें।

### 🔍 प्रमुख बीआईएस प्रयोगशालाएं:
• **केंद्रीय प्रयोगशाला (CL):** साहिबाबाद, गाजियाबाद (राष्ट्रीय संदर्भ प्रयोगशाला)।
• **पश्चिमी क्षेत्रीय प्रयोगशाला (WRL):** मुंबई (महाराष्ट्र)।
• **पूर्वी क्षेत्रीय प्रयोगशाला (ERL):** कोलकाता (पश्चिम बंगाल)।
• **दक्षिणी क्षेत्रीय प्रयोगशाला (SRL):** चेन्नई (तमिलनाडु)।
• **उत्तरी क्षेत्रीय प्रयोगशाला (NRL):** मोहाली (पंजाब)।

<details>
<summary><b>📖 लैब ट्रैकिंग एवं LIMS पोर्टल (Click to expand)</b></summary>

सभी आधिकारिक नमूने **LIMS (Laboratory Information Management System)** के माध्यम से बारकोडेड व डिजिटल रूप से ट्रैक किए जाते हैं। मान्यता प्राप्त प्रयोगशालाओं की सूची **manakonline.in** पर देखी जा सकती है।
</details>`;
    } else {
      return `### ⚡ Quick Answer
BIS operates central, regional, and branch laboratories. Confirm each lab's current testing scope in the official BIS LIMS directory.

### 🔍 Major BIS Testing Laboratories:
• **Central Laboratory (CL):** Sahibabad, Ghaziabad (National Reference Laboratory).
• **Western Regional Lab (WRL):** Mumbai, Maharashtra.
• **Eastern Regional Lab (ERL):** Kolkata, West Bengal.
• **Southern Regional Lab (SRL):** Chennai, Tamil Nadu.
• **Northern Regional Lab (NRL):** Mohali, Punjab.

<details>
<summary><b>📖 Sample Tracking & LIMS Portal (Click to expand)</b></summary>

Check laboratory contacts and testing scope in the official **BIS LIMS directory** (lims.bis.gov.in/home/bis_labs/).
</details>`;
    }
  }

  // 7. Licensing & MSME Application Procedure
  if (/how to apply|license process|licensing procedure|msme application|get isi mark|cml application|लाइसेंस कैसे लें|आवेदन प्रक्रिया/i.test(q)) {
    if (language === 'hi') {
      return `### ⚡ संक्षिप्त उत्तर
बीआईएस लाइसेंस (CM/L) प्राप्त करने की प्रक्रिया **e-BIS (manakonline.in)** पोर्टल पर 6 पारदर्शी डिजिटल चरणों में पूरी होती है।

### 🔍 6-चरणीय लाइसेंस आवेदन प्रक्रिया:
1. **e-BIS पोर्टल पर पंजीकरण:** manakonline.in पर विनिर्माता खाता बनाएं।
2. **मानक (IS) एवं योजना का चयन:** उत्पाद से संबंधित भारतीय मानक चुनें।
3. **परीक्षण एवं गुणवत्ता टीम:** पात्र MSME मान्यता प्राप्त बाहरी प्रयोगशाला का उपयोग कर सकते हैं।
4. **ऑनलाइन फॉर्म एवं शुल्क भुगतान:** फैक्ट्री लेआउट एवं दस्तावेज अपलोड करें।
5. **बीआईएस फैक्ट्री निरीक्षण:** अधिकारी द्वारा संयंत्र निरीक्षण व नमूना संग्रह।
6. **लाइसेंस आवंटन (CM/L):** सफल परीक्षण रिपोर्ट के बाद लाइसेंस जारी किया जाता है।

<details>
<summary><b>📖 एमएसएमई रियायतें एवं छूट (Click to expand)</b></summary>

सूक्ष्म एवं लघु उद्यमों (MSME), महिला उद्यमियों और DPIIT-मान्यता प्राप्त स्टार्टअप्स को आवेदन और वार्षिक लाइसेंस शुल्क में विशेष छूट दी जाती है।
</details>`;
    } else {
      return `### ⚡ Quick Answer
Obtaining a BIS CM/L licence for Scheme-I compliance is managed digitally through a 6-step procedure on the **e-BIS portal (manakonline.in)**.

### 🔍 6-Step Licensing Workflow:
1. **Portal Registration:** Register manufacturing entity on manakonline.in.
2. **Standard & Scheme Selection:** Identify applicable IS code (e.g. IS 2347, IS 14543).
3. **Testing Setup:** Arrange suitable testing and qualified QC personnel; eligible MSMEs may use recognized external laboratories.
4. **Online Application & Fee:** Submit factory layout, machinery details, and testing manual.
5. **BIS Factory Audit:** Bureau officers inspect manufacturing controls and draw test samples.
6. **Grant of Licence:** CM/L number issued upon independent laboratory compliance verification.

<details>
<summary><b>📖 MSME & Startup Concessions (Click to expand)</b></summary>

BIS states that through 31 May 2029, Scheme-I annual minimum marking fee concessions are 80% for micro enterprises and startups, 50% for small enterprises, plus an additional 10% for eligible women-led enterprises. Check application and audit fees separately on the official BIS portal.
</details>`;
    }
  }

  // 8. Complaints, Counterfeit, & BIS Care
  if (/complaint|fake|nakli|counterfeit|shikayat|report|bis care|dhokha|शिकायत|नकली|फ्रॉड/i.test(q)) {
    if (language === 'hi') {
      return `### ⚡ संक्षिप्त उत्तर
यदि कोई उत्पाद बिना वैध ISI मार्क के बेचा जा रहा है या मार्क नकली है, तो आप **BIS Care App** के माध्यम से सीधे उपभोक्ता मामले मंत्रालय को शिकायत दर्ज कर सकते हैं।

### 🔍 मुख्य कदम:
• **CM/L लाइसेंस जांचें:** असली ISI मार्क के नीचे 7 या 8 अंकों का CM/L नंबर होना अनिवार्य है।
• **BIS Care ऐप डाउनलोड करें:** ऐप में 'Verify License Details' से फैक्ट्री की जांच करें।
• **शिकायत दर्ज करें:** ऐप के 'Complaints' सेक्शन में फोटो और दुकान का पता अपलोड करें।

<details>
<summary><b>📖 कानूनी अधिकार एवं BIS Act, 2016 (विस्तृत जानकारी)</b></summary>

भारतीय मानक ब्यूरो अधिनियम, 2016 की धारा 29 के तहत, अनिवार्य QCO के अंतर्गत आने वाले उत्पादों पर नकली ISI मार्क लगाना या बिना लाइसेंस बेचना गैर-कानूनी है। इसमें उत्पाद जब्ती, जुर्माना और कारावास का प्रावधान है।
</details>`;
    } else {
      return `### ⚡ Quick Answer
If you encounter a counterfeit product, uncertified goods under mandatory QCO, or a misleading ISI mark, you can lodge an authoritative complaint using the official **BIS Care Mobile App**.

### 🔍 What to Check:
• **7/8-Digit CM/L License:** Authentic ISI marks must display a license number under the logo (e.g. CM/L-8400123).
• **BIS Care App Verification:** Open the app and enter the CM/L number to see the registered factory address and brand.
• **Lodge Complaint:** Use the 'Complaints' portal inside BIS Care to report violations for immediate enforcement action.

<details>
<summary><b>📖 Legal Penalties & BIS Act, 2016 (Click to expand)</b></summary>

Under Section 29 of the BIS Act, 2016, manufacturing or selling sub-standard goods under mandatory Quality Control Orders (QCO) is punishable with heavy monetary penalties and imprisonment.
</details>`;
    }
  }

  // 9. Specific Product Answers based on retrieved Standard
  if (topStd) {
    if (language === 'hi') {
      if (mode === 'consumer') {
        return `### ⚡ संक्षिप्त उत्तर
**${topStd.isNumber} (${topStd.titleHi || topStd.title})** भारत में इस उत्पाद की गुणवत्ता और सुरक्षा सुनिश्चित करने का आधिकारिक मानक है।

### 🔍 खरीदते समय मुख्य जांच:
• **असली ISI मार्क:** बॉक्स व बॉडी पर **${topStd.isNumber}** और नीचे **7 या 8 अंकों का CM/L लाइसेंस** देखें।
${topStd.status.includes('Mandatory') ? '• **अनिवार्य कानून (QCO):** यह उत्पाद भारत सरकार के नियम अनुसार अनिवार्य प्रमाणीकरण के अंतर्गत है।\n' : ''}• **BIS Care ऐप:** अपने मोबाइल में लाइसेंस नंबर डालकर निर्माता की वैधता सत्यापित करें।

<details>
<summary><b>📖 विस्तृत जानकारी एवं तकनीकी मानक (Click to expand)</b></summary>

**कार्यक्षेत्र:** ${topStd.scopeHi || topStd.scope}

**प्रमुख सुरक्षा परीक्षण:**
${(topStd.keyTests || []).map((t: any) => `• **${t.name}:** ${t.description} (स्वीकार्य सीमा: ${t.parameterLimit})`).join('\n')}

**अनुरूपता योजना:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `**अनिवार्य QCO आदेश:** ${topStd.qcoOrder}\n` : ''}**अंकन आवश्यकताएं:** ${topStd.markingRequirements}
</details>`;
      } else {
        return `### ⚡ Executive Technical Summary
**${topStd.isNumber}: ${topStd.title}** governs industrial specifications, sampling procedures, and proof acceptance limits.

### 🔍 Key Compliance Checkpoints:
• **Conformity Scheme:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `• **Mandatory QCO:** ${topStd.qcoOrder}\n` : ''}• **Standard Mark:** ${topStd.markingRequirements}

<details>
<summary><b>📖 Technical Parameters & Testing Protocol (Click to expand)</b></summary>

**Scope & Applicability:**
${topStd.scope}

**Quality & Lab Test Limits:**
${(topStd.keyTests || []).map((t: any) => `• **${t.name}:** ${t.description} *(Acceptance Limit: ${t.parameterLimit})*`).join('\n')}
</details>`;
      }
    } else {
      if (mode === 'consumer') {
        return `### ⚡ Quick Answer
**${topStd.isNumber} (${topStd.title})** is the official Indian Standard ensuring safety, reliability, and health compliance for this product.

### 🔍 What to Check When Buying:
• **Authentic ISI Mark:** Check that **${topStd.isNumber}** is printed on top and a **7 or 8-digit CM/L license number** is at the bottom.
${topStd.status.includes('Mandatory') ? '• **Mandatory Law (QCO):** This product is legally required to be BIS certified in India before sale.\n' : ''}• **Verify via BIS Care:** Enter the CM/L number in the official **BIS Care App** to confirm factory authenticity.

<details>
<summary><b>📖 More Information & Specifications (Click to expand)</b></summary>

**Standard Scope:**
${topStd.scope}

**Mandatory Quality & Safety Tests:**
${(topStd.keyTests || []).map((t: any) => `• **${t.name}:** ${t.description} *(Limit: ${t.parameterLimit})*`).join('\n')}

**Conformity Assessment:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `**Quality Control Order (QCO):** ${topStd.qcoOrder}\n` : ''}**Marking Requirements:** ${topStd.markingRequirements}
</details>`;
      } else {
        return `### ⚡ Executive Technical Summary
**${topStd.isNumber}: ${topStd.title}** establishes the regulatory parameters, test methods, and acceptance thresholds for industrial compliance.

### 🔍 Primary Compliance Checkpoints:
• **Conformity Assessment Scheme:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `• **Mandatory QCO Order:** ${topStd.qcoOrder}\n` : ''}• **Marking Clause:** ${topStd.markingRequirements}

<details>
<summary><b>📖 Technical Specifications & Testing Parameters (Click to expand)</b></summary>

**Scope & Industrial Application:**
${topStd.scope}

**Testing Parameters & Acceptance Criteria:**
${(topStd.keyTests || []).map((t: any) => `• **${t.name}:** ${t.description} *(Acceptance Limit: ${t.parameterLimit})*`).join('\n')}
</details>`;
      }
    }
  }

  // 10. General Informational Fallback
  if (language === 'hi') {
    return `### ⚡ संक्षिप्त उत्तर
भारतीय मानक ब्यूरो (BIS) के अनुसार, उत्पादों की सुरक्षा और गुणवत्ता सुनिश्चित करने के लिए मानक और प्रमाणन प्रक्रियाएं तय की गई हैं।

### 🔍 मुख्य सलाह:
• केवल **ISI मार्क** और **7/8 अंकों के CM/L लाइसेंस** वाला सामान खरीदें।
• प्रामाणिकता जांचने के लिए **BIS Care App** का उपयोग करें।

आप किसी खास उत्पाद (जैसे प्रेशर कुकर, पानी की बोतल, सरिया, केबल, हेलमेट, सोना) या प्रमाणन योजना (Scheme-I, CRS, FMCS) के बारे में पूछ सकते हैं!`;
  } else {
    return `### ⚡ Quick Answer
Indian Standards (IS) under the Bureau of Indian Standards define rigorous quality, durability, and safety criteria for consumer and industrial goods.

### 🔍 Quick Checklist:
• Look for the authentic **ISI Mark** with a valid **7 or 8-digit CM/L license number**.
• Verify the license or HUID using the official **BIS Care Mobile App**.

Feel free to ask about any specific product (pressure cookers, TMT bars, helmets, drinking water), certification schemes (Scheme-I, CRS, FMCS), or gold hallmarking!`;
  }
}

export async function generateRAGAnswer(
  query: string,
  history: ChatMessage[] = [],
  mode: 'consumer' | 'industry' = 'consumer',
  language: Language = 'en'
): Promise<AIResponse> {
  // Step 1: Hybrid Vector Retrieval
  const relevantChunks = await searchHybridStandards(query, 5);

  // Extract unique citations from retrieved chunks
  const citationMap = new Map<string, CitationItem>();
  for (const chunk of relevantChunks) {
    const std = chunk.standard || getStandardById(chunk.standardId) || getStandardById(chunk.isNumber);
    if (std) {
      if (!citationMap.has(std.id)) {
        citationMap.set(std.id, {
          id: std.id,
          isNumber: std.isNumber,
          title: std.title,
          category: std.category,
          status: std.status,
          clauseNumber: chunk.clauseNumber,
          sourceMetadata: std.sourceMetadata,
        });
      }
    }
  }

  if (relevantChunks.length > 0 && citationMap.size < 2) {
    const qTokens = query.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ' ').split(/\s+/).filter(w => w.length >= 3);
    for (const std of ALL_STANDARDS) {
      if (!citationMap.has(std.id)) {
        const fullStdText = ((std.title || '') + ' ' + (std.titleHi || '') + ' ' + (std.scope || '') + ' ' + (std.scopeHi || '')).toLowerCase();
        const hasMatch = qTokens.some(tok => fullStdText.includes(tok));
        if (hasMatch) {
          citationMap.set(std.id, {
            id: std.id,
            isNumber: std.isNumber,
            title: std.title,
            category: std.category,
            status: std.status,
            clauseNumber: 'General',
            sourceMetadata: std.sourceMetadata,
          });
        }
      }
    }
  }

  const citations = Array.from(citationMap.values());

  // Format context for LLM
  const contextString = relevantChunks
    .map(
      (c, idx) =>
        '[' + (idx + 1) + '] Standard: ' + c.isNumber + ' (' + c.title + ')\n' +
        'Clause: ' + c.clauseNumber + ' (' + c.heading + ')\n' +
        'Content: ' + c.content + '\n' +
        'Category: ' + c.category + ' | Status: ' + c.status + '\n'
    )
    .join('\n---\n');

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = mode === 'consumer' ? CONSUMER_SYSTEM_PROMPT : INDUSTRY_SYSTEM_PROMPT;
      const langInstruction = language === 'hi'
        ? '\nIMPORTANT: Respond in natural, conversational, fluent HINDI (Devanagari script) with a friendly, helpful Indian tone.'
        : '\nIMPORTANT: Respond in clear, conversational, helpful ENGLISH from the user\'s perspective.';

      const conversationContext = history
        .slice(-4)
        .map(h => (h.role === 'user' ? 'User: ' + h.content : 'Assistant: ' + h.content))
        .join('\n');

      const fullPrompt =
        systemPrompt + '\n' +
        langInstruction + '\n\n' +
        'RETRIEVED DEMONSTRATION SUMMARIES OF INDIAN STANDARDS:\n' +
        contextString + '\n\n' +
        (conversationContext ? 'PREVIOUS CONVERSATION:\n' + conversationContext + '\n\n' : '') +
        'USER QUERY: ' + query + '\n\n' +
        'ANSWER (strictly grounded in retrieved context, concise, safe):';

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 18000)
      );

      const result: any = await Promise.race([generatePromise, timeoutPromise]);
      const answerText = result?.text;

      if (answerText && answerText.trim()) {
        return {
          answer: answerText.trim(),
          citations,
          mode,
          language,
          fallback: false,
        };
      }
    } catch {
      // Fall through to deterministic conversational NLP fallback
    }
  }

  // Intelligent Contextual Fallback Response
  const topMatch = relevantChunks[0];
  const std = topMatch?.standard || (topMatch ? getStandardById(topMatch.standardId) : null);

  const answer = generateConversationalNLPAnswer(query, mode, language, std);

  return {
    answer,
    citations,
    mode,
    language,
    fallback: true,
  };
}
