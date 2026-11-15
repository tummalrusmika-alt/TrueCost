
export const sampleCalculationResult = {
  emi: 4489.36,
  totalInterest: 3872.32,
  fees: 999,
  gstAmount: 179.82,
  hiddenExtra: 1178.82,
  totalPaid: 55051.14,
  moneyReceived: 48821.18,
  effectiveRatePercent: 18.58,
  annualizationMethod: 'monthly IRR × 12',

  assumptions: [
    'EMI uses the reducing-balance formula at the advertised rate.',
    'Processing fee, GST on the fee and other charges are deducted upfront.',
    'GST is applied to the processing fee only, not to interest.',
    'Effective rate = monthly IRR × 12.',
  ],

  moneyLeft: 10000,
  emiShareOfLeftPercent: 44.9,
  verdict: 'Okay',

  reasons: [
    'The EMI takes 44.9% of the money you have left each month.',
    'Fees and GST add ₹1,178.82 on top of the interest.',
  ],
}

export const sampleLoanTerms = {
  amount: 50000,
  tenureMonths: 12,
  annualRatePercent: 14,
  processingFee: 999,
  gstOnFeesPercent: 18,
  otherCharges: 0,
}

export const sampleAffordability = {
  monthlyIncome: 30000,
  monthlyExpenses: 20000,
}

export const sampleScamResult = {
  riskLevel: 'High',

  redFlags: [
    'Asks for a fee before the loan is given',
    "Creates urgency: 'pay within 10 minutes'",
  ],

  explanation: '',

  nextSteps: [
    "Don't click any link or pay anything.",
    'Check with your bank using its official app or website.',
    'Report fraud at 1930 or cybercrime.gov.in.',
  ],
}
