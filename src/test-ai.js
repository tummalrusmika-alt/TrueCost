
import { explainScam } from "./api/ai.js";

const sampleOffer = `
Congratulations! You are approved for a loan.
Pay Rs. 5000 upfront to receive your loan.
`;

const ruleResult = {
  riskLevel: "high",
  redFlags: [
    "Upfront payment requested before loan disbursement",
    "Lender identity is not verified"
  ]
};

async function runTests() {
  const languages = ["en", "te", "hi"];

  for (const language of languages) {
    console.log(`\nTesting language: ${language}`);

    for (let i = 1; i <= 3; i++) {
      const result = await explainScam(
        sampleOffer,
        ruleResult,
        language
      );

      console.log(`Run ${i}:`, result);
    }
  }
}

runTests();
