export type Language = 'en' | 'hi';

export const UI_TEXT = {
  en: {
    appTitle: 'BIS Sahayak',
    appSubtitle: 'AI Assistant for Indian Standards & BIS Services',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    govtIndia: 'Government of India',
    consumerMode: 'Consumer Mode',
    industryMode: 'Industry / MSME Mode',
    consumerDesc: 'Plain-language guidance, ISI verification, safety alerts & consumer rights',
    industryDesc: 'Technical specifications, testing parameters, QCO compliance & HS codes',
    navHome: 'Assistant',
    navStandards: 'Standards Directory',
    navRecommend: 'AI Recommender (SIH26108)',
    navVerify: 'Verify ISI Mark',
    heroTag: 'Smart India Hackathon 2026 • Problem SIH26107',
    heroHeading: 'Intelligent AI Assistant for Indian Standards & Compliance',
    heroSubheading: 'Empowering 1.4 Billion Indian consumers and MSMEs with instant plain-language verification, technical testing protocols, and automated procurement specification matching.',
    searchPlaceholder: 'Ask about any product or standard (e.g., Is my pressure cooker BIS certified? What standard applies to LPG cylinders?)',
    send: 'Send',
    thinking: 'Searching Bureau of Indian Standards corpus & analyzing clauses...',
    sources: 'Cited Indian Standards',
    viewDetails: 'View Standard & Clauses',
    copy: 'Copy Response',
    copied: 'Copied!',
    speak: 'Listen (Audio)',
    stopSpeak: 'Stop Audio',
    clearChat: 'Clear History',
    samplePromptsTitle: 'Popular Indian Standards Inquiries',
    verifiedBIS: 'Official BIS Framework Compliant',
    qcoMandatory: 'Mandatory (QCO)',
    voluntary: 'Voluntary Standard',
    standardNumber: 'Standard Number',
    category: 'Category',
    sector: 'Sector',
    scope: 'Scope & Purpose',
    keyTests: 'Key Testing Parameters & Limits',
    markingReq: 'Mandatory Marking Requirements',
    consumerAdvisory: 'Consumer Advisory & Verification',
    industryNotes: 'Industry & Laboratory Testing Notes',
    clauses: 'Standard Clauses & Sub-sections',
    recommendTitle: 'AI Procurement & Specification Matcher',
    recommendSubtitle: 'Paste a product requirement, bill of materials, or tender spec to automatically discover applicable Indian Standards.',
    specInputPlaceholder: 'e.g., Supply of 5000 units of 16A 3-pin plugs and 1.5 sq mm flame-retardant copper wiring cables for new administrative building...',
    analyzeSpec: 'Analyze & Recommend Standards',
    analyzing: 'Extracting technical specs & running vector similarity...',
    matchScore: 'Match Confidence',
    whyApplicable: 'Reason for Applicability',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    totalStandards: 'Indian Standards Cataloged',
    qcoOrdersCount: 'Mandatory QCOs Covered',
    instantAnswers: 'Instant AI Grounding',
    verifyMarkTitle: 'Verify ISI Mark & CM/L License',
    verifyMarkSub: 'How to check authentic BIS certification and protect against counterfeit goods',
    verifyStep1: 'Look for the ISI logo on the product body or label.',
    verifyStep2: 'Check for the 7 or 8-digit CM/L license number directly below the logo.',
    verifyStep3: 'Check the IS standard number written on top of the ISI mark (e.g. IS 2347).',
    verifyStep4: 'Verify instantly on the BIS Care Mobile App or the national portal.'
  },
  hi: {
    appTitle: 'बीआईएस सहायक',
    appSubtitle: 'भारतीय मानकों और बीआईएस सेवाओं के लिए एआई सहायक',
    ministry: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
    govtIndia: 'भारत सरकार',
    consumerMode: 'उपभोक्ता मोड',
    industryMode: 'उद्योग / एमएसएमई मोड',
    consumerDesc: 'सरल भाषा में मार्गदर्शन, आईएसआई सत्यापन, सुरक्षा अलर्ट और उपभोक्ता अधिकार',
    industryDesc: 'तकनीकी विनिर्देश, परीक्षण पैरामीटर, क्यूसीओ अनुपालन और एचएस कोड',
    navHome: 'सहायक',
    navStandards: 'मानक निर्देशिका',
    navRecommend: 'एआई अनुशंसा इंजन (SIH26108)',
    navVerify: 'आईएसआई मार्क जांचें',
    heroTag: 'स्मार्ट इंडिया हैकथॉन 2026 • समस्या SIH26107',
    heroHeading: 'भारतीय मानकों और गुणवत्ता अनुपालन के लिए एआई सहायक',
    heroSubheading: '140 करोड़ भारतीय उपभोक्ताओं और उद्योगों को त्वरित सरल-भाषा मार्गदर्शन, तकनीकी परीक्षण प्रक्रियाएं और निविदा विनिर्देश मिलान की सुविधा।',
    searchPlaceholder: 'किसी भी उत्पाद या मानक के बारे में पूछें (उदा. क्या मेरा प्रेशर कुकर बीआईएस प्रमाणित है? एलपीजी सिलेंडर पर कौन सा मानक लागू होता है?)',
    send: 'पूछें',
    thinking: 'भारतीय मानक ब्यूरो कॉर्पस से प्रासंगिक धाराओं का विश्लेषण किया जा रहा है...',
    sources: 'उद्धृत भारतीय मानक (IS)',
    viewDetails: 'मानक व धाराएं देखें',
    copy: 'उत्तर कॉपी करें',
    copied: 'कॉपी हो गया!',
    speak: 'ऑडियो सुनें',
    stopSpeak: 'ऑडियो रोकें',
    clearChat: 'इतिहास साफ करें',
    samplePromptsTitle: 'अक्सर पूछे जाने वाले भारतीय मानक',
    verifiedBIS: 'बीआईएस फ्रेमवर्क के अनुरूप',
    qcoMandatory: 'अनिवार्य (QCO)',
    voluntary: 'स्वैच्छिक मानक',
    standardNumber: 'मानक संख्या',
    category: 'श्रेणी',
    sector: 'क्षेत्र',
    scope: 'दायरा और उद्देश्य',
    keyTests: 'प्रमुख परीक्षण पैरामीटर और सीमाएं',
    markingReq: 'अनिवार्य अंकन आवश्यकताएं',
    consumerAdvisory: 'उपभोक्ता सुरक्षा सलाह व सत्यापन',
    industryNotes: 'उद्योग व प्रयोगशाला परीक्षण नोट्स',
    clauses: 'मानक की प्रमुख धाराएं',
    recommendTitle: 'एआई खरीद एवं विनिर्देश अनुशंसा इंजन',
    recommendSubtitle: 'लागू भारतीय मानकों को स्वचालित रूप से खोजने के लिए उत्पाद विनिर्देश या निविदा आवश्यकताएं दर्ज करें।',
    specInputPlaceholder: 'उदा. नए भवन के लिए 16A 3-पिन प्लग और 1.5 वर्ग मिमी तांबे की अग्नि-रोधी वायरिंग केबल की आपूर्ति...',
    analyzeSpec: 'मानक खोजें और विश्लेषण करें',
    analyzing: 'तकनीकी विनिर्देशों और वेक्टर समानता का मिलान हो रहा है...',
    matchScore: 'अनुरूपता स्कोर',
    whyApplicable: 'लागू होने का कारण',
    allCategories: 'सभी श्रेणियां',
    allStatuses: 'सभी स्थितियां',
    totalStandards: 'सूचीबद्ध भारतीय मानक',
    qcoOrdersCount: 'शामिल अनिवार्य QCO आदेश',
    instantAnswers: 'त्वरित एआई प्रतिक्रिया',
    verifyMarkTitle: 'आईएसआई मार्क और CM/L लाइसेंस जांचें',
    verifyMarkSub: 'प्रामाणिक बीआईएस प्रमाणीकरण की जांच और नकली उत्पादों से बचाव का तरीका',
    verifyStep1: 'उत्पाद पर आईएसआई (ISI) लोगो देखें।',
    verifyStep2: 'लोगो के ठीक नीचे 7 या 8 अंकों का CM/L लाइसेंस नंबर जांचें।',
    verifyStep3: 'आईएसआई मार्क के ऊपर लिखी IS मानक संख्या (उदा. IS 2347) देखें।',
    verifyStep4: 'BIS Care मोबाइल ऐप पर लाइसेंस नंबर दर्ज करके तुरंत पुष्टि करें।'
  }
};

