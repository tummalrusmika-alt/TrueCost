
// src/logic/scamRules.js

export function checkScamRules(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Please provide a valid message.");
  }

  const message = text.toLowerCase();
  const redFlags = [];

  // Rule 1: Detect upfront payment requests.
  const upfrontFeePatterns = [
    /pay.*(fee|charge|deposit|tax|gst)/i,
    /(fee|charge|deposit|tax|gst).*pay/i,
    /processing fee/i,
    /advance payment/i,
    /pay before.*(loan|approval|disbursement)/i,
    /send.*(money|payment|amount).*before/i
  ];

  const hasUpfrontFee = upfrontFeePatterns.some(
    pattern => pattern.test(message)
  );

  if (hasUpfrontFee) {
    redFlags.push(
      "Asks for a fee or payment before the loan is given."
    );
  }

  // Rule 2: Detect sensitive banking information requests.
  const credentialPatterns = [
    /\botp\b/i,
    /one[- ]time password/i,
    /atm pin/i,
    /\bpin\b/i,
    /internet banking password/i,
    /banking password/i,
    /upi pin/i,
    /cvv/i,
    /card password/i
  ];

  const hasCredentialRequest = credentialPatterns.some(
    pattern => pattern.test(message)
  );

  if (hasCredentialRequest) {
    redFlags.push(
      "Mentions sensitive information such as OTP, PIN or banking credentials. Never share these details."
    );
  }

  // Rule 3: Detect urgency and pressure.
  const urgencyPatterns = [
    /within \d+ minutes?/i,
    /within \d+ hours?/i,
    /immediately/i,
    /urgent/i,
    /limited time/i,
    /pay now/i,
    /act fast/i,
    /offer expires/i,
    /today only/i
  ];

  const hasUrgency = urgencyPatterns.some(
    pattern => pattern.test(message)
  );

  if (hasUrgency) {
    redFlags.push(
      "Creates urgency or pressures the user to act quickly."
    );
  }

  // Rule 4: Detect suspicious loan approval claims.
  const suspiciousLoanPatterns = [
    /guaranteed loan/i,
    /guaranteed approval/i,
    /no verification/i,
    /no documents required/i,
    /instant loan approval/i
  ];

  const hasSuspiciousLoanClaim = suspiciousLoanPatterns.some(
    pattern => pattern.test(message)
  );

  if (hasSuspiciousLoanClaim) {
    redFlags.push(
      "Makes loan approval claims that need independent verification."
    );
  }

  // Rule 5: Detect suspicious links.
  const hasUrl = /https?:\/\/\S+/i.test(message);

  const shortenedLinkPatterns = [
    /bit\.ly/i,
    /tinyurl\.com/i,
    /t\.co/i,
    /is\.gd/i,
    /cutt\.ly/i,
    /shorturl/i
  ];

  const hasSuspiciousLink = shortenedLinkPatterns.some(
    pattern => pattern.test(message)
  );

  const linkActionPatterns = [
    /claim/i,
    /verify/i,
    /apply/i,
    /loan/i,
    /reward/i,
    /prize/i,
    /urgent/i
  ];

  const hasLinkAction = linkActionPatterns.some(
    pattern => pattern.test(message)
  );

  const hasUnknownLink = hasUrl && hasLinkAction;

  if (hasSuspiciousLink || hasUnknownLink) {
    redFlags.push(
      "Contains a link that should be verified before opening."
    );
  }

  // Rule 6: Detect possible bank impersonation.
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
    "rbi"
  ];

  const claimsToRepresentBank = [
    /we are from/i,
    /i am from/i,
    /official representative/i,
    /bank representative/i,
    /bank officer/i,
    /customer care executive/i,
    /official bank support/i,
    /bank support team/i,
    /on behalf of/i
  ];

  const mentionsBank = bankNames.some(
    name => message.includes(name)
  );

  const claimsBankIdentity = claimsToRepresentBank.some(
    pattern => pattern.test(message)
  );

  const hasImpersonationClaim =
    mentionsBank && claimsBankIdentity;

  if (hasImpersonationClaim) {
    redFlags.push(
      "Claims to represent a bank or financial institution. Verify this identity independently."
    );
  }

  // Determine risk level.
  let riskLevel;

  if (hasCredentialRequest || hasUpfrontFee) {
    riskLevel = "High";
  } else if (
    hasUrgency ||
    hasSuspiciousLoanClaim ||
    hasSuspiciousLink ||
    hasUnknownLink ||
    hasImpersonationClaim
  ) {
    riskLevel = "Medium";
  } else {
    riskLevel = "Low";
  }

  // Provide safety recommendations.
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