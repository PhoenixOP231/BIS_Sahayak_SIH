import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchHybridStandards } from './vector-store';
import { ALL_STANDARDS, getStandardById } from './standards-data';
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
}

export interface AIResponse {
  answer: string;
  citations: CitationItem[];
  mode: 'consumer' | 'industry';
  language: Language;
}

const CONSUMER_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक), a helpful, friendly, and concise AI Assistant for the Bureau of Indian Standards (BIS) and Ministry of Consumer Affairs, Government of India.

RESPONSE STRUCTURE (CRITICAL):
1. Keep the primary answer very short, crisp, and direct (2 to 3 sentences in plain, everyday language).
2. Follow with 2 to 3 practical bullet points under "### 🔍 Key Takeaways".
3. Place all detailed clause citations, test parameters, and regulatory background inside an expandable HTML details block:
   <details>
   <summary><b>📖 More Information & Technical Specifications</b></summary>
   [Detailed explanation, test tolerances, standard scope, and QCO order]
   </details>
4. If the user asks a casual or greeting question (e.g. "Yo", "Hi", "Thanks", "How are you?"), respond warmly and concisely in 2 sentences.
5. When answering in Hindi, use warm, natural, and accessible Devanagari Hindi.
`;

const INDUSTRY_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक) in Technical Industry & MSME Mode, an expert regulatory and engineering compliance advisor.

RESPONSE STRUCTURE (CRITICAL):
1. Provide a crisp 2-sentence executive summary first.
2. Follow with key acceptance thresholds in 2-3 concise bullet points.
3. Put deep clause breakdowns, routine testing tables, and conformity scheme details inside:
   <details>
   <summary><b>📖 Technical Specifications & Compliance Clauses</b></summary>
   [Clauses, numerical limits, test methods, QCO mandates]
   </details>
`;

function generateConversationalNLPAnswer(
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

मैं भारतीय मानकों (Indian Standards), उत्पाद सुरक्षा और असली **ISI मार्क** की जांच में आपकी मदद के लिए उपस्थित हूँ।

### 🔍 आप मुझसे क्या पूछ सकते हैं:
• किसी भी उत्पाद की सुरक्षा (प्रेशर कुकर, TMT सरिया, हेलमेट, पानी की बोतल आदि)
• असली ISI मार्क और 7/8 अंकों के CM/L लाइसेंस की पहचान
• नकली सामान की शिकायत और BIS Care ऐप का उपयोग

बताइए, आज मैं आपकी क्या सहायता कर सकता हूँ?`;
    } else {
      return `Hello! I am your **BIS Sahayak (AI Assistant)**. 😊

I am here to help you easily verify product safety, understand Indian Standards, and spot genuine **ISI marks** and **BIS Hallmarks**.

### 🔍 You can ask me things like:
• *"Is my pressure cooker certified under mandatory BIS rules?"*
• *"Which TMT steel rebar (Fe 500D) should I use for home construction?"*
• *"How do I verify a product or report fake goods on the BIS Care App?"*

How can I help you today?`;
    }
  }

  // 2. Acknowledgments, Thanks & Goodbyes
  if (/^(ok|okay|k|cool|great|awesome|nice|thanks|thank you|thx|tysm|dhanyawad|shukriya|got it|understood|bye|goodbye|see you|tc|take care|ठीक है|धन्यवाद|शुक्रिया|अलविदा)$/i.test(q) ||
      /^(thanks|thank you|dhanyawad|shukriya)\s+/i.test(q)) {
    if (language === 'hi') {
      return `आपका बहुत-बहुत धन्यवाद! 🙏

यदि आपको किसी अन्य उत्पाद, ISI मार्क या भारतीय मानक (IS) के बारे में कोई भी जानकारी चाहिए, तो कभी भी पूछ सकते हैं। सुरक्षित रहें और केवल प्रमाणित सामान खरीदें!`;
    } else {
      return `You're most welcome! Glad I could help. 😊

Feel free to ask anytime if you need help verifying an ISI mark, testing parameters, or Indian Standards. Always stay safe and buy certified goods!`;
    }
  }

  // 3. Bot Identity & Purpose
  if (/who are you|what can you do|kya kar sakte|tum kaun|aap kaun|about yourself|तुम्हारा काम/i.test(q)) {
    if (language === 'hi') {
      return `मैं **बीआईएस सहायक (BIS Sahayak)** हूँ — भारतीय मानक ब्यूरो (BIS) और उपभोक्ता मामले मंत्रालय के लिए बनाया गया एक आधिकारिक एआई सहायक।

### 🔍 मेरी प्रमुख सेवाएं:
• **उपभोक्ता सुरक्षा:** रोजमर्रा के सामान पर असली ISI मार्क की पहचान करना।
• **लाइसेंस सत्यापन:** 7 या 8 अंकों के **CM/L लाइसेंस नंबर** की प्रामाणिकता जांचना।
• **उद्योग सहायता:** तकनीकी परीक्षण मानक और अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) समझाना।`;
    } else {
      return `I am **BIS Sahayak**, an AI Assistant designed for the Bureau of Indian Standards (BIS) and Ministry of Consumer Affairs, Government of India.

