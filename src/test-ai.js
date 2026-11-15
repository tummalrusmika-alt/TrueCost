
import {
  extractTerms,
  explain,
  explainScam
} from "./api/ai.js";

async function runTests() {
  console.log("========== PERSON C EXTRA VALIDATION TESTS ==========");

  let passed = 0;
  let failed = 0;

  function check(name, result) {
    const success =
      result?.error === true &&
      typeof result.message === "string";

    if (success) {
      passed++;
      console.log("PASS:", name);
    } else {
      failed++;
      console.error("FAIL:", name, result);
    }
  }

  const validRuleResult = {
    riskLevel: "High",
    redFlags: ["Unknown lender"],
    explanation: "Unknown lender.",
    nextSteps: ["Verify with your bank."]
  };

  // Test 1: Unsupported languages
  const languages = ["fr", "es", "ta", "", null, 123];

  for (const language of languages) {
    const result = await explain(
      {
        verdict: "Good",
        reasons: [],
        assumptions: []
      },
      language
    );

    check(`Unsupported language: ${language}`, result);
  }

  // Test 2: Invalid explanation result structures
  const invalidResults = [
  { verdict: "Bad", reasons: [], assumptions: [] },
  { verdict: "Okay", reasons: "wrong", assumptions: [] },
  { verdict: "Avoid", reasons: [], assumptions: null },
  { verdict: null, reasons: [], assumptions: [] }
];

  for (const result of invalidResults) {
    const output = await explain(result, "en");
    check("Invalid explanation structure", output);
  }

  // Test 3: Invalid scam languages
  const invalidLanguages = ["fr", "ta", "", null, 123];

  for (const language of invalidLanguages) {
    const result = await explainScam(
      "Sample loan message",
      validRuleResult,
      language
    );

    check(`Invalid scam language: ${language}`, result);
  }

  // Test 4: Invalid scam rule fields
  const invalidRules = [
    { ...validRuleResult, riskLevel: "Critical" },
    { ...validRuleResult, redFlags: [123] },
    { ...validRuleResult, explanation: null },
    { ...validRuleResult, nextSteps: [null] }
  ];

  for (const rule of invalidRules) {
    const result = await explainScam(
      "Sample loan message",
      rule,
      "en"
    );

    check("Invalid scam rule structure", result);
  }
    // Test 5: Invalid loan offer inputs
  const invalidOffers = [
    "",
    "   ",
    "x".repeat(3001),
    null,
    123
  ];

  for (const offer of invalidOffers) {
    const result = await extractTerms(offer);
    check(`Invalid extraction input: ${String(offer).slice(0, 20)}`, result);
  }

  console.log("========== TEST SUMMARY ==========");
  console.log("Passed:", passed);
  console.log("Failed:", failed);
  console.log("Total:", passed + failed);
}

runTests();