
import { explain } from "./api/ai.js";

const sampleResult = {
  emi: 4489.36,
  totalInterest: 3872.32,
  fees: 999,
  gstAmount: 179.82,
  hiddenExtra: 1178.82,
  totalPaid: 55051.14,
  moneyReceived: 48821.18,
  effectiveRatePercent: 18.58,
  annualizationMethod: "monthly IRR × 12",
  assumptions: [
    "EMI uses the reducing-balance formula at the advertised rate."
  ],
  moneyLeft: 10000,
  emiShareOfLeftPercent: 44.9,
  verdict: "Okay",
  reasons: [
    "The EMI takes 44.9% of the money you have left each month."
  ]
};

async function runExplanationTest() {
  console.log("========== EXPLANATION TEST ==========");

  const languages = ["en", "te", "hi"];

  for (const language of languages) {
    console.log(`\nTesting language: ${language}`);

    try {
      const result = await explain(sampleResult, language);

      if (result?.error) {
        console.error("ERROR:", result);
      } else if (typeof result?.text === "string" && result.text.trim()) {
        console.log("PASS: Explanation received");
        console.log("AI response:", result.text);
      } else {
        console.error("FAIL: Invalid explanation response", result);
      }
    } catch (error) {
      console.error("FAIL:", error);
    }
  }

  console.log("\n========== TEST FINISHED ==========");
}

runExplanationTest();