### 🔍 Key Capabilities:
• **Consumer Safety:** Clarify product safety standards (IS) and mandatory Quality Control Orders (QCOs).
• **License Verification:** Guide you on verifying authentic 7/8-digit **CM/L license numbers**.
• **Industry & MSME Guidance:** Provide exact testing limits and procurement specifications.`;
    }
  }

  // 4. Complaints, Counterfeit, & BIS Care
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

भारतीय मानक ब्यूरो अधिनियम, 2016 के तहत, अनिवार्य QCO के अंतर्गत आने वाले उत्पादों पर नकली ISI मार्क लगाना या बिना लाइसेंस बेचना एक गैर-जमानती दंडात्मक अपराध है। इसमें भारी जुर्माना और कारावास का प्रावधान है।
</details>`;
    } else {
      return `### ⚡ Quick Answer
If you encounter a counterfeit product or fake ISI mark, you can verify manufacturer validity and lodge a direct complaint using the official **BIS Care Mobile App**.

### 🔍 What to Check:
• **7/8-Digit CM/L License:** Authentic ISI marks must display a license number under the logo (e.g. CM/L-8400123).
• **BIS Care App Verification:** Open the app and enter the CM/L number to see the registered factory address and brand.
• **Lodge Complaint:** Use the 'Complaints' portal inside BIS Care to report violations for immediate enforcement action.

<details>
<summary><b>📖 Legal Rights & BIS Act, 2016 (Click to expand)</b></summary>

Under Section 29 of the BIS Act, 2016, manufacturing or selling sub-standard goods under mandatory Quality Control Orders (QCO) is punishable with heavy monetary penalties and imprisonment.
</details>`;
    }
  }

  // 5. Specific Product Answers based on retrieved Standard
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

  // 6. General Fallback
  if (language === 'hi') {
    return `### ⚡ संक्षिप्त उत्तर
भारतीय मानक ब्यूरो (BIS) के अनुसार, उत्पादों की सुरक्षा और गुणवत्ता सुनिश्चित करने के लिए मानक तय किए गए हैं।

### 🔍 मुख्य सलाह:
• केवल **ISI मार्क** और **7/8 अंकों के CM/L लाइसेंस** वाला सामान खरीदें।
• प्रामाणिकता जांचने के लिए **BIS Care App** का उपयोग करें।

आप किसी खास उत्पाद (जैसे प्रेशर कुकर, पानी की बोतल, सरिया, केबल, हेलमेट) का नाम लिखकर सवाल पूछ सकते हैं!`;
  } else {
    return `### ⚡ Quick Answer
Indian Standards (IS) under the Bureau of Indian Standards define rigorous quality, durability, and safety criteria for consumer and industrial products.

### 🔍 Quick Checklist:
• Look for the authentic **ISI Mark** with a valid **7 or 8-digit CM/L license number**.
• Verify the license using the official **BIS Care Mobile App**.

Feel free to ask about any specific product like pressure cookers, TMT bars, helmets, drinking water, or electrical cables!`;
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
          clauseNumber: chunk.clauseNumber
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
            clauseNumber: 'General'
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

  if (apiKey && apiKey.startsWith('AIzaSy') && !apiKey.includes('placeholder')) {
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        });

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
          'RETRIEVED OFFICIAL INDIAN STANDARDS CONTEXT:\n' +
          contextString + '\n\n' +
          (conversationContext ? 'PREVIOUS CONVERSATION:\n' + conversationContext + '\n\n' : '') +
          'USER QUERY: ' + query + '\n\n' +
          'ANSWER (conversational, empathetic, user-centric):';

        const generatePromise = model.generateContent(fullPrompt);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 2500)
        );

        const result: any = await Promise.race([generatePromise, timeoutPromise]);
        const answerText = result.response.text();

        if (answerText && answerText.trim()) {
          return {
            answer: answerText.trim(),
            citations,
            mode,
            language,
          };
        }
      } catch {
        // Fallback to next model or conversational engine
      }
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
  };
}

