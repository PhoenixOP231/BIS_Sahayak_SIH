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
    navVerify: 'Verify ISI Mark',
    heroTag: 'Smart India Hackathon 2026 • Problem SIH26107',
    heroHeading: 'Intelligent AI Assistant for Indian Standards & Compliance',
    heroSubheading: 'Empowering 1.4 Billion Indian consumers and MSMEs with instant plain-language verification, technical testing protocols, and mandatory Quality Control Order (QCO) guidance.',
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
    verifyStep4: 'Verify instantly on the BIS Care Mobile App or the national portal.',

    // Verifier Page & UI
    indexedBadge: '1,000+ Real BIS Products Indexed',
    verifierSubtitle: 'Instant pre-indexed license verification, regional Scheme-I decoding, and live Government of India BIS Gateway',
    browseProductsBtn: 'Browse 1,000+ Genuine Products',
    tipBannerTitle: 'Checking Water Bottles, Pressure Cookers, or Appliances?',
    tipBannerDescStart: 'Search by',
    cmlLabel: 'CM/L License Number',
    brandNameLabel: 'Brand Name',
    isStandardLabel: 'IS Standard',
    tipBannerKenson: 'for Kenson Cooker',
    tipBannerBisleri: 'for Bisleri',
    inputLabel: 'Enter CM/L License Number, Brand Name, or Standard Code:',
    inputPlaceholder: "e.g. CM/L-8270877 (Kenson), CM/L-5100087 (Bisleri), 'Prestige', or 'IS 2347'",
    verifyBtn: 'Verify Product',
    scanningBtn: 'Scanning BIS Registry...',
    quickChipsHeader: '1-Click Real Product Samples & Fake Test Chips:',

    // Quick Chip Labels
    chipKenson: 'Kenson Cooker',
    chipBisleri: 'Bisleri',
    chipPrestige: 'Prestige Cooker',
    chipAquafina: 'Aquafina',
    chipTataTiscon: 'Tata Tiscon Steel',
    chipHavells: 'Havells Wire',
    chipIndane: 'Indane Gas',
    chipSuspended: 'Suspended License',
    chipFakeCode: 'Test Fake Code',
    chipDummyStamp: 'Dummy Stamp',

    // Holographic Scanner Buffer
    scannerAuditPill: 'BIS Scheme-I Hologram & Ledger Audit',
    scannerStep0: 'Connecting to National Manakonline Gateway...',
    scannerStep1: 'Inspecting CM/L Checksum & Holographic Watermark...',
    scannerStep2: 'Cross-referencing Regional Directorate & Neon Cloud DB...',
    scannerStep3: 'Cryptographic Validation Successful!',
    targetLabel: 'TARGET:',
    secHash: 'SECURITY HASH: SHA-256',
    auditedLabel: 'AUDITED',
    telemetryBisGateway: 'BIS Gateway: OK',
    telemetryNeonCloud: 'Neon Cloud: Synced',
    telemetryIntegrity: 'Integrity: Secured',

    // Results - Authentic
    authenticLicenseBadge: 'Authentic BIS License',
    statusPrefix: 'Status:',
    statusOperative: 'OPERATIVE',
    statusSuspendedVal: 'SUSPENDED',
    cloudDbSyncedBadge: 'Cloud DB (Daily Synced)',
    specTitle: 'Standard Specification',
    plantLocationTitle: 'Certified Plant Location',
    validityPeriodTitle: 'License Validity Period',
    validUntilPrefix: 'Valid until',
    indiaSuffix: 'India',
    crossRefRegistryNotice: 'Cross-referenced with BIS Scheme-I Certified Manufacturer Registry.',
    viewLimitsAction: 'View {isNumber} Technical Limits',

    // Results - Regional Scheme-I
    regionalBadge: 'Valid Scheme-I License Format',
    regionalPlantSubtitle: 'Regional Certified Manufacturing Plant',
    regulatoryFormatTitle: 'Regulatory Format Verification',
    regulatoryFormatDesc: 'This CM/L number complies with the official Bureau of Indian Standards (BIS) Scheme-I product certification scheme under mandatory Central Quality Control Orders (QCO).',
    livePortalTitle: 'Live Government Portal Inspection',
    livePortalDesc: "For plants not in our instant offline cache, connect directly to the Government of India's central database to inspect real-time batch test logs and factory ownership records.",
    checkManakonlineBtn: 'Check on National BIS Manakonline Portal',
    verifyBisCareBtn: 'Verify on BIS Care App',

    // Results - Suspended
    suspendedLicenseBadge: 'License Suspended / Revoked',
    suspendedDefaultMsg: 'This manufacturer license was suspended or cancelled by the Bureau of Indian Standards.',
    consumerAdvisoryHeading: 'Consumer Advisory:',
    consumerAdvisoryBody: 'Selling products with a suspended BIS license is illegal under Section 29 of the BIS Act, 2016. If you find this product being sold in stores, you can report it directly on the BIS Care Mobile App.',

    // Results - Counterfeit
    fakeBadge: '🚨 KNOWN FAKE / DUMMY SEQUENCE',
    fakeDetectedTitle: 'Counterfeit Stamp Detected',
    criminalPenaltyTitle: 'Criminal Penalty Warning:',
    criminalPenaltyBody: 'Dummy repeated numbers like 11111111, 12234444, or 12345678 are commonly printed by fraudulent counterfeiters. Products carrying such stamps violate Section 29 of the BIS Act and carry severe hazards of contamination, domestic fire, and explosion.',

    // Results - Standard Code
    standardDetectedBadge: 'Standard Number Detected',
    standardDetectedDesc: 'You entered the Indian Standard specification code ({isNum}) that is printed on top of the ISI mark on your product.',
    howToFindCmlTitle: 'How to find the 7/8-digit CM/L Number on your product:',
    stepTopLineLabel: '1. Top Line',
    stepTopLineDesc: '{isNum} (Quality Standard)',
    stepCenterMonoLabel: '2. Center Monogram',
    stepCenterMonoDesc: 'Official ISI framed logo',
    stepBottomLineLabel: '3. Bottom Line (CM/L)',
    stepBottomLineDesc: 'CM/L-XXXXXXX (Type this number)',
    inspectLimitsPrompt: 'Want to inspect testing limits and mandatory chemical/microbiological tolerances?',
    inspectClausesBtn: 'Inspect {isNum} Clauses',

    // Results - Invalid Query
    invalidQueryTitle: 'Invalid License Query',
    invalidQueryDefaultMsg: 'CM/L license number must contain exactly 7 or 8 digits.',
    invalidQueryTip: '💡 Tip: Search for any brand name below (e.g. Kenson, Bisleri, Prestige, Aquafina, Tata Tiscon, Indane, Havells, Kent RO) or click on any product card in the directory below!',

    // 4-Step Checklist
    checklistHeading: '4-Step Authenticity Checklist (How to Spot Fakes)',
    checklistSubheading: 'How to inspect authentic ISI marking against counterfeit products in the market:',
    check1Heading: 'Top: IS Standard Number',
    check1Body: 'Look for the IS standard number written on top of the ISI mark (e.g. IS 2347 for Cookers, IS 14543 for Water).',
    check2Heading: 'Centre: Authentic ISI Logo',
    check2Body: 'Look for the official geometric monogram with interlocking I-S-I characters inside a rectangular border.',
    check3Heading: 'Bottom: 7/8 Digit CM/L Number',
    check3Body: 'Must be printed beneath the logo (e.g. CM/L-8270877). If this number is missing or a fake dummy sequence, the product is counterfeit!',
    check4Heading: 'Instant In-App Verification',
    check4Body: 'Verify instantly on this portal or download the official BIS Care Mobile App to verify Hallmarks & file complaints.',

    // Directory
    directoryHeading: 'Certified BIS Products & License Registry',
    directorySubheading: 'Browse authentic certified products in the indexed registry. Click "Verify Code" to test any product instantly!',
    showingCount: 'Showing {count} Products',
    directorySearchPlaceholder: 'Search products by brand (e.g. Kenson, Prestige, Bisleri), state, IS standard, or CM/L code...',
    statusAll: 'All Statuses',
    statusOperativeOnly: 'Operative Only',
    statusSuspendedOnly: 'Suspended Only',
    copyCmlTooltip: 'Copy CM/L Code',
    verifyCodeBtn: 'Verify Code',
    validPrefix: 'Valid:',
    loadMoreBtn: 'Load More Certified Products ({count} more)',
    noProductsMatch: 'No products in the local registry match "{query}".',
    noProductsSubtext: 'If your product has this CM/L code printed on it, you can test it directly in the Verifier above to check its BIS Scheme-I regional branch jurisdiction and live Manakonline connection!',
    clearSearchBtn: 'Clear Search Filter',
    testInVerifierBtn: 'Test "{query}" in Verifier',

    // Official Mobile App Banner
    appBannerTitle: 'Verify Live on the Official BIS Care Mobile App',
    appBannerDesc: 'Scan QR codes, verify Gold Hallmarks (HUID), check real-time factory validity & register consumer grievances directly with the Government of India.',
    downloadAppBtn: 'Download App'
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
    navVerify: 'आईएसआई मार्क जांचें',
    heroTag: 'स्मार्ट इंडिया हैकथॉन 2026 • समस्या SIH26107',
    heroHeading: 'भारतीय मानकों और गुणवत्ता अनुपालन के लिए एआई सहायक',
    heroSubheading: '140 करोड़ भारतीय उपभोक्ताओं और उद्योगों को त्वरित सरल-भाषा मार्गदर्शन, तकनीकी परीक्षण प्रक्रियाएं और अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) की जानकारी।',
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
    verifyStep4: 'BIS Care मोबाइल ऐप पर लाइसेंस नंबर दर्ज करके तुरंत पुष्टि करें।',

    // Verifier Page & UI
    indexedBadge: '1,000+ वास्तविक बीआईएस उत्पाद अनुक्रमित',
    verifierSubtitle: 'त्वरित लाइसेंस सत्यापन, क्षेत्रीय स्कीम-I डिकोडिंग, और लाइव भारत सरकार बीआईएस गेटवे',
    browseProductsBtn: '1,000+ प्रामाणिक उत्पाद देखें',
    tipBannerTitle: 'पानी की बोतलें, प्रेशर कुकर या घरेलू उपकरण जांच रहे हैं?',
    tipBannerDescStart: 'द्वारा खोजें:',
    cmlLabel: 'CM/L लाइसेंस नंबर',
    brandNameLabel: 'ब्रांड नाम',
    isStandardLabel: 'IS मानक',
    tipBannerKenson: 'केन्सन कुकर के लिए',
    tipBannerBisleri: 'बिसलेरी के लिए',
    inputLabel: 'CM/L लाइसेंस नंबर, ब्रांड नाम या मानक कोड दर्ज करें:',
    inputPlaceholder: "उदा. CM/L-8270877 (केन्सन), CM/L-5100087 (बिसलेरी), 'Prestige', या 'IS 2347'",
    verifyBtn: 'उत्पाद सत्यापित करें',
    scanningBtn: 'बीआईएस रजिस्ट्री जांची जा रही है...',
    quickChipsHeader: '1-क्लिक वास्तविक उत्पाद नमूने और फर्जी परीक्षण चिप्स:',

    // Quick Chip Labels
    chipKenson: 'केन्सन कुकर',
    chipBisleri: 'बिसलेरी पानी',
    chipPrestige: 'प्रेस्टीज कुकर',
    chipAquafina: 'एक्वाफिना पानी',
    chipTataTiscon: 'टाटा टिस्कॉन सरिया',
    chipHavells: 'हैवेल्स वायर',
    chipIndane: 'इण्डेन गैस',
    chipSuspended: 'निलंबित लाइसेंस',
    chipFakeCode: 'फर्जी कोड परीक्षण',
    chipDummyStamp: 'डमी स्टाम्प',

    // Holographic Scanner Buffer
    scannerAuditPill: 'बीआईएस स्कीम-I होलोग्राम एवं लेजर ऑडिट',
    scannerStep0: 'राष्ट्रीय मानकऑनलाइन गेटवे से कनेक्ट हो रहा है...',
    scannerStep1: 'CM/L चेकसम और होलोग्राम वॉटरमार्क का निरीक्षण जारी...',
    scannerStep2: 'क्षेत्रीय निदेशालय और नियॉन क्लाउड डेटाबेस से मिलान जारी...',
    scannerStep3: 'क्रिप्टोग्राफिक सत्यापन सफल!',
    targetLabel: 'लक्ष्य:',
    secHash: 'सुरक्षा हैश: SHA-256',
    auditedLabel: 'ऑडिट पूर्ण',
    telemetryBisGateway: 'बीआईएस गेटवे: सक्रिय',
    telemetryNeonCloud: 'नियॉन क्लाउड: सिंक',
    telemetryIntegrity: 'सुरक्षा: प्रमाणित',

    // Results - Authentic
    authenticLicenseBadge: 'प्रमाणिक बीआईएस लाइसेंस',
    statusPrefix: 'स्थिति:',
    statusOperative: 'सक्रिय (वैध)',
    statusSuspendedVal: 'निलंबित',
    cloudDbSyncedBadge: 'क्लाउड डेटाबेस (दैनिक सिंक)',
    specTitle: 'मानक विनिर्देश',
    plantLocationTitle: 'प्रमाणित संयंत्र स्थान',
    validityPeriodTitle: 'लाइसेंस वैधता अवधि',
    validUntilPrefix: 'तक वैध:',
    indiaSuffix: 'भारत',
    crossRefRegistryNotice: 'बीआईएस स्कीम-I प्रमाणित निर्माता रजिस्ट्री द्वारा सत्यापित।',
    viewLimitsAction: '{isNumber} तकनीकी सीमाएं देखें',

    // Results - Regional Scheme-I
    regionalBadge: 'वैध स्कीम-I लाइसेंस प्रारूप',
    regionalPlantSubtitle: 'क्षेत्रीय प्रमाणित विनिर्माण संयंत्र',
    regulatoryFormatTitle: 'नियामक प्रारूप सत्यापन',
    regulatoryFormatDesc: 'यह CM/L नंबर अनिवार्य केंद्रीय गुणवत्ता नियंत्रण आदेश (QCO) के तहत आधिकारिक भारतीय मानक ब्यूरो (BIS) स्कीम-I उत्पाद प्रमाणीकरण योजना का अनुपालन करता है।',
    livePortalTitle: 'लाइव सरकारी पोर्टल निरीक्षण',
    livePortalDesc: 'सेंट्रल डेटाबेस से वास्तविक समय के बैच परीक्षण लॉग और फैक्ट्री स्वामित्व रिकॉर्ड का निरीक्षण करने के लिए सीधे भारत सरकार के पोर्टल से जुड़ें।',
    checkManakonlineBtn: 'राष्ट्रीय बीआईएस मानकऑनलाइन पोर्टल पर देखें',
    verifyBisCareBtn: 'BIS Care ऐप पर सत्यापित करें',

    // Results - Suspended
    suspendedLicenseBadge: 'लाइसेंस निलंबित / निरस्त',
    suspendedDefaultMsg: 'यह निर्माता लाइसेंस भारतीय मानक ब्यूरो द्वारा निलंबित या रद्द कर दिया गया था।',
    consumerAdvisoryHeading: 'उपभोक्ता चेतावनी:',
    consumerAdvisoryBody: 'बीआईएस अधिनियम, 2016 की धारा 29 के तहत निलंबित बीआईएस लाइसेंस वाले उत्पाद बेचना अवैध है। यदि यह उत्पाद दुकानों में बिकता मिले, तो आप सीधे BIS Care मोबाइल ऐप पर शिकायत दर्ज कर सकते हैं।',

    // Results - Counterfeit
    fakeBadge: '🚨 ज्ञात फर्जी / नकली अनुक्रम',
    fakeDetectedTitle: 'नकली स्टाम्प का पता चला',
    criminalPenaltyTitle: 'आपराधिक दंड चेतावनी:',
    criminalPenaltyBody: '11111111, 12234444 या 12345678 जैसे बार-बार दोहराए जाने वाले नंबर अक्सर धोखेबाज जालसाजों द्वारा छापे जाते हैं। ऐसे स्टाम्प वाले उत्पाद बीआईएस अधिनियम की धारा 29 का उल्लंघन करते हैं और इनमें संदूषण, आग व विस्फोट का गंभीर खतरा होता है।',

    // Results - Standard Code
    standardDetectedBadge: 'मानक संख्या पहचानी गई',
    standardDetectedDesc: 'आपने भारतीय मानक विनिर्देश कोड ({isNum}) दर्ज किया है जो आपके उत्पाद पर आईएसआई मार्क के ऊपर अंकित होता है।',
    howToFindCmlTitle: 'अपने उत्पाद पर 7/8 अंकों का CM/L नंबर कैसे खोजें:',
    stepTopLineLabel: '1. शीर्ष पंक्ति',
    stepTopLineDesc: '{isNum} (गुणवत्ता मानक)',
    stepCenterMonoLabel: '2. केंद्रीय मोनोग्राम',
    stepCenterMonoDesc: 'आधिकारिक आईएसआई फ्रेम लोगो',
    stepBottomLineLabel: '3. निचली पंक्ति (CM/L)',
    stepBottomLineDesc: 'CM/L-XXXXXXX (यह नंबर दर्ज करें)',
    inspectLimitsPrompt: 'क्या आप परीक्षण सीमाएं और अनिवार्य सहनशीलताएं देखना चाहते हैं?',
    inspectClausesBtn: '{isNum} धाराएं देखें',

    // Results - Invalid Query
    invalidQueryTitle: 'अमान्य लाइसेंस खोज',
    invalidQueryDefaultMsg: 'CM/L लाइसेंस नंबर में ठीक 7 या 8 अंक होने चाहिए।',
    invalidQueryTip: '💡 सुझाव: नीचे किसी भी ब्रांड नाम (उदा. Kenson, Bisleri, Prestige, Aquafina, Tata Tiscon, Indane, Havells, Kent RO) को खोजें या निर्देशिका में किसी उत्पाद कार्ड पर क्लिक करें!',

    // 4-Step Checklist
    checklistHeading: '4-चरणीय प्रामाणिकता चेकलिस्ट (नकली उत्पादों की पहचान कैसे करें)',
    checklistSubheading: 'बाजार में नकली उत्पादों के विरुद्ध प्रामाणिक आईएसआई मार्किंग की जांच कैसे करें:',
    check1Heading: 'शीर्ष: IS मानक संख्या',
    check1Body: 'आईएसआई मार्क के ऊपर लिखी IS मानक संख्या देखें (उदा. कुकर के लिए IS 2347, पानी के लिए IS 14543)।',
    check2Heading: 'केंद्र: प्रामाणिक ISI लोगो',
    check2Body: 'आयताकार बॉर्डर के भीतर इंटरलॉकिंग I-S-I अक्षरों वाला आधिकारिक ज्यामितीय मोनोग्राम देखें।',
    check3Heading: 'निचला भाग: 7/8 अंकों का CM/L नंबर',
    check3Body: 'लोगो के ठीक नीचे मुद्रित होना चाहिए (उदा. CM/L-8270877)। यदि यह संख्या गायब है या फर्जी है, तो उत्पाद नकली है!',
    check4Heading: 'त्वरित इन-ऐप सत्यापन',
    check4Body: 'इस पोर्टल पर तुरंत सत्यापित करें या हॉलमार्क जांचने और शिकायत दर्ज करने के लिए आधिकारिक BIS Care मोबाइल ऐप डाउनलोड करें।',

    // Directory
    directoryHeading: 'प्रमाणित बीआईएस उत्पाद एवं लाइसेंस रजिस्ट्री',
    directorySubheading: 'अनुक्रमित रजिस्ट्री में प्रामाणिक प्रमाणित उत्पादों को ब्राउज़ करें। किसी भी उत्पाद को तुरंत जांचने के लिए "कोड सत्यापित करें" पर क्लिक करें!',
    showingCount: '{count} उत्पाद दिखाए जा रहे हैं',
    directorySearchPlaceholder: 'ब्रांड (उदा. Kenson, Prestige, Bisleri), राज्य, IS मानक, या CM/L कोड द्वारा उत्पाद खोजें...',
    statusAll: 'सभी स्थितियां',
    statusOperativeOnly: 'केवल सक्रिय (वैध)',
    statusSuspendedOnly: 'केवल निलंबित',
    copyCmlTooltip: 'CM/L कोड कॉपी करें',
    verifyCodeBtn: 'कोड सत्यापित करें',
    validPrefix: 'वैधता:',
    loadMoreBtn: 'और प्रमाणित उत्पाद लोड करें ({count} शेष)',
    noProductsMatch: 'स्थानीय रजिस्ट्री में "{query}" से मेल खाने वाला कोई उत्पाद नहीं मिला।',
    noProductsSubtext: 'यदि आपके उत्पाद पर यह CM/L कोड अंकित है, तो आप इसका क्षेत्रीय अधिकार क्षेत्र और लाइव पोर्टल कनेक्शन जांचने के लिए इसे ऊपर सीधे सत्यापित कर सकते हैं!',
    clearSearchBtn: 'सर्च फ़िल्टर साफ़ करें',
    testInVerifierBtn: 'सत्यापक में "{query}" जांचें',

    // Official Mobile App Banner
    appBannerTitle: 'आधिकारिक BIS Care मोबाइल ऐप पर लाइव सत्यापित करें',
    appBannerDesc: 'क्यूआर कोड स्कैन करें, गोल्ड हॉलमार्क (HUID) जांचें, रियल-टाइम फैक्ट्री वैधता देखें और भारत सरकार के पास शिकायत दर्ज करें।',
    downloadAppBtn: 'ऐप डाउनलोड करें'
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
