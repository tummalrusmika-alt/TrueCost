
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

// Standard reducing-balance EMI calculation
function calculateEMI(amount, tenureMonths, annualRatePercent) {
  const monthlyRate = annualRatePercent / 1200

  if (monthlyRate === 0) {
    return amount / tenureMonths
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return (amount * monthlyRate * factor) / (factor - 1)
}

// Find monthly IRR using binary search.
// PV of all EMIs must equal the upfront amount received.
function calculateMonthlyIRR(emi, tenureMonths, moneyReceived) {
  if (moneyReceived <= 0) {
    throw new Error(
      'Money received must be greater than zero to calculate the effective rate.'
    )
  }

  let low = 0
  let high = 1

  const presentValue = (rate) => {
    if (rate === 0) {
      return emi * tenureMonths
    }

    return (
      emi *
      (1 - Math.pow(1 + rate, -tenureMonths)) /
      rate
    )
  }

  // Find an upper bound for the monthly rate.
  let attempts = 0

  while (presentValue(high) > moneyReceived && attempts < 100) {
    high *= 2
    attempts++
  }

  if (presentValue(high) > moneyReceived) {
    throw new Error('Unable to calculate the effective interest rate.')
  }

  // Binary search for the monthly IRR.
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2

    if (presentValue(mid) > moneyReceived) {
      low = mid
    } else {
      high = mid
    }
  }

  return (low + high) / 2
}

export function calculateLoan(terms, affordability) {
  if (!terms || !affordability) {
    throw new Error('Loan terms and affordability inputs are required.')
  }

  const {
    amount,
    tenureMonths,
    annualRatePercent,
    processingFee,
    gstOnFeesPercent,
    otherCharges,
  } = terms

  const {
    monthlyIncome,
    monthlyExpenses,
  } = affordability

  const values = {
    amount,
    tenureMonths,
    annualRatePercent,
    processingFee,
    gstOnFeesPercent,
    otherCharges,
    monthlyIncome,
    monthlyExpenses,
  }

  for (const [key, value] of Object.entries(values)) {
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new Error(`Invalid value for ${key}.`)
    }
  }

  if (amount <= 0 || tenureMonths <= 0 || monthlyIncome <= 0) {
    throw new Error(
      'Loan amount, tenure and monthly income must be above zero.'
    )
  }

  if (!Number.isInteger(tenureMonths)) {
    throw new Error('Loan tenure must be a whole number of months.')
  }

  // 1. EMI
  const emiRaw = calculateEMI(
    amount,
    tenureMonths,
    annualRatePercent
  )

  // 2. Interest
  const totalInterestRaw = emiRaw * tenureMonths - amount

  // 3. Fees and GST
  const feesRaw = processingFee + otherCharges

  const gstAmountRaw =
    (processingFee * gstOnFeesPercent) / 100

  // 4. Extra costs
  const hiddenExtraRaw = feesRaw + gstAmountRaw

  // 5. Total paid and amount received
  const moneyReceivedRaw =
    amount - feesRaw - gstAmountRaw

  if (moneyReceivedRaw <= 0) {
    throw new Error(
      'Upfront fees and GST must be less than the loan amount.'
    )
  }

  // Ensure the returned totalPaid invariant holds after rounding.
  const emi = round2(emiRaw)
  const totalInterest = round2(totalInterestRaw)
  const fees = round2(feesRaw)
  const gstAmount = round2(gstAmountRaw)
  const hiddenExtra = round2(hiddenExtraRaw)

  const totalPaid = round2(
    amount + totalInterest + hiddenExtra
  )

  const moneyReceived = round2(moneyReceivedRaw)

  // 6. Effective annual rate using monthly IRR × 12
  const monthlyIRR = calculateMonthlyIRR(
    emiRaw,
    tenureMonths,
    moneyReceivedRaw
  )

  const effectiveRatePercent = round2(monthlyIRR * 12 * 100)

  // 7. Affordability
  const moneyLeftRaw = monthlyIncome - monthlyExpenses

  const emiShareRaw =
    moneyLeftRaw > 0
      ? (emiRaw / moneyLeftRaw) * 100
      : null

  const moneyLeft = round2(moneyLeftRaw)

  const emiShareOfLeftPercent =
    emiShareRaw === null
      ? null
      : round2(emiShareRaw)

  // 8. Verdict thresholds from the proposed data shapes.
  let verdict
  const reasons = []

  if (
    moneyLeftRaw <= 0 ||
    emiShareRaw > 50
  ) {
    verdict = 'Avoid'

    if (moneyLeftRaw <= 0) {
      reasons.push(
        'No money is left after monthly expenses.'
      )
    } else {
      reasons.push(
        `The EMI takes ${round2(emiShareRaw)}% of the money left each month.`
      )
    }
  } else if (emiShareRaw > 30) {
    verdict = 'Okay'

    reasons.push(
      `The EMI takes ${round2(emiShareRaw)}% of the money left each month.`
    )
  } else {
    verdict = 'Good'

    reasons.push(
      `The EMI takes ${round2(emiShareRaw)}% of the money left each month.`
    )
  }

  if (hiddenExtraRaw > 0) {
    reasons.push(
      `Fees and GST add ₹${hiddenExtra.toFixed(2)} on top of the interest.`
    )
  }

  // 9. Assumptions
  const assumptions = [
    'EMI uses the reducing-balance formula at the advertised rate.',
    'Processing fee, GST on the fee and other charges are deducted upfront.',
    'GST is applied to the processing fee only, not to interest.',
    'Effective rate = monthly IRR × 12.',
  ]

  // 10. Return agreed calculation result shape.
  return {
    emi,
    totalInterest,
    fees,
    gstAmount,
    hiddenExtra,
    totalPaid,
    moneyReceived,
    effectiveRatePercent,
    annualizationMethod: 'monthly IRR × 12',
    assumptions,
    moneyLeft,
    emiShareOfLeftPercent,
    verdict,
    reasons,
  }
}
