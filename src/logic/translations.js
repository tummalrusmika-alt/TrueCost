// src/logic/translations.js
// Language detection and screen text for English, Telugu and Hindi.

export const LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
];

// Detects the language from the script the user typed.
// Telugu characters: U+0C00-U+0C7F, Hindi (Devanagari): U+0900-U+097F.
export function detectLanguage(text) {
  if (typeof text !== 'string') return 'en';

  const telugu = (text.match(/[ఀ-౿]/g) || []).length;
  const hindi = (text.match(/[ऀ-ॿ]/g) || []).length;

  if (telugu === 0 && hindi === 0) return 'en';
  return telugu >= hindi ? 'te' : 'hi';
}

// Turns the dropdown value into en / te / hi.
export function resolveLanguage(choice, text) {
  if (choice === 'en' || choice === 'te' || choice === 'hi') {
    return choice;
  }
  return detectLanguage(text);
}

// ---------------------------------------------------------------
// Screen text
// ---------------------------------------------------------------

export const UI = {
  en: {
    languageLabel: 'Language',
    scamTitle: 'Check a loan message for scam signs',
    scamPlaceholder: 'Paste a loan SMS / WhatsApp message here',
    checkButton: 'Check message',
    checkingButton: 'Checking...',
    sampleButton: 'Use sample scam message',
    emptyMessage: 'Paste a message first.',
    checkFailed: 'Unable to check this message. Please try again.',
    riskLevel: 'Risk level',
    levels: { Low: 'Low', Medium: 'Medium', High: 'High' },
    scoreTitle: 'Scam Risk Score',
    scoreHigh: 'Several serious warning signs were detected.',
    scoreMedium: 'Some warning signs were detected. Verify carefully.',
    scoreLow: 'Few common warning signs were detected. Stay alert.',
    whyFlagged: 'Why was this message flagged?',
    noFlags: 'No common scam signs found, but stay careful.',
    nextStepsTitle: 'What should you do?',
    aiExplanation: 'AI explanation',
    ruleExplanation: 'Rule-based explanation',
    aiLoading: 'Preparing explanation...',
    ruleDone: 'Rule-based scam detection completed.',
    aiDone: 'AI explanation ready.',
    aiFallback: 'AI is busy right now, so a rule-based explanation is shown.',
    footerNote:
      'This is a rule-based screening score, not a guarantee that a message is safe or fraudulent.',
  },

  te: {
    languageLabel: 'భాష',
    scamTitle: 'రుణ సందేశంలో మోసం సంకేతాలను తనిఖీ చేయండి',
    scamPlaceholder: 'రుణ SMS / WhatsApp సందేశాన్ని ఇక్కడ అతికించండి',
    checkButton: 'సందేశాన్ని తనిఖీ చేయండి',
    checkingButton: 'తనిఖీ చేస్తోంది...',
    sampleButton: 'నమూనా మోసపు సందేశాన్ని వాడండి',
    emptyMessage: 'ముందుగా ఒక సందేశాన్ని అతికించండి.',
    checkFailed: 'ఈ సందేశాన్ని తనిఖీ చేయలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.',
    riskLevel: 'ప్రమాద స్థాయి',
    levels: { Low: 'తక్కువ', Medium: 'మధ్యస్థం', High: 'అధికం' },
    scoreTitle: 'మోసం ప్రమాద స్కోరు',
    scoreHigh: 'అనేక తీవ్రమైన హెచ్చరిక సంకేతాలు గుర్తించబడ్డాయి.',
    scoreMedium: 'కొన్ని హెచ్చరిక సంకేతాలు గుర్తించబడ్డాయి. జాగ్రత్తగా ధృవీకరించండి.',
    scoreLow: 'కొన్ని సాధారణ హెచ్చరిక సంకేతాలు మాత్రమే కనిపించాయి. జాగ్రత్తగా ఉండండి.',
    whyFlagged: 'ఈ సందేశం ఎందుకు గుర్తించబడింది?',
    noFlags: 'సాధారణ మోసపు సంకేతాలు కనిపించలేదు, అయినా జాగ్రత్తగా ఉండండి.',
    nextStepsTitle: 'మీరు ఏమి చేయాలి?',
    aiExplanation: 'AI వివరణ',
    ruleExplanation: 'నియమాల ఆధారిత వివరణ',
    aiLoading: 'వివరణ సిద్ధం చేస్తోంది...',
    ruleDone: 'నియమాల ఆధారిత మోసం తనిఖీ పూర్తైంది.',
    aiDone: 'AI వివరణ సిద్ధంగా ఉంది.',
    aiFallback: 'AI ప్రస్తుతం బిజీగా ఉంది, అందుకే నియమాల ఆధారిత వివరణ చూపబడింది.',
    footerNote:
      'ఇది నియమాల ఆధారిత స్క్రీనింగ్ స్కోరు మాత్రమే. సందేశం సురక్షితమా లేదా మోసమా అనే హామీ కాదు.',
  },

  hi: {
    languageLabel: 'भाषा',
    scamTitle: 'ऋण संदेश में धोखाधड़ी के संकेत जांचें',
    scamPlaceholder: 'ऋण SMS / WhatsApp संदेश यहां चिपकाएं',
    checkButton: 'संदेश जांचें',
    checkingButton: 'जांच हो रही है...',
    sampleButton: 'नमूना धोखाधड़ी संदेश उपयोग करें',
    emptyMessage: 'पहले एक संदेश चिपकाएं।',
    checkFailed: 'इस संदेश की जांच नहीं हो सकी। कृपया फिर कोशिश करें।',
    riskLevel: 'जोखिम स्तर',
    levels: { Low: 'कम', Medium: 'मध्यम', High: 'अधिक' },
    scoreTitle: 'धोखाधड़ी जोखिम स्कोर',
    scoreHigh: 'कई गंभीर चेतावनी संकेत मिले हैं।',
    scoreMedium: 'कुछ चेतावनी संकेत मिले हैं। ध्यान से जांचें।',
    scoreLow: 'कुछ ही सामान्य चेतावनी संकेत मिले। सतर्क रहें।',
    whyFlagged: 'इस संदेश को क्यों चिह्नित किया गया?',
    noFlags: 'कोई सामान्य धोखाधड़ी संकेत नहीं मिला, फिर भी सावधान रहें।',
    nextStepsTitle: 'आपको क्या करना चाहिए?',
    aiExplanation: 'AI स्पष्टीकरण',
    ruleExplanation: 'नियम-आधारित स्पष्टीकरण',
    aiLoading: 'स्पष्टीकरण तैयार हो रहा है...',
    ruleDone: 'नियम-आधारित धोखाधड़ी जांच पूरी हुई।',
    aiDone: 'AI स्पष्टीकरण तैयार है।',
    aiFallback: 'AI अभी व्यस्त है, इसलिए नियम-आधारित स्पष्टीकरण दिखाया गया है।',
    footerNote:
      'यह केवल नियम-आधारित स्क्रीनिंग स्कोर है, इस बात की गारंटी नहीं कि संदेश सुरक्षित या धोखाधड़ी वाला है।',
  },
};

