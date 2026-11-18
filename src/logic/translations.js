// src/logic/translations.js
// Language detection and screen text for English, Telugu and Hindi.

import { FLAG_TEXT } from './scamRules.js';

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
    uploadButton: '📷 Upload screenshot',
    readingImage: 'Reading the screenshot...',
    imageRead: 'Text was read from the screenshot. Please check it, then tap Check message.',
    imageNoText: 'No readable message was found in this image.',
    imageBadType: 'Please choose a PNG, JPG or WebP image.',
    imageTooBig: 'This image is too large. Please choose one under 8 MB.',
    imageFailed: 'The screenshot could not be read. Please type or paste the message instead.',
    imageBusy: 'AI is busy right now. Please type or paste the message instead.',
    imageNote: 'The screenshot is sent to Google AI only to read the text. It is not stored.',
    speakButton: '🎤 Speak the message',
    listeningButton: '🎙 Listening... tap to stop',
    listenButton: '🔊 Listen to the result',
    stopListenButton: '⏹ Stop audio',
    voiceHint: 'Choose your language first, then tap the microphone.',
    privacyNote:
      'Privacy: OTPs, phone, card, Aadhaar and PAN numbers in pasted text are hidden before anything is sent to AI. Nothing you paste is stored.',
    redactedNote: 'Some sensitive numbers were hidden before the AI saw your message.',
    reportTitle: 'Report this scam',
    reportText: 'If you shared money, OTP or bank details, call your bank now and report it.',
    reportSite: 'Report on cybercrime.gov.in',
    reportCall: 'Call helpline 1930',
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
    uploadButton: '📷 స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి',
    readingImage: 'స్క్రీన్‌షాట్ చదువుతోంది...',
    imageRead: 'స్క్రీన్‌షాట్ నుండి టెక్స్ట్ చదవబడింది. దయచేసి సరిచూసి, సందేశాన్ని తనిఖీ చేయండి నొక్కండి.',
    imageNoText: 'ఈ చిత్రంలో చదవగలిగే సందేశం కనిపించలేదు.',
    imageBadType: 'దయచేసి PNG, JPG లేదా WebP చిత్రాన్ని ఎంచుకోండి.',
    imageTooBig: 'ఈ చిత్రం చాలా పెద్దది. దయచేసి 8 MB కంటే తక్కువ ఉన్నదాన్ని ఎంచుకోండి.',
    imageFailed: 'స్క్రీన్‌షాట్ చదవలేకపోయాము. దయచేసి సందేశాన్ని టైప్ చేయండి లేదా అతికించండి.',
    imageBusy: 'AI ప్రస్తుతం బిజీగా ఉంది. దయచేసి సందేశాన్ని టైప్ చేయండి లేదా అతికించండి.',
    imageNote: 'స్క్రీన్‌షాట్ టెక్స్ట్ చదవడానికి మాత్రమే Google AI కి పంపబడుతుంది. అది నిల్వ చేయబడదు.',
    speakButton: '🎤 సందేశాన్ని చెప్పండి',
    listeningButton: '🎙 వింటోంది... ఆపడానికి నొక్కండి',
    listenButton: '🔊 ఫలితాన్ని వినండి',
    stopListenButton: '⏹ ఆడియో ఆపండి',
    voiceHint: 'ముందుగా మీ భాషను ఎంచుకుని, ఆపై మైక్రోఫోన్ నొక్కండి.',
    privacyNote:
      'గోప్యత: మీరు అతికించిన టెక్స్ట్‌లోని OTP, ఫోన్, కార్డ్, ఆధార్, PAN నంబర్లు AI కి పంపే ముందు దాచబడతాయి. మీరు అతికించిన దేనినీ మేము నిల్వ చేయము.',
    redactedNote: 'AI చూసే ముందు కొన్ని సున్నితమైన నంబర్లు దాచబడ్డాయి.',
    reportTitle: 'ఈ మోసాన్ని నివేదించండి',
    reportText: 'మీరు డబ్బు, OTP లేదా బ్యాంక్ వివరాలు పంచుకుంటే, వెంటనే మీ బ్యాంక్‌కు కాల్ చేసి ఫిర్యాదు చేయండి.',
    reportSite: 'cybercrime.gov.in లో ఫిర్యాదు చేయండి',
    reportCall: 'హెల్ప్‌లైన్ 1930 కు కాల్ చేయండి',
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
    uploadButton: '📷 स्क्रीनशॉट अपलोड करें',
    readingImage: 'स्क्रीनशॉट पढ़ा जा रहा है...',
    imageRead: 'स्क्रीनशॉट से टेक्स्ट पढ़ा गया। कृपया जांचें, फिर संदेश जांचें दबाएं।',
    imageNoText: 'इस छवि में कोई पढ़ने योग्य संदेश नहीं मिला।',
    imageBadType: 'कृपया PNG, JPG या WebP छवि चुनें।',
    imageTooBig: 'यह छवि बहुत बड़ी है। कृपया 8 MB से छोटी छवि चुनें।',
    imageFailed: 'स्क्रीनशॉट पढ़ा नहीं जा सका। कृपया संदेश टाइप करें या चिपकाएं।',
    imageBusy: 'AI अभी व्यस्त है। कृपया संदेश टाइप करें या चिपकाएं।',
    imageNote: 'स्क्रीनशॉट केवल टेक्स्ट पढ़ने के लिए Google AI को भेजा जाता है। इसे सहेजा नहीं जाता।',
    speakButton: '🎤 संदेश बोलकर बताएं',
    listeningButton: '🎙 सुन रहा है... रोकने के लिए दबाएं',
    listenButton: '🔊 परिणाम सुनें',
    stopListenButton: '⏹ ऑडियो रोकें',
    voiceHint: 'पहले अपनी भाषा चुनें, फिर माइक्रोफोन दबाएं।',
    privacyNote:
      'गोपनीयता: चिपकाए गए टेक्स्ट में OTP, फोन, कार्ड, आधार और PAN नंबर AI को भेजने से पहले छिपा दिए जाते हैं। आप जो चिपकाते हैं उसे हम सहेजते नहीं हैं।',
    redactedNote: 'AI के देखने से पहले कुछ संवेदनशील नंबर छिपा दिए गए।',
    reportTitle: 'इस धोखाधड़ी की शिकायत करें',
    reportText: 'यदि आपने पैसे, OTP या बैंक जानकारी साझा की है, तो तुरंत अपने बैंक को कॉल करें और शिकायत करें।',
    reportSite: 'cybercrime.gov.in पर शिकायत करें',
    reportCall: 'हेल्पलाइन 1930 पर कॉल करें',
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
  en: { ...FLAG_TEXT },

  te: {
    fee: 'రుణం ఇవ్వడానికి ముందు రుసుము లేదా చెల్లింపు అడుగుతోంది.',
    sensitive:
      'OTP, PIN లేదా బ్యాంకింగ్ రహస్య వివరాలను అడుగుతోంది. ఈ వివరాలను ఎప్పుడూ పంచుకోవద్దు.',
    urgency: 'త్వరగా చర్య తీసుకోవాలని ఒత్తిడి చేస్తోంది.',
    approval: 'రుణ ఆమోదం గురించి చేసిన వాదనలను స్వతంత్రంగా ధృవీకరించాలి.',
    link: 'తెరవడానికి ముందు ధృవీకరించవలసిన లింక్ ఇందులో ఉంది.',
    bank: 'బ్యాంకు లేదా ఆర్థిక సంస్థ ప్రతినిధిగా చెప్పుకుంటోంది. ఆ గుర్తింపును స్వతంత్రంగా ధృవీకరించండి.',
    kyc: 'KYC అప్‌డేట్ లేదా ఖాతా బ్లాక్ గురించి చెబుతోంది. బ్యాంకులు సందేశాలు లేదా లింక్‌ల ద్వారా KYC చేయమని అడగవు.',
    apk: 'యాప్ లేదా APK ఫైల్ డౌన్‌లోడ్ చేయమని అడుగుతోంది. అధికారిక యాప్ స్టోర్ నుండి మాత్రమే యాప్‌లను ఇన్‌స్టాల్ చేయండి.',
    threat: 'పోలీసు చర్య, చట్టపరమైన చర్య లేదా మీ కాంటాక్ట్స్, ఫోటోలు పంచుకుంటామనే బెదిరింపులు ఉన్నాయి.',
    upi: 'UPI కలెక్ట్ రిక్వెస్ట్ ఆమోదించమని లేదా QR కోడ్ స్కాన్ చేయమని అడుగుతోంది. డబ్బు పొందడానికి ఇది అవసరం లేదు.',
    release: 'రుణాన్ని విడుదల చేయడానికి డబ్బు అడుగుతోంది. నిజమైన రుణదాతలు ఛార్జీలను రుణం నుండి తీసుకుంటారు లేదా స్పష్టంగా తెలియజేస్తారు.',
  },

  hi: {
    fee: 'ऋण देने से पहले शुल्क या भुगतान मांगा जा रहा है।',
    sensitive:
      'OTP, PIN या बैंकिंग गोपनीय जानकारी का उल्लेख है। ये जानकारी कभी साझा न करें।',
    urgency: 'जल्दी कार्रवाई करने का दबाव बनाया जा रहा है।',
    approval: 'ऋण स्वीकृति के दावों की स्वतंत्र रूप से पुष्टि करना आवश्यक है।',
    link: 'इसमें एक लिंक है जिसे खोलने से पहले सत्यापित करना चाहिए।',
    bank: 'बैंक या वित्तीय संस्था का प्रतिनिधि होने का दावा किया जा रहा है। इस पहचान की स्वतंत्र रूप से पुष्टि करें।',
    kyc: 'KYC अपडेट या खाता ब्लॉक होने की बात कही गई है। बैंक संदेश या लिंक के जरिए KYC पूरा करने को नहीं कहते।',
    apk: 'ऐप या APK फाइल डाउनलोड करने को कहा जा रहा है। ऐप केवल आधिकारिक ऐप स्टोर से ही इंस्टॉल करें।',
    threat: 'पुलिस कार्रवाई, कानूनी कार्रवाई या आपके कॉन्टैक्ट्स और फोटो साझा करने जैसी धमकियां दी गई हैं।',
    upi: 'UPI कलेक्ट रिक्वेस्ट स्वीकार करने या QR कोड स्कैन करने को कहा जा रहा है। पैसे पाने के लिए ऐसा करना जरूरी नहीं है।',
    release: 'ऋण जारी करने के लिए पैसे मांगे जा रहे हैं। असली ऋणदाता शुल्क ऋण राशि से काटते हैं या स्पष्ट रूप से बताते हैं।',
  },
};

