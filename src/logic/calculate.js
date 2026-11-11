
// src/logic/calculate.js

// Round values only when returning the final result.
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Calculate EMI using the reducing-balance formula.
function calculateEMI(amount, annualRatePercent, tenureMonths) {
  const monthlyRate = annualRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return amount / tenureMonths;
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);

  return (
    amount * monthlyRate * factor / (factor - 1)
  );
}

// Find monthly IRR using bisection.
function calculateMonthlyIRR(emi, tenureMonths, moneyReceived) {
  function presentValue(rate) {
    if (rate === 0) return emi * tenureMonths;

    return emi * (1 - Math.pow(1 + rate, -tenureMonths)) / rate;
  }

  let low = 0;
  let high = 0.01;

  // Find an upper bound for the monthly rate.
  while (presentValue(high) > moneyReceived && high < 1e12) {
    high *= 2;
  }

  if (presentValue(high) > moneyReceived) {
    throw new Error("Unable to calculate the effective rate.");
  }

  // Narrow the result to the required precision.
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;

    if (presentValue(mid) > moneyReceived) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

// Main loan calculation function.
export function calculateLoan(terms, affordability) {
  if (!terms || !affordability) {
    throw new Error("Loan terms and affordability inputs are required.");
  }

  const {
    amount,
    tenureMonths,
    annualRatePercent,
    processingFee,
    gstOnFeesPercent = 18,
    otherCharges = 0
  } = terms;

  const { monthlyIncome, monthlyExpenses } = affordability;

  const values = {
    amount,
    tenureMonths,
    annualRatePercent,
    processingFee,
    gstOnFeesPercent,
    otherCharges,
    monthlyIncome,
    monthlyExpenses
  };

  for (const [name, value] of Object.entries(values)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`${name} must be a valid number.`);
    }
  }

  if (amount <= 0) throw new Error("Loan amount must be above 0.");
  if (!Number.isInteger(tenureMonths) || tenureMonths <= 0) {
    throw new Error("Tenure must be a positive whole number of months.");
  }
  if (annualRatePercent < 0) {
    throw new Error("Annual interest rate cannot be negative.");
  }
  if (processingFee < 0 || otherCharges < 0 || gstOnFeesPercent < 0) {
    throw new Error("Fees and GST cannot be negative.");
  }
  if (monthlyIncome <= 0) {
    throw new Error("Monthly income must be above 0.");
  }
  if (monthlyExpenses < 0) {
    throw new Error("Monthly expenses cannot be negative.");
  }

  // Calculate loan costs.
  const emi = calculateEMI(
    amount,
    annualRatePercent,
    tenureMonths
  );

  const totalInterest = emi * tenureMonths - amount;
  const fees = processingFee + otherCharges;
  const gstAmount = processingFee * gstOnFeesPercent / 100;
  const hiddenExtra = fees + gstAmount;
  const totalPaid = emi * tenureMonths + hiddenExtra;
  const moneyReceived = amount - hiddenExtra;

  if (moneyReceived <= 0) {
    throw new Error("Upfront charges must be less than the loan amount.");
  }

  // Calculate annualized rate from monthly IRR.
  const monthlyIRR = calculateMonthlyIRR(
    emi,
    tenureMonths,
    moneyReceived
  );

  const effectiveRatePercent = monthlyIRR * 12 * 100;

  // Calculate affordability.
  const moneyLeft = monthlyIncome - monthlyExpenses;

  const emiShareOfLeftPercent =
    moneyLeft > 0 ? (emi / moneyLeft) * 100 : null;

  // Apply the agreed verdict thresholds.
  let verdict;

  if (moneyLeft <= 0 || emiShareOfLeftPercent > 50) {
    verdict = "Avoid";
  } else if (emiShareOfLeftPercent > 30) {
    verdict = "Okay";
  } else {
    verdict = "Good";
  }

  // Explain the result.
  const reasons = [];

  if (moneyLeft <= 0) {
    reasons.push("No money is left after monthly expenses.");
  } else {
    reasons.push(
      `The EMI takes ${round2(emiShareOfLeftPercent)}% of the money you have left each month.`
    );
  }

  if (hiddenExtra > 0) {
    reasons.push(
      `Fees and GST add ${round2(hiddenExtra)} rupees on top of the interest.`
    );
  }

  if (verdict === "Avoid" && moneyLeft > 0) {
    reasons.push("The EMI takes more than 50% of your remaining money.");
  }

  if (verdict === "Good") {
    reasons.push("The EMI takes no more than 30% of your remaining money.");
  }

  // Return the agreed data shape.
  return {
    emi: round2(emi),
    totalInterest: round2(totalInterest),
    fees: round2(fees),
    gstAmount: round2(gstAmount),
    hiddenExtra: round2(hiddenExtra),
    totalPaid: round2(totalPaid),
    moneyReceived: round2(moneyReceived),
    effectiveRatePercent: round2(effectiveRatePercent),
    annualizationMethod: "monthly IRR × 12",
    assumptions: [
      "EMI uses the reducing-balance formula at the advertised rate.",
      "Processing fee, GST on the fee and other charges are deducted upfront.",
      "GST is applied to the processing fee only, not to interest.",
      "Effective rate = monthly IRR × 12."
    ],
    moneyLeft: round2(moneyLeft),
    emiShareOfLeftPercent:
      emiShareOfLeftPercent === null
        ? null
        : round2(emiShareOfLeftPercent),
    verdict,
    reasons
  };
}