// ---------------------------------------------------------------
// Warning translations (the English text comes from scamRules.js)
// ---------------------------------------------------------------

const FLAGS = {
  en: {
    fee: 'Asks for a fee or payment before the loan is given.',
    sensitive:
      'Mentions sensitive information such as OTP, PIN or banking credentials. Never share these details.',
    urgency: 'Creates urgency or pressures the user to act quickly.',
    approval: 'Makes loan approval claims that need independent verification.',
    link: 'Contains a link that should be verified before opening.',
    bank: 'Claims to represent a bank or financial institution. Verify this identity independently.',
  },
  te: {
    fee: 'రుణం ఇవ్వడానికి ముందు రుసుము లేదా చెల్లింపు అడుగుతోంది.',
    sensitive:
      'OTP, PIN లేదా బ్యాంకింగ్ రహస్య వివరాలను అడుగుతోంది. ఈ వివరాలను ఎప్పుడూ పంచుకోవద్దు.',
    urgency: 'త్వరగా చర్య తీసుకోవాలని ఒత్తిడి చేస్తోంది.',
    approval: 'రుణ ఆమోదం గురించి చేసిన వాదనలను స్వతంత్రంగా ధృవీకరించాలి.',
    link: 'తెరవడానికి ముందు ధృవీకరించవలసిన లింక్ ఇందులో ఉంది.',
    bank: 'బ్యాంకు లేదా ఆర్థిక సంస్థ ప్రతినిధిగా చెప్పుకుంటోంది. ఆ గుర్తింపును స్వతంత్రంగా ధృవీకరించండి.',
  },
  hi: {
    fee: 'ऋण देने से पहले शुल्क या भुगतान मांगा जा रहा है।',
    sensitive:
      'OTP, PIN या बैंकिंग गोपनीय जानकारी का उल्लेख है। ये जानकारी कभी साझा न करें।',
    urgency: 'जल्दी कार्रवाई करने का दबाव बनाया जा रहा है।',
    approval: 'ऋण स्वीकृति के दावों की स्वतंत्र रूप से पुष्टि करना आवश्यक है।',
    link: 'इसमें एक लिंक है जिसे खोलने से पहले सत्यापित करना चाहिए।',
    bank: 'बैंक या वित्तीय संस्था का प्रतिनिधि होने का दावा किया जा रहा है। इस पहचान की स्वतंत्र रूप से पुष्टि करें।',
  },
};

