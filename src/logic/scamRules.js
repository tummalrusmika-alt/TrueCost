// src/logic/scamRules.js

// Check loan messages for suspicious patterns.
export function checkScamRules(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Please provide a valid message.");
  }

  const message = text.toLowerCase();

  const redFlags = [];

  // Rule 1: Detect requests for upfront payment.
  const upfrontFeePatterns = [
    /pay.*(fee|charge|deposit|tax|gst)/i,
    /(fee|charge|deposit|tax|gst).*pay/i,
    /processing fee/i,
    /advance payment/i,
    /pay before.*(loan|approval|disbursement)/i
  ];

  const hasUpfrontFee = upfrontFeePatterns.some(
    pattern => pattern.test(message)
  );

  if (hasUpfrontFee) {
    redFlags.push("Asks for a fee or payment before the loan is given.");
  }

  // Rule 2: Detect urgent payment pressure.
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
    redFlags.push("Creates urgency or pressures the user to act quickly.");
  }

  // Rule 3: Detect suspicious loan approval claims.
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
    redFlags.push("Makes loan approval claims that need independent verification.");
  }

  // Determine the risk level.
  let riskLevel;

  if (hasUpfrontFee && hasUrgency) {
    riskLevel = "High";
  } else if (
    hasUpfrontFee ||
    hasUrgency ||
    hasSuspiciousLoanClaim
  ) {
    riskLevel = "Medium";
  } else {
    riskLevel = "Low";
  }

  // Provide appropriate safety recommendations.
  let nextSteps;

  if (riskLevel === "High") {
    nextSteps = [
      "Don't click any link or pay anything.",
      "Check with your bank using its official app or website.",
      "Report suspected fraud at 1930 or cybercrime.gov.in."
    ];
  } else if (riskLevel === "Medium") {
    nextSteps = [
      "Do not make any payment until the lender is verified.",
      "Verify the lender through official sources.",
      "Do not share OTPs, passwords or banking credentials."
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