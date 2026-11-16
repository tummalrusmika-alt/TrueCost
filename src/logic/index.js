
export { analyzeLoan, rupees } from "./calculate.js";
export { extractTermsFromText } from "./extract.js";

import { checkScamRules } from "./scamRules.js";

// Check affordability using the remaining monthly money.
export function checkAffordability({
  income,
  expenses,
  emi
}) {
  const monthlyIncome = Number(income);
  const monthlyExpenses = Number(expenses);
  const monthlyEmi = Number(emi);

  const errors = [];

  if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
    errors.push("Enter a valid monthly income.");
  }

  if (!Number.isFinite(monthlyExpenses) || monthlyExpenses < 0) {
    errors.push("Enter valid monthly expenses.");
  }

  if (!Number.isFinite(monthlyEmi) || monthlyEmi < 0) {
    errors.push("Invalid EMI amount.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const moneyLeft = monthlyIncome - monthlyExpenses;

  const emiShare =
    moneyLeft > 0 ? (monthlyEmi / moneyLeft) * 100 : null;

  let verdict;

  if (moneyLeft <= 0 || emiShare > 50) {
    verdict = "Avoid";
  } else if (emiShare > 30) {
    verdict = "Okay";
  } else {
    verdict = "Good";
  }

  const reasons = [];

  if (moneyLeft <= 0) {
    reasons.push("No money is left after monthly expenses.");
  } else {
    reasons.push(
      `Your EMI uses ${emiShare.toFixed(1)}% of your remaining money.`
    );
  }

  if (verdict === "Avoid" && moneyLeft > 0) {
    reasons.push("The EMI takes more than 50% of your remaining money.");
  }

  if (verdict === "Good") {
    reasons.push("The EMI takes no more than 30% of your remaining money.");
  }

  return {
    ok: true,
    moneyLeft,
    emiShare,
    verdict,
    reasons
  };
}

// Convert rule-based scam results into the format used by TrueCost.jsx.
export function checkScamRisk(text) {
  try {
    const result = checkScamRules(text);

    return {
      ok: true,
      level: result.riskLevel,
      flags: result.redFlags,
      note: result.nextSteps.join(" ")
    };
  } catch (error) {
    return {
      ok: false,
      errors: [error.message || "Unable to check this message."]
    };
  }
}