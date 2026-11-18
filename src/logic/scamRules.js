// src/logic/scamRules.js
// Rule-based scam detection for English, Telugu and Hindi messages.
//
// Latin-script words use regular expressions with word boundaries.
// Telugu / Hindi words use plain "includes" checks, because \b does not
// work with Indian scripts in JavaScript.

// The exact English warning texts. translations.js translates these by key.
export const FLAG_TEXT = {
  fee: "Asks for a fee or payment before the loan is given.",
  sensitive:
    "Mentions sensitive information such as OTP, PIN or banking credentials. Never share these details.",
  urgency: "Creates urgency or pressures the user to act quickly.",
  approval: "Makes loan approval claims that need independent verification.",
  link: "Contains a link that should be verified before opening.",
  bank:
    "Claims to represent a bank or financial institution. Verify this identity independently.",
  kyc:
    "Mentions a KYC update or account block. Banks do not ask you to complete KYC through messages or links.",
  apk:
    "Asks you to download or install an app or APK file. Install apps only from the official app store.",
  threat:
    "Uses threats such as police action, legal action or sharing your contacts or photos.",
  upi:
    "Asks you to approve a UPI collect request or scan a QR code. You never need to do this to receive money.",
  release:
    "Asks for money to release, unlock or activate the loan. Genuine lenders deduct charges from the loan or state them clearly."
};

function anyRegex(patterns, text) {
  return patterns.some(pattern => pattern.test(text));
}

function anyText(words, text) {
  return words.some(word => text.includes(word));
}

