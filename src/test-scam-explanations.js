
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

async function runTest() {
  console.log("========== SCAM EXPLANATION TEST ==========");

  const result = await explainScam(
    offerText,
    ruleResult,
    "en"
  );

  console.log("AI result:", result);

  if (
    !result?.error &&
    typeof result?.text === "string" &&
    result.text.trim().endsWith(
      "This is a guide, not proof. Always verify with your bank."
    )
  ) {
    console.log("PASS: Explanation and disclaimer are valid.");
  } else {
    console.error("FAIL: Check the AI response.");
  }
}

runTest();