// Order matters: specific checks first. "pin" is matched as a whole word
// so that words such as "opening" are not mistaken for a PIN request.
export function translateFlag(flag, language) {
  const text = FLAGS[language] || FLAGS.en;
  const value = String(flag).toLowerCase();

  if (value.includes('represent a bank') || value.includes('financial institution')) {
    return text.bank;
  }
  if (value.includes('link')) return text.link;
  if (value.includes('approval claims')) return text.approval;
  if (value.includes('sensitive') || /\b(otp|pin|cvv)\b/.test(value)) {
    return text.sensitive;
  }
  if (value.includes('urgency') || value.includes('pressure')) return text.urgency;
  if (/\bfee\b/.test(value) || value.includes('payment')) return text.fee;

  return flag; // keep unknown warnings instead of hiding them
}

// ---------------------------------------------------------------
// What-to-do steps
// ---------------------------------------------------------------

const STEPS = {
  en: {
    High: [
      'Do not share OTPs, PINs, passwords or banking credentials.',
      'Do not click suspicious links or pay advance fees.',
      'Contact your bank through its official app or website.',
      'Report suspected cyber fraud at 1930 or cybercrime.gov.in.',
    ],
    Medium: [
      'Do not rush into accepting the loan offer.',
      "Verify the sender's identity through official bank contact details.",
      'Avoid opening links until their destination is verified.',
      'Check all loan terms and charges before proceeding.',
    ],
    Low: [
      'Verify the lender using official sources.',
      'Read all loan terms and charges carefully.',
      'Never share OTPs, passwords or banking credentials.',
    ],
  },
  te: {
    High: [
      'OTP, PIN, పాస్‌వర్డ్‌లు లేదా బ్యాంకింగ్ వివరాలను ఎవరికీ చెప్పవద్దు.',
      'అనుమానాస్పద లింక్‌లను తెరవవద్దు, ముందస్తు రుసుములు చెల్లించవద్దు.',
      'మీ బ్యాంక్ అధికారిక యాప్ లేదా వెబ్‌సైట్ ద్వారా బ్యాంక్‌ను సంప్రదించండి.',
      'సైబర్ మోసం అనుమానం ఉంటే 1930 కు లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి.',
    ],
    Medium: [
      'రుణ ఆఫర్‌ను అంగీకరించడానికి తొందరపడకండి.',
      'అధికారిక బ్యాంక్ సంప్రదింపు వివరాల ద్వారా పంపినవారి గుర్తింపును ధృవీకరించండి.',
      'గమ్యం ధృవీకరించే వరకు లింక్‌లను తెరవకండి.',
      'ముందుకు వెళ్లే ముందు అన్ని రుణ నిబంధనలు మరియు ఛార్జీలను తనిఖీ చేయండి.',
    ],
    Low: [
      'అధికారిక వనరుల ద్వారా రుణదాతను ధృవీకరించండి.',
      'అన్ని రుణ నిబంధనలు మరియు ఛార్జీలను జాగ్రత్తగా చదవండి.',
      'OTP, పాస్‌వర్డ్‌లు లేదా బ్యాంకింగ్ వివరాలను ఎప్పుడూ పంచుకోవద్దు.',
    ],
  },
  hi: {
    High: [
      'OTP, PIN, पासवर्ड या बैंकिंग जानकारी किसी को न बताएं।',
      'संदिग्ध लिंक पर क्लिक न करें और अग्रिम शुल्क न दें।',
      'अपने बैंक के आधिकारिक ऐप या वेबसाइट के जरिए बैंक से संपर्क करें।',
      'साइबर धोखाधड़ी का संदेह हो तो 1930 पर या cybercrime.gov.in पर शिकायत करें।',
    ],
    Medium: [
      'ऋण प्रस्ताव स्वीकार करने में जल्दबाजी न करें।',
      'आधिकारिक बैंक संपर्क विवरण से भेजने वाले की पहचान की पुष्टि करें।',
      'लिंक का गंतव्य सत्यापित होने तक उसे न खोलें।',
      'आगे बढ़ने से पहले सभी ऋण शर्तें और शुल्क जांचें।',
    ],
    Low: [
      'आधिकारिक स्रोतों से ऋणदाता की पुष्टि करें।',
      'सभी ऋण शर्तें और शुल्क ध्यान से पढ़ें।',
      'OTP, पासवर्ड या बैंकिंग जानकारी कभी साझा न करें।',
    ],
  },
};

export function getNextSteps(level, language) {
  const group = STEPS[language] || STEPS.en;
  return group[level] || group.Low;
}