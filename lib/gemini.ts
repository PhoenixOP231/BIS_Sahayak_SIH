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
You are "BIS Sahayak" (बीआईएस सहायक), a helpful, friendly, and expert AI Guide for the Bureau of Indian Standards (BIS) and Ministry of Consumer Affairs, Government of India.

YOUR TONE & PERSPECTIVE:
- Always answer conversationally from the USER'S PERSPECTIVE in simple, clear, and reassuring everyday language.
- Never produce raw, rigid, or textbook-like technical dumps. Explain *why* safety rules matter to them and their family.
- If the user asks a casual or conversational question (e.g., "Hi", "How are you?", "Who are you?", "Help me with my kitchen"), respond warmly and naturally like a knowledgeable friend.
- When explaining products, highlight 3 practical things:
  1. What this product standard means in simple terms.
  2. What to look for on the product (the authentic ISI mark, the IS number on top, and the 7 or 8-digit CM/L license number at the bottom).
  3. Remind them they can verify any product's license or report fake goods on the official "BIS Care" mobile app.
- If answering in Hindi, use natural, respectful, conversational Hindi (Devanagari).
`;

const INDUSTRY_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक) in Technical Industry & MSME Mode, a knowledgeable, practical engineering and regulatory compliance advisor for manufacturers, testing labs, and contractors.

YOUR TONE & PERSPECTIVE:
- Speak directly, professionally, and conversationally to the engineer, manufacturer, or procurement officer.
- Provide clear answers with practical context before diving into exact technical parameters, IS numbers, and testing limits.
- Explain compliance requirements clearly (Scheme-I certification, mandatory Quality Control Orders / QCOs, sampling, and proof tests).
- If answering in Hindi, use professional and natural Devanagari terminology.
`;

