
import { calculateLoan } from "./logic/calculate.js";
import { explain } from "./api/ai.js";

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

async function testIntegration() {
  try {
    console.log("STEP 1: Calculating loan...");

    const calculation = calculateLoan(terms, affordability);

    console.log("Calculation result:", calculation);

    console.log("STEP 2: Asking AI to explain...");

    const explanation = await explain(calculation, "en");

    console.log("AI explanation:", explanation);

    if (explanation?.error) {
      console.error("AI ERROR:", explanation.message);
      return;
    }

    if (explanation?.text) {
      console.log("SUCCESS: Calculation and AI explanation connected!");
    } else {
      console.error("FAILED: No explanation received.");
    }
  } catch (error) {
    console.error("INTEGRATION FAILED:", error.message);
  }
}

testIntegration();