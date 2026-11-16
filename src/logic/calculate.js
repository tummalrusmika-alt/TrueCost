// All numbers in TrueCost are computed here (code), never by AI.
// Effective annual rate uses ONE method everywhere: (1 + monthlyIRR)^12 - 1

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function calcEMI(principal, annualRatePct, months) {
  const P = num(principal);
  const n = Math.round(num(months));
  if (P === 0 || n === 0) return 0;
  const r = num(annualRatePct) / 12 / 100;
  if (r === 0) return P / n;
  const f = Math.pow(1 + r, n);
  return (P * r * f) / (f - 1);
}

// Finds the monthly rate r where PV of all payments equals money received.
export function solveMonthlyIRR(received, emi, months, otherCharges = 0) {
  const n = Math.round(months);
  const totalPaid = emi * n + otherCharges;
  if (received <= 0 || n <= 0 || totalPaid <= received) return 0;

  // Other charges are treated as paid in the last month.
  const pv = (r) => {
    let sum = 0;
    for (let t = 1; t <= n; t++) sum += emi / Math.pow(1 + r, t);
    sum += otherCharges / Math.pow(1 + r, n);
    return sum;
  };

  let lo = 0;
  let hi = 1; // 100% per month upper bound
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > received) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export const annualize = (monthlyRate) => Math.pow(1 + monthlyRate, 12) - 1;

/**
 * input: {
 *   amount, annualRate (%), months,
 *   rateType: 'reducing' | 'flat'   (default 'reducing')
 *   processingFee (rupees, default 0), gstPct (default 18),
 *   otherCharges (rupees, total, default 0)
 * }
 */
export function analyzeLoan(input) {
  const errors = [];
  const amount = num(input.amount);
  const months = Math.round(num(input.months));
  const annualRate = Number(input.annualRate) >= 0 ? Number(input.annualRate) : 0;
  const rateType = input.rateType === 'flat' ? 'flat' : 'reducing';
  const processingFee = num(input.processingFee);
  const gstPct = input.gstPct === undefined || input.gstPct === '' ? 18 : num(input.gstPct);
  const otherCharges = num(input.otherCharges);

  if (amount === 0) errors.push('Enter a loan amount greater than 0.');
  if (months === 0) errors.push('Enter a tenure of at least 1 month.');
  if (months > 360) errors.push('Tenure looks unusually long. Please check.');
  if (annualRate > 100) errors.push('Interest rate looks unusually high. Please check.');
  if (errors.length) return { ok: false, errors };

  let emi, totalInterest;
  if (rateType === 'flat') {
    totalInterest = amount * (annualRate / 100) * (months / 12);
    emi = (amount + totalInterest) / months;
  } else {
    emi = calcEMI(amount, annualRate, months);
    totalInterest = emi * months - amount;
  }

  const gstOnFee = processingFee * (gstPct / 100);
  const upfrontCharges = processingFee + gstOnFee;
  const moneyReceived = amount - upfrontCharges;
  const totalEmiPaid = emi * months;
  const totalPaid = totalEmiPaid + otherCharges;

  const monthlyIRR = solveMonthlyIRR(moneyReceived, emi, months, otherCharges);
  const effectiveAnnualRate = annualize(monthlyIRR) * 100;

  // Hidden extra = everything you pay beyond the stated interest
  const hiddenExtra = processingFee + gstOnFee + otherCharges;
  const totalCostOfBorrowing = totalPaid - moneyReceived;

  const warnings = [];
  if (moneyReceived <= 0) warnings.push('Fees are as large as the loan itself.');
  if (effectiveAnnualRate - annualRate > 5)
    warnings.push(
      `Effective rate (${effectiveAnnualRate.toFixed(1)}%) is much higher than the stated rate (${annualRate}%).`
    );

  return {
    ok: true,
    warnings,
    assumptions: [
      `Rate type: ${rateType === 'flat' ? 'flat' : 'reducing balance'}`,
      `GST on processing fee: ${gstPct}%`,
      'Money received = loan amount - (processing fee + GST on fee)',
      'Money paid = all EMIs + other listed charges',
      'Effective rate = monthly IRR annualized as (1 + r)^12 - 1',
      'Educational tool, not financial advice.',
    ],
    inputs: { amount, annualRate, months, rateType, processingFee, gstPct, otherCharges },
    emi,
    principal: amount,
    totalInterest,
    processingFee,
    gstOnFee,
    otherCharges,
    moneyReceived,
    totalEmiPaid,
    totalPaid,
    totalCostOfBorrowing,
    hiddenExtra,
    effectiveAnnualRate,
    statedAnnualRate: annualRate,
  };
}

export const rupees = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');