// Conversational Intent Matcher for natural Q&A
function generateConversationalNLPAnswer(
  query: string,
  mode: 'consumer' | 'industry',
  language: Language,
  topStd: any
): string {
  const q = query.toLowerCase().trim();

  // 1. Greetings & Pleasantries
  if (/^(hi|hello|hey|namaste|pranam|greetings|good morning|good evening|kaise ho|kya haal|नमस्ते|प्रणाम|हेलो|हाय)/i.test(q)) {
    if (language === 'hi') {
      return `नमस्ते! मैं आपका **बीआईएस सहायक (BIS Sahayak)** हूँ। 😊

मैं भारतीय मानकों (Indian Standards), उत्पाद सुरक्षा, और असली **ISI मार्क** की पहचान करने में आपकी मदद के लिए हमेशा तैयार हूँ।

आप मुझसे किसी भी उत्पाद के बारे में पूछ सकते हैं, जैसे:
• *"क्या मेरे प्रेशर कुकर पर ISI मार्क होना अनिवार्य है?"*
• *"घर बनाने के लिए कौन सा TMT सरिया (Fe 500D) सुरक्षित है?"*
• *"पीने के पानी की बोतल पर असली ISI मार्क कैसे पहचानें?"*
• *"नकली उत्पाद की शिकायत कैसे दर्ज करें?"*

बताइए, आज मैं आपकी क्या मदद कर सकता हूँ?`;
    } else {
      return `Namaste! I am your **BIS Sahayak (AI Assistant)**. 😊

I am here to help you easily understand Indian Standards, ensure product safety, and verify authentic **ISI marks** and **BIS Hallmarks**.

You can ask me questions in plain English or Hindi, such as:
• *"Is my domestic pressure cooker certified under mandatory QCO?"*
• *"Which TMT steel rebar (Fe 500D) should I choose for home construction?"*
• *"How do I check if packaged drinking water has a genuine ISI license?"*
• *"How do I verify a product or lodge a complaint on the BIS Care App?"*

How can I help you today?`;
    }
  }

  // 2. Who are you / Bot Identity
  if (/who are you|what can you do|kya kar sakte|tum kaun|aap kaun|about yourself|तुम्हारा काम/i.test(q)) {
    if (language === 'hi') {
      return `मैं **बीआईएस सहायक (BIS Sahayak)** हूँ — भारतीय मानक ब्यूरो (BIS) और उपभोक्ता मामले मंत्रालय के दिशा-निर्देशों पर आधारित एक स्मार्ट एआई सहायक।

मेरा काम भारतीय नागरिकों, उपभोक्ताओं और उद्योगों को मानकों की जानकारी सरल भाषा में देना है:
1. **उपभोक्ता सुरक्षा:** रोजमर्रा के सामान (प्रेशर कुकर, हेलमेट, पानी की बोतल, बिजली के तार, खिलौने) पर असली ISI मार्क की पुष्टि करना।
2. **उद्योग व निर्माण सहायता:** तकनीकी परीक्षण सीमाएं (जैसे TMT सरिए की तन्यता, सीमेंट की मजबूती, केबल इंसुलेशन) समझाना।
3. **लाइसेंस सत्यापन:** 7 या 8 अंकों के **CM/L लाइसेंस** की प्रामाणिकता जांचना।

आप किसी भी उत्पाद या मानक का नाम लिखकर सीधे सवाल पूछ सकते हैं!`;
    } else {
      return `I am **BIS Sahayak**, an intelligent AI assistant developed to bridge the gap between Indian Standards (BIS) and everyday citizens, consumers, and MSMEs.

Here is how I can assist you:
1. **Consumer Safety & Protection:** Understand whether products like pressure cookers, helmets, packaged water, cables, and toys meet mandatory safety laws.
2. **Quality Verification:** Guide you on how to spot authentic **ISI marks** and verify 7/8-digit **CM/L license numbers**.
3. **Engineering & Industry Parameters:** Provide testing limits (e.g. proof stress, elongation, burst pressure, microbiological purity) under official Indian Standards.

Feel free to ask any question about products, standards, or consumer rights!`;
    }
  }

  // 3. Fake Products / Complaints / BIS Care
  if (/complaint|fake|nakli|counterfeit|shikayat|report|bis care|dhokha|शिकायत|नकली/i.test(q)) {
    if (language === 'hi') {
      return `यदि आपको किसी उत्पाद पर नकली या संदिग्ध **ISI मार्क** दिखाई देता है, तो आप तुरंत यह कदम उठा सकते हैं:

1. **CM/L लाइसेंस नंबर जांचें:** असली ISI मार्क के नीचे 7 या 8 अंकों का CM/L नंबर लिखा होता है (उदा. CM/L-8400123)। अगर नंबर नहीं है, तो वह अवैध है।
2. **BIS Care मोबाइल ऐप का उपयोग करें:** गूगल प्ले स्टोर या एप्पल ऐप स्टोर से **BIS Care App** डाउनलोड करें और 'Verify License Details' पर जाकर CM/L नंबर डालें। इससे निर्माता का नाम और फैक्ट्री का पता तुरंत दिख जाएगा।
3. **ऑनलाइन शिकायत दर्ज करें:** BIS Care ऐप में **'Complaints'** सेक्शन पर जाकर उत्पाद की फोटो और दुकान का पता अपलोड करके सीधे उपभोक्ता मामले मंत्रालय को शिकायत भेज सकते हैं।

उपभोक्ता संरक्षण अधिनियम और BIS Act, 2016 के तहत अनिवार्य QCO उत्पादों पर नकली मार्क लगाना एक गैर-जमानती दंडात्मक अपराध है।`;
    } else {
      return `If you suspect a product is counterfeit or carrying a fake **ISI mark**, here is what you should do:

1. **Inspect the CM/L License Number:** Every authentic ISI mark must display a 7 or 8-digit CM/L license number directly under the logo (e.g. CM/L-8400123). Products with only the ISI logo and no number are counterfeit.
2. **Verify via BIS Care App:** Download the official **BIS Care Mobile App** and tap **'Verify License Details'**. Entering the CM/L number will instantly show the genuine manufacturer name, factory address, brand, and validity.
3. **Lodge an Instant Complaint:** Within the BIS Care App, use the **'Complaints'** portal to upload photos of the fake product and store location for direct enforcement action.

Under the BIS Act, 2016, selling sub-standard goods under mandatory Quality Control Orders (QCO) is a serious punishable offense.`;
    }
  }

  // 4. Specific Product Answers based on retrieved Indian Standard
  if (topStd) {
    if (language === 'hi') {
      if (mode === 'consumer') {
        return `**${topStd.isNumber} (${topStd.titleHi || topStd.title})** के बारे में सरल व आवश्यक जानकारी:

### 🛡️ यह आपके लिए क्यों महत्वपूर्ण है?
${topStd.scopeHi || topStd.scope}

### 🔍 खरीदते समय क्या ध्यान रखें?
• **असली ISI मार्क:** उत्पाद के बॉक्स और मुख्य बॉडी दोनों पर **ISI लोगो** जरूर देखें।
• **मानक संख्या व लाइसेंस:** लोगो के ऊपर **${topStd.isNumber}** और नीचे **7 या 8 अंकों का CM/L लाइसेंस नंबर** होना अनिवार्य है।
${topStd.status.includes('Mandatory') ? `• **अनिवार्य कानून (QCO):** यह उत्पाद भारत सरकार के गुणवत्ता नियंत्रण आदेश के तहत **अनिवार्य** है। इसे बिना वैध BIS लाइसेंस के बेचना कानूनन अपराध है।\n` : ''}• **BIS Care ऐप से जांच:** आप अपने फोन में **BIS Care ऐप** खोलकर लाइसेंस नंबर डालकर निर्माता की वैधता तुरंत चेक कर सकते हैं।

क्या आप इस मानक के किसी विशेष सुरक्षा नियम या परीक्षण के बारे में और जानना चाहते हैं?`;
      } else {
        return `**${topStd.isNumber}: ${topStd.title} (तकनीकी एवं उद्योग गाइड)**

### 📌 कार्यक्षेत्र एवं प्रयोज्यता:
${topStd.scope}

### ⚙️ मुख्य गुणवत्ता परीक्षण एवं स्वीकार्य सीमाएं:
${topStd.keyTests.map((t: any) => `• **${t.name}:** ${t.description} *(मानक सीमा: ${t.parameterLimit})*`).join('\n')}

### 📋 अनुपालन एवं अंकन आवश्यकताएं:
• **अनुरूपता योजना:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `• **अनिवार्य QCO आदेश:** ${topStd.qcoOrder}\n` : ''}• **अंकन नियम:** ${topStd.markingRequirements}

क्या आपको किसी विशिष्ट धारा (Clause) या परीक्षण विधि पर विस्तृत तकनीकी जानकारी चाहिए?`;
      }
    } else {
      if (mode === 'consumer') {
        return `Here is what you need to know about **${topStd.isNumber} (${topStd.title})** in simple terms:

### 🛡️ Why This Matters for Your Safety
${topStd.scope}

### 🔍 Practical Checklist When Buying:
• **Look for the ISI Mark:** Ensure the authentic **ISI logo** is clearly embossed or printed on the product and packaging.
• **Check the Details:** Verify that the standard number **${topStd.isNumber}** is printed on top and an authentic **7 or 8-digit CM/L license number** is at the bottom.
${topStd.status.includes('Mandatory') ? `• **Mandatory by Law (QCO):** This product is covered under a mandatory Quality Control Order. Manufacturing or selling it without a BIS license is illegal in India.\n` : ''}• **Instant Mobile Verification:** Use the official **BIS Care App** to type the CM/L number and confirm the manufacturer's factory details.

Would you like to know more about safety tips or specific features for this product?`;
      } else {
        return `**${topStd.isNumber}: ${topStd.title} — Technical & Compliance Overview**

### 📌 Scope & Industrial Applicability
${topStd.scope}

### ⚙️ Critical Quality Parameters & Acceptance Thresholds:
${topStd.keyTests.map((t: any) => `• **${t.name}:** ${t.description} *(Acceptance Limit: ${t.parameterLimit})*`).join('\n')}

### 📋 Regulatory & Marking Requirements:
• **Conformity Scheme:** ${topStd.conformityAssessmentScheme}
${topStd.qcoOrder ? `• **Mandatory QCO Mandate:** ${topStd.qcoOrder}\n` : ''}• **Marking Clause:** ${topStd.markingRequirements}

Let me know if you need specific clause provisions or sampling tolerances!`;
      }
    }
  }

  // 5. General Fallback
  if (language === 'hi') {
    return `भारतीय मानक ब्यूरो (BIS) के अनुसार, उत्पादों की गुणवत्ता और सुरक्षा सुनिश्चित करने के लिए मानक तय किए गए हैं।

आप जो भी सामान खरीदें, उस पर **ISI मार्क** और नीचे लिखा **7/8 अंकों का CM/L लाइसेंस नंबर** अवश्य देखें। इसे आप सीधे **BIS Care मोबाइल ऐप** से सत्यापित कर सकते हैं।

आप किसी खास उत्पाद (जैसे प्रेशर कुकर, पानी की बोतल, सरिया, केबल, हेलमेट) का नाम लिखकर पूछ सकते हैं!`;
  } else {
    return `Under the Bureau of Indian Standards framework, Indian Standards (IS) define rigorous quality, durability, and safety criteria for consumer goods and industrial materials.

Always look for the genuine **ISI Mark** along with the **7 or 8-digit CM/L license number**, and verify it using the official **BIS Care App**.

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

  if (citationMap.size < 2) {
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
      } catch (err: any) {
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

