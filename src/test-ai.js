
import {
  extractTerms,
  explain,
  explainScam
} from "./api/ai.js";

async function runTests() {
  console.log("========== PERSON C VALIDATION TESTS ==========");

  let passed = 0;
  let failed = 0;

  function check(name, result) {
    const success =
      result?.error === true &&
      typeof result.message === "string";

    if (success) {
      passed++;
      console.log("PASS:", name, result);
    } else {
      failed++;
      console.error("FAIL:", name, result);
    }
  }

  const ruleResult = {
    riskLevel: "High",
    redFlags: ["Unknown lender"],
    explanation: "Unknown lender.",
    nextSteps: ["Verify with your bank."]
  };

  const invalidOffers = [
    "",
    "   ",
    "A".repeat(3001),
    null,
    123
  ];

  // Test 1: extractTerms invalid inputs
  for (const [i, offer] of invalidOffers.entries()) {
    const result = await extractTerms(offer);
    check(`extractTerms invalid input ${i + 1}`, result);
  }

  // Test 2: explain invalid inputs
  const invalidResults = [
    null,
    {},
    { verdict: "Dangerous", reasons: [], assumptions: [] },
    { verdict: "Good", reasons: "wrong", assumptions: [] },
    { verdict: "Good", reasons: [], assumptions: "wrong" }
  ];

  for (const [i, result] of invalidResults.entries()) {
    const output = await explain(result, "en");
    check(`explain invalid input ${i + 1}`, output);
  }

  // Test 3: explainScam invalid offer inputs
  for (const [i, offer] of invalidOffers.entries()) {
    const result = await explainScam(
      offer,
      ruleResult,
      "en"
    );

    check(`explainScam invalid offer ${i + 1}`, result);
  }

  // Test 4: explainScam invalid rule results
  const invalidRules = [
    null,
    { ...ruleResult, riskLevel: "Extremely Dangerous" },
    { ...ruleResult, redFlags: "wrong" },
    { ...ruleResult, explanation: 123 },
    { ...ruleResult, nextSteps: "wrong" }
  ];

  for (const [i, rule] of invalidRules.entries()) {
    const result = await explainScam(
      "This is a sample loan offer.",
      rule,
      "en"
    );

    check(`explainScam invalid rule ${i + 1}`, result);
  }

  console.log("========== TEST SUMMARY ==========");
  console.log("Passed:", passed);
  console.log("Failed:", failed);
  console.log("Total:", passed + failed);
}

runTests();
