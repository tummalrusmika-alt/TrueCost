
import { calculateLoan } from "./logic/calculate.js";

const terms = {
  amount: 50000,
  tenureMonths: 12,
  annualRatePercent: 14,
  processingFee: 999,
  gstOnFeesPercent: 18,
  otherCharges: 0
};

const affordability = {
  monthlyIncome: 30000,
  monthlyExpenses: 20000
};

try {
  const result = calculateLoan(terms, affordability);

  console.log("========== CALCULATION TEST ==========");
  console.log(result);

  const requiredFields = [
    "emi",
    "totalInterest",
    "fees",
    "gstAmount",
    "hiddenExtra",
    "totalPaid",
    "moneyReceived",
    "effectiveRatePercent",
    "annualizationMethod",
    "assumptions",
    "moneyLeft",
    "emiShareOfLeftPercent",
    "verdict",
    "reasons"
  ];

  const missing = requiredFields.filter(
    field => !(field in result)
  );

  if (missing.length === 0) {
    console.log("PASS: All required result fields exist.");
  } else {
    console.error("FAIL: Missing fields:", missing);
  }

  console.log("Verdict:", result.verdict);
  console.log("EMI:", result.emi);
  console.log("Effective rate:", result.effectiveRatePercent);

} catch (error) {
  console.error("CALCULATION FAILED:", error.message);
}