// Translates a warning produced by scamRules.js.
// 1) Exact match on the English text, 2) simple keyword fallback.
export function translateFlag(flag, language) {
  const text = FLAGS[language] || FLAGS.en;

  const exact = Object.keys(FLAG_TEXT).find((key) => FLAG_TEXT[key] === flag);
  if (exact) return text[exact];

  const value = String(flag).toLowerCase();

  if (value.includes('represent a bank')) return text.bank;
  if (value.includes('kyc')) return text.kyc;
  if (value.includes('apk')) return text.apk;
  if (value.includes('upi')) return text.upi;
  if (value.includes('threat')) return text.threat;
  if (value.includes('release')) return text.release;
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


// ---------------------------------------------------------------
// Compare offers screen
// ---------------------------------------------------------------

export const COMPARE_UI = {
  en: {
    title: 'Compare two loan offers',
    intro: 'Enter both offers. TrueCost shows which one really costs less.',
    offerA: 'Offer A',
    offerB: 'Offer B',
    amount: 'Loan amount (₹)',
    rate: 'Interest rate (% per year)',
    months: 'Tenure (months)',
    fee: 'Processing fee (₹)',
    gst: 'GST on fee (%)',
    other: 'Other charges, total (₹)',
    income: 'Monthly income (₹, optional)',
    expenses: 'Monthly expenses (₹, optional)',
    compareButton: 'Compare offers',
    sampleButton: 'Load sample offers',
    clearButton: 'Clear',
    emi: 'Monthly EMI',
    effective: 'Effective rate',
    totalPaid: 'Total you pay',
    hidden: 'Hidden extra',
    received: 'Money you actually receive',
    cost: 'Total cost of borrowing',
    verdictLabel: 'Affordability',
    equal: 'Both offers have the same total cost.',
    cheaper: (name, amount) => `${name} costs ${amount} less.`,
    better: 'Cheaper',
    fixErrors: 'Please fix the highlighted problems:',
    note: 'The calculator performs every calculation. This is educational, not financial advice.',
    verdicts: { Good: 'Good', Okay: 'Okay', Avoid: 'Avoid' },
  },
  te: {
    title: 'రెండు రుణ ఆఫర్లను పోల్చండి',
    intro: 'రెండు ఆఫర్ల వివరాలు నమోదు చేయండి. ఏది నిజంగా తక్కువ ఖర్చో TrueCost చూపుతుంది.',
    offerA: 'ఆఫర్ A',
    offerB: 'ఆఫర్ B',
    amount: 'రుణ మొత్తం (₹)',
    rate: 'వడ్డీ రేటు (సంవత్సరానికి %)',
    months: 'కాలవ్యవధి (నెలలు)',
    fee: 'ప్రాసెసింగ్ ఫీజు (₹)',
    gst: 'ఫీజుపై GST (%)',
    other: 'ఇతర ఛార్జీలు, మొత్తం (₹)',
    income: 'నెలవారీ ఆదాయం (₹, ఐచ్ఛికం)',
    expenses: 'నెలవారీ ఖర్చులు (₹, ఐచ్ఛికం)',
    compareButton: 'ఆఫర్లను పోల్చండి',
    sampleButton: 'నమూనా ఆఫర్లను లోడ్ చేయండి',
    clearButton: 'క్లియర్',
    emi: 'నెలవారీ EMI',
    effective: 'ప్రభావవంతమైన రేటు',
    totalPaid: 'మీరు చెల్లించే మొత్తం',
    hidden: 'దాచిన అదనపు ఖర్చు',
    received: 'మీకు నిజంగా అందే డబ్బు',
    cost: 'రుణం తీసుకోవడానికి మొత్తం ఖర్చు',
    verdictLabel: 'భరించగలగడం',
    equal: 'రెండు ఆఫర్ల మొత్తం ఖర్చు సమానం.',
    cheaper: (name, amount) => `${name} ${amount} తక్కువ ఖర్చు.`,
    better: 'తక్కువ ఖర్చు',
    fixErrors: 'దయచేసి ఈ సమస్యలను సరిచేయండి:',
    note: 'అన్ని లెక్కలు కాలిక్యులేటర్ చేస్తుంది. ఇది విద్యా ప్రయోజనం కోసం మాత్రమే, ఆర్థిక సలహా కాదు.',
    verdicts: { Good: 'మంచిది', Okay: 'పరవాలేదు', Avoid: 'వద్దు' },
  },
  hi: {
    title: 'दो ऋण ऑफर की तुलना करें',
    intro: 'दोनों ऑफर की जानकारी भरें। TrueCost बताएगा कि असल में कौन सा सस्ता है।',
    offerA: 'ऑफर A',
    offerB: 'ऑफर B',
    amount: 'ऋण राशि (₹)',
    rate: 'ब्याज दर (प्रति वर्ष %)',
    months: 'अवधि (महीने)',
    fee: 'प्रोसेसिंग फीस (₹)',
    gst: 'फीस पर GST (%)',
    other: 'अन्य शुल्क, कुल (₹)',
    income: 'मासिक आय (₹, वैकल्पिक)',
    expenses: 'मासिक खर्च (₹, वैकल्पिक)',
    compareButton: 'ऑफर की तुलना करें',
    sampleButton: 'नमूना ऑफर लोड करें',
    clearButton: 'साफ करें',
    emi: 'मासिक EMI',
    effective: 'प्रभावी दर',
    totalPaid: 'आप कुल कितना चुकाएंगे',
    hidden: 'छिपा हुआ अतिरिक्त खर्च',
    received: 'आपको वास्तव में मिलने वाली राशि',
    cost: 'ऋण लेने की कुल लागत',
    verdictLabel: 'वहन क्षमता',
    equal: 'दोनों ऑफर की कुल लागत समान है।',
    cheaper: (name, amount) => `${name} ${amount} सस्ता है।`,
    better: 'सस्ता',
    fixErrors: 'कृपया इन समस्याओं को ठीक करें:',
    note: 'सभी गणना कैलकुलेटर करता है। यह केवल शैक्षिक जानकारी है, वित्तीय सलाह नहीं।',
    verdicts: { Good: 'अच्छा', Okay: 'ठीक है', Avoid: 'न लें' },
  },
};