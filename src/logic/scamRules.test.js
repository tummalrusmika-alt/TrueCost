import { test, expect } from "vitest";

import { checkScamRules } from "./scamRules.js";

// Test 1: Normal loan message.
test("detects a normal loan message as low risk", () => {
  const result = checkScamRules(
    "Our bank offers personal loans. Please read the loan terms on our official website."
  );

  expect(result.riskLevel).toBe("Low");
  expect(result.redFlags).toEqual([]);
  expect(result.explanation).toBe("");
  expect(Array.isArray(result.nextSteps)).toBe(true);
});

// Test 2: Upfront payment request.
test("detects an upfront payment request", () => {
  const result = checkScamRules(
    "Pay the processing fee before your loan is approved."
  );

  // An upfront fee is always treated as high risk.
  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.length).toBeGreaterThan(0);
});

// Test 3: Urgent payment with upfront fee.
test("detects high risk when upfront fee and urgency are present", () => {
  const result = checkScamRules(
    "Pay the processing fee immediately within 10 minutes to receive your loan."
  );

  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
  expect(result.nextSteps.length).toBeGreaterThan(0);
});

// Test 4: Empty message validation.
test("rejects an empty message", () => {
  expect(() => {
    checkScamRules("");
  }).toThrow(/Please provide a valid message/);
});

// Test 5: Rejects invalid input.
test("rejects non-string input", () => {
  expect(() => {
    checkScamRules(null);
  }).toThrow(/Please provide a valid message/);
});

// ---------------------------------------------------------------
// Telugu, Hindi and Indian scam patterns
// ---------------------------------------------------------------

test("detects a Telugu message asking for a fee and OTP", () => {
  const result = checkScamRules(
    "మీ రుణం పొందడానికి ముందుగా 2500 రూపాయలు చెల్లించండి. మీ OTP కూడా పంపండి."
  );
  expect(result.riskLevel).toBe("High");
});

test("detects a Hindi message asking for a fee and OTP", () => {
  const result = checkScamRules(
    "लोन पाने के लिए 2500 रुपये शुल्क जमा करें और अपना ओटीपी भेजें।"
  );
  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
});

test("detects a Telugu message written only in Telugu script", () => {
  const result = checkScamRules(
    "వెంటనే మీ ఓటీపీ చెప్పండి, లేదంటే మీ ఖాతా బ్లాక్ అవుతుంది."
  );
  expect(result.riskLevel).toBe("High");
});

test("detects a fake KYC update message as medium risk", () => {
  const result = checkScamRules(
    "Your account will be blocked today. Update your KYC now."
  );
  expect(result.riskLevel).toBe("Medium");
  expect(result.redFlags.some((flag) => flag.includes("KYC"))).toBe(true);
});

test("detects an APK download request", () => {
  const result = checkScamRules(
    "Download this app to get your instant loan: loan-helper.apk"
  );
  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.some((flag) => flag.includes("APK"))).toBe(true);
});

test("detects threats from loan apps", () => {
  const result = checkScamRules(
    "Repay today or we will send your photos to all your contacts and call the police."
  );
  expect(result.riskLevel).toBe("High");
});

test("detects a UPI collect request", () => {
  const result = checkScamRules(
    "Approve the collect request on your phone to receive your loan."
  );
  expect(result.riskLevel).toBe("High");
});

test("detects a request to pay money to release the loan", () => {
  const result = checkScamRules(
    "Your loan is ready. Pay a refundable deposit of Rs 2000 to release the loan amount."
  );
  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.some((flag) => flag.includes("release"))).toBe(true);
});

test("a normal Hindi bank message is not flagged as High", () => {
  const result = checkScamRules(
    "आपका लोन आवेदन प्राप्त हो गया है। अधिक जानकारी के लिए अपनी बैंक शाखा में जाएं।"
  );
  expect(result.riskLevel).toBe("Low");
});