export function checkScamRules(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Please provide a valid message.");
  }

  const message = text.toLowerCase();
  const redFlags = [];

  // Rule 1: Upfront payment requests.
  const hasUpfrontFee =
    anyRegex(
      [
        /pay.*(fee|charge|deposit|tax|gst)/i,
        /(fee|charge|deposit|tax|gst).*pay/i,
        /processing fee/i,
        /advance payment/i,
        /pay before.*(loan|approval|disbursement)/i,
        /send.*(money|payment|amount).*before/i
      ],
      message
    ) ||
    anyText(
      [
        // Hindi
        "शुल्क जमा",
        "शुल्क दें",
        "शुल्क भरें",
        "फीस जमा",
        "फीस दें",
        "अग्रिम भुगतान",
        "एडवांस",
        "प्रोसेसिंग फीस",
        // Telugu
        "రుసుము చెల్లించ",
        "ఫీజు చెల్లించ",
        "ముందస్తు చెల్లింపు",
        "అడ్వాన్స్",
        "ప్రాసెసింగ్ ఫీజు",
        "ముందుగా చెల్లించ"
      ],
      message
    );

  if (hasUpfrontFee) redFlags.push(FLAG_TEXT.fee);

  // Rule 2: Sensitive banking information.
  const hasCredentialRequest =
    anyRegex(
      [
        /\botp\b/i,
        /one[- ]time password/i,
        /atm pin/i,
        /\bpin\b/i,
        /internet banking password/i,
        /banking password/i,
        /upi pin/i,
        /cvv/i,
        /card password/i
      ],
      message
    ) ||
    anyText(
      [
        // Hindi
        "ओटीपी",
        "पिन",
        "पासवर्ड",
        "सीवीवी",
        "कार्ड नंबर",
        // Telugu
        "ఓటీపీ",
        "పిన్",
        "పాస్‌వర్డ్",
        "పాస్వర్డ్",
        "సీవీవీ",
        "కార్డ్ నంబర్"
      ],
      message
    );

  if (hasCredentialRequest) redFlags.push(FLAG_TEXT.sensitive);

  // Rule 3: Urgency and pressure.
  const hasUrgency =
    anyRegex(
      [
        /within \d+ minutes?/i,
        /within \d+ hours?/i,
        /immediately/i,
        /urgent/i,
        /limited time/i,
        /pay now/i,
        /act fast/i,
        /offer expires/i,
        /today only/i
      ],
      message
    ) ||
    anyText(
      [
        // Hindi
        "तुरंत",
        "तत्काल",
        "जल्दी करें",
        "आज ही",
        "अंतिम तिथि",
        "घंटे में",
        "मिनट में",
        // Telugu
        "వెంటనే",
        "అత్యవసరం",
        "త్వరగా",
        "ఈ రోజే",
        "ఇప్పుడే",
        "గంటల్లో",
        "నిమిషాల్లో"
      ],
      message
    );

  if (hasUrgency) redFlags.push(FLAG_TEXT.urgency);

  // Rule 4: Suspicious loan approval claims.
  const hasSuspiciousLoanClaim =
    anyRegex(
      [
        /guaranteed loan/i,
        /guaranteed approval/i,
        /no verification/i,
        /no documents required/i,
        /instant loan approval/i,
        /pre-?approved/i
      ],
      message
    ) ||
    anyText(
      [
        // Hindi
        "गारंटीड लोन",
        "बिना दस्तावेज",
        "बिना जांच",
        "बिना सत्यापन",
        "तुरंत लोन",
        "पहले से स्वीकृत",
        // Telugu
        "హామీ లోన్",
        "పత్రాలు అవసరం లేదు",
        "తనిఖీ లేకుండా",
        "తక్షణ లోన్",
        "ముందే ఆమోదించ"
      ],
      message
    );

  if (hasSuspiciousLoanClaim) redFlags.push(FLAG_TEXT.approval);

  // Rule 5: Suspicious links.
  const hasUrl = /https?:\/\/\S+/i.test(message);

  const hasSuspiciousLink = anyRegex(
    [
      /bit\.ly/i,
      /tinyurl\.com/i,
      /\bt\.co\b/i,
      /is\.gd/i,
      /cutt\.ly/i,
      /shorturl/i
    ],
    message
  );

  const hasLinkAction =
    anyRegex(
      [/claim/i, /verify/i, /apply/i, /loan/i, /reward/i, /prize/i, /urgent/i],
      message
    ) ||
    anyText(["लोन", "लिंक", "क्लिक", "లోన్", "లింక్", "క్లిక్"], message);

  const hasUnknownLink = hasUrl && hasLinkAction;

  if (hasSuspiciousLink || hasUnknownLink) redFlags.push(FLAG_TEXT.link);

  // Rule 6: Bank impersonation.
  const bankNames = [
    "sbi",
    "hdfc",
    "icici",
    "axis bank",
    "kotak",
    "pnb",
    "canara bank",
    "bank of baroda",
    "union bank",
    "rbi",
    // Hindi
    "एसबीआई",
    "एचडीएफसी",
    "आईसीआईसीआई",
    "आरबीआई",
    "बैंक",
    // Telugu
    "ఎస్‌బీఐ",
    "ఎస్బీఐ",
    "హెచ్‌డీఎఫ్‌సీ",
    "ఐసీఐసీఐ",
    "ఆర్‌బీఐ",
    "బ్యాంక్"
  ];

  const mentionsBank = bankNames.some(name => message.includes(name));

  const claimsBankIdentity =
    anyRegex(
      [
        /we are from/i,
        /i am from/i,
        /official representative/i,
        /bank representative/i,
        /bank officer/i,
        /customer care executive/i,
        /official bank support/i,
        /bank support team/i,
        /on behalf of/i
      ],
      message
    ) ||
    anyText(
      [
        // Hindi
        "बैंक से बोल",
        "बैंक अधिकारी",
        "बैंक प्रतिनिधि",
        "ग्राहक सेवा",
        "कस्टमर केयर",
        // Telugu
        "బ్యాంక్ నుండి మాట్లాడ",
        "బ్యాంక్ అధికారి",
        "బ్యాంక్ ప్రతినిధి",
        "కస్టమర్ కేర్"
      ],
      message
    );

  const hasImpersonationClaim = mentionsBank && claimsBankIdentity;

  if (hasImpersonationClaim) redFlags.push(FLAG_TEXT.bank);

  // Rule 7: Fake KYC update.
  const mentionsKyc =
    /\bkyc\b/i.test(message) ||
    anyText(["केवाईसी", "కేవైసీ"], message);

  const kycAction =
    anyRegex(
      [/update/i, /expire/i, /block/i, /suspend/i, /pending/i, /verify/i, /deactivat/i],
      message
    ) ||
    anyText(
      [
        "अपडेट",
        "ब्लॉक",
        "बंद",
        "समाप्त",
        "लंबित",
        "అప్‌డేట్",
        "అప్డేట్",
        "బ్లాక్",
        "నిలిపి",
        "పెండింగ్"
      ],
      message
    );

  const hasKycScam = mentionsKyc && kycAction;

  if (hasKycScam) redFlags.push(FLAG_TEXT.kyc);

  // Rule 8: APK / app download.
  const hasApkRequest =
    anyRegex(
      [
        /\.apk\b/i,
        /\bapk\b/i,
        /download.{0,30}\bapp\b/i,
        /install.{0,30}\bapp\b/i,
        /\bapp\b.{0,30}(download|install)/i
      ],
      message
    ) ||
    anyText(
      [
        "एपीके",
        "ऐप डाउनलोड",
        "ऐप इंस्टॉल",
        "एप डाउनलोड",
        "ఏపీకే",
        "యాప్ డౌన్‌లోడ్",
        "యాప్ ఇన్‌స్టాల్"
      ],
      message
    );

  if (hasApkRequest) redFlags.push(FLAG_TEXT.apk);

  // Rule 9: Threats and harassment (common with illegal loan apps).
  const hasThreat =
    anyRegex(
      [
        /police/i,
        /legal action/i,
        /\barrest/i,
        /defame/i,
        /(share|send).{0,40}(contacts|photos|pictures)/i,
        /(contacts|photos|pictures).{0,40}(share|send|leak)/i,
        /court case/i
      ],
      message
    ) ||
    anyText(
      [
        "पुलिस",
        "गिरफ्तार",
        "कानूनी कार्रवाई",
        "बदनाम",
        "कोर्ट केस",
        "పోలీసు",
        "అరెస్ట్",
        "చట్టపరమైన చర్య",
        "పరువు",
        "కోర్టు కేసు"
      ],
      message
    );

  if (hasThreat) redFlags.push(FLAG_TEXT.threat);

  // Rule 10: UPI collect request / QR code.
  const hasUpiScam =
    anyRegex(
      [
        /collect request/i,
        /payment request/i,
        /\bqr\b/i,
        /scan.{0,30}(code|qr)/i,
        /approve.{0,30}(request|payment)/i
      ],
      message
    ) ||
    anyText(
      [
        "कलेक्ट रिक्वेस्ट",
        "क्यूआर",
        "रिक्वेस्ट स्वीकार",
        "కలెక్ట్ రిక్వెస్ట్",
        "క్యూఆర్",
        "రిక్వెస్ట్ ఆమోదించ"
      ],
      message
    );

  if (hasUpiScam) redFlags.push(FLAG_TEXT.upi);

  // Rule 11: Pay money to release / unlock the loan.
  const hasReleasePayment =
    anyRegex(
      [
        /(release|unlock|activate|disburse).{0,40}(loan|amount|money)/i,
        /(loan|amount|money).{0,40}(release|unlock|activate)/i,
        /refundable (deposit|fee)/i,
        /security deposit/i,
        /insurance (fee|charge|amount)/i
      ],
      message
    ) ||
    anyText(
      [
        "लोन रिलीज",
        "राशि रिलीज",
        "रिफंडेबल",
        "सिक्योरिटी डिपॉजिट",
        "బీమా రుసుము",
        "లోన్ విడుదల",
        "రిఫండబుల్",
        "సెక్యూరిటీ డిపాజిట్"
      ],
      message
    );

  // Only a warning when money is also being asked for or released.
  const releaseFlag =
    hasReleasePayment &&
    (hasUpfrontFee ||
      /refundable|security deposit|insurance/i.test(message) ||
      anyText(["రిఫండబుల్", "రిफండेबल", "रिफंडेबल", "सिक्योरिटी", "సెక్యూరిటీ", "బీమా"], message));

  if (releaseFlag) redFlags.push(FLAG_TEXT.release);

  // Risk level.
  let riskLevel;

  if (
    hasCredentialRequest ||
    hasUpfrontFee ||
    releaseFlag ||
    hasApkRequest ||
    hasUpiScam ||
    hasThreat
  ) {
    riskLevel = "High";
  } else if (
    hasUrgency ||
    hasSuspiciousLoanClaim ||
    hasSuspiciousLink ||
    hasUnknownLink ||
    hasImpersonationClaim ||
    hasKycScam
  ) {
    riskLevel = "Medium";
  } else {
    riskLevel = "Low";
  }

  // Safety recommendations.
  let nextSteps;

  if (riskLevel === "High") {
    nextSteps = [
      "Do not share OTPs, PINs, passwords or banking credentials.",
      "Do not click suspicious links or pay advance fees.",
      "Contact your bank through its official app or website.",
      "Report suspected cyber fraud at 1930 or cybercrime.gov.in."
    ];
  } else if (riskLevel === "Medium") {
    nextSteps = [
      "Do not rush into accepting the loan offer.",
      "Verify the sender's identity through official bank contact details.",
      "Avoid opening links until their destination is verified.",
      "Check all loan terms and charges before proceeding."
    ];
  } else {
    nextSteps = [
      "Verify the lender using official sources.",
      "Read all loan terms and charges carefully.",
      "Never share OTPs, passwords or banking credentials."
    ];
  }

  return {
    riskLevel,
    redFlags,
    explanation: "",
    nextSteps
  };
}