export const SAMPLE_PROMPTS = {
  consumer: [
    {
      en: 'Is this pressure cooker BIS certified and safe?',
      hi: 'क्या मेरा घरेलू प्रेशर कुकर बीआईएस प्रमाणित और सुरक्षित है?'
    },
    {
      en: 'What does the ISI mark on packaged drinking water mean?',
      hi: 'पैकेज्ड पीने के पानी की बोतल पर आईएसआई मार्क का क्या अर्थ है?'
    },
    {
      en: 'Which standard applies to domestic LPG cylinders and how to check test date?',
      hi: 'घरेलू एलपीजी सिलेंडर पर कौन सा मानक लागू होता है और एक्सपायरी कैसे जांचें?'
    },
    {
      en: 'Are children toys required to have mandatory ISI marks in India?',
      hi: 'क्या भारत में बच्चों के खिलौनों पर आईएसआई मार्क होना अनिवार्य है?'
    }
  ],
  industry: [
    {
      en: 'What are the tensile stress and bend test requirements under IS 1786 for Fe 500D TMT bars?',
      hi: 'Fe 500D टीएमटी सरियों के लिए IS 1786 के तहत तन्यता और बेंड टेस्ट की क्या आवश्यकताएं हैं?'
    },
    {
      en: 'Detail the dielectric strength and spark testing requirements for IS 694 PVC cables.',
      hi: 'IS 694 पीवीसी केबलों के लिए ढांकता हुआ शक्ति और स्पार्क परीक्षण आवश्यकताओं का विवरण दें।'
    },
    {
      en: 'What are the mandatory water recovery limits for RO purifiers under IS 16240:2023?',
      hi: 'IS 16240:2023 के तहत घरेलू आरओ प्यूरीफायर के लिए अनिवार्य जल रिकवरी सीमाएं क्या हैं?'
    },
    {
      en: 'Explain the testing procedures for 2-wheeler helmets under IS 16018:2021.',
      hi: 'IS 16018:2021 के तहत दोपहिया हेलमेट की परीक्षण प्रक्रियाओं को समझाएं।'
    }
  ]
};
