
import { explainScam } from "./api/ai.js";

const offerText =
  "Sample Bank: Your loan is approved. Pay Rs. 2500 processing fee before receiving the loan.";

const ruleResult = {
  riskLevel: "High",
  redFlags: [
    "Requests payment before giving the loan",
    "Creates urgency"
  ],
  explanation: "",
  nextSteps: [
    "Do not pay anything.",
    "Verify with your bank using its official app or website."
  ]
};

const languages = ["en", "te", "hi"];

async function runTests() {
  console.log("========== SCAM EXPLANATION TESTS ==========");

  let passed = 0;
  let failed = 0;

  for (const language of languages) {
    console.log(`Testing language: ${language}`);

    const result = await explainScam(
      offerText,
      ruleResult,
      language
    );

    const valid =
      !result?.error &&
      typeof result?.text === "string" &&
      result.text.trim().length > 0 &&
      result.text.includes(
        "This is a guide, not proof. Always verify with your bank."
      );

    if (valid) {
      passed++;
      console.log(`PASS: ${language} explanation and disclaimer valid.`);
      console.log("AI response:", result.text);
    } else {
      failed++;
      console.error(`FAIL: ${language}`, result);
    }
  }

  console.log("========== TEST SUMMARY ==========");
  console.log("Passed:", passed);
  console.log("Failed:", failed);
  console.log("Total:", passed + failed);
}

runTests();