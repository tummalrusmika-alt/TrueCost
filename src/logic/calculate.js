
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

// Calculate monthly EMI using reducing balance method
function calculateEMI(amount, tenureMonths, annualRatePercent) {
  const monthlyRate = annualRatePercent / 1200

  if (monthlyRate === 0) {
    return amount / tenureMonths
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return (
    amount * monthlyRate * factor / (factor - 1)
  )
}

// Calculate monthly IRR using binary search
function calculateMonthlyIRR(emi, tenureMonths, moneyReceived) {
  if (moneyReceived <= 0) {
    throw new Error('Money received must be greater than zero.')
  }

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

  let low = 0
  let high = 1

  while (presentValue(high) > moneyReceived && high < 1e10) {
    high *= 2
  }

  if (!Number.isFinite(high) || presentValue(high) > moneyReceived) {
    throw new Error('Unable to calculate effective interest rate.')
  }

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

// MAIN CALCULATION FUNCTION
export function calculateLoan(terms, affordability) {

  // Check input objects
  if (!terms || !affordability) {
    throw new Error(
      'Loan terms and affordability details are required.'
    )
  }

  const amount = Number(terms.amount)
  const tenureMonths = Number(terms.tenureMonths)
  const annualRatePercent = Number(terms.annualRatePercent)
  const processingFee = Number(terms.processingFee)
  const gstOnFeesPercent = Number(terms.gstOnFeesPercent)
  const otherCharges = Number(terms.otherCharges)

  const monthlyIncome = Number(affordability.monthlyIncome)
  const monthlyExpenses = Number(affordability.monthlyExpenses)

  const values = {
    amount,
    tenureMonths,
    annualRatePercent,
    processingFee,
    gstOnFeesPercent,
    otherCharges,
    monthlyIncome,
    monthlyExpenses
  }

  // Validate all values
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid or missing value: ${key}`)
    }
  }

  if (
    amount <= 0 ||
    tenureMonths <= 0 ||
    monthlyIncome <= 0
  ) {
    throw new Error(
      'Loan amount, tenure and income must be above zero.'
    )
  }

  if (!Number.isInteger(tenureMonths)) {
    throw new Error('Tenure must be a whole number of months.')
  }

  // 1. EMI
  const emiRaw = calculateEMI(
    amount,
    tenureMonths,
    annualRatePercent
  )

  // 2. Total interest
  const totalInterestRaw =
    emiRaw * tenureMonths - amount

  // 3. Fees
  const feesRaw = processingFee + otherCharges

  // 4. GST
  const gstAmountRaw =
    processingFee * gstOnFeesPercent / 100

  // 5. Hidden extra cost
  const hiddenExtraRaw =
    feesRaw + gstAmountRaw

  // 6. Actual amount received
  const moneyReceivedRaw =
    amount - hiddenExtraRaw

  if (moneyReceivedRaw <= 0) {
    throw new Error(
      'Fees and GST must be less than the loan amount.'
    )
  }

  // 7. Effective annual interest rate
  const monthlyIRR = calculateMonthlyIRR(
    emiRaw,
    tenureMonths,
    moneyReceivedRaw
  )

  const effectiveRateRaw = monthlyIRR * 12 * 100

  // 8. Affordability
  const moneyLeftRaw =
    monthlyIncome - monthlyExpenses

  const emiShareRaw =
    moneyLeftRaw > 0
      ? (emiRaw / moneyLeftRaw) * 100
      : null

  // Round returned values only
  const emi = round2(emiRaw)
  const totalInterest = round2(totalInterestRaw)
  const fees = round2(feesRaw)
  const gstAmount = round2(gstAmountRaw)
  const hiddenExtra = round2(hiddenExtraRaw)
  const moneyReceived = round2(moneyReceivedRaw)

  const totalPaid = round2(
    amount + totalInterestRaw + hiddenExtraRaw
  )

  const moneyLeft = round2(moneyLeftRaw)

  const emiShareOfLeftPercent =
    emiShareRaw === null
      ? null
      : round2(emiShareRaw)

  const effectiveRatePercent =
    round2(effectiveRateRaw)

  // 9. Verdict
  let verdict
  const reasons = []

  if (moneyLeftRaw <= 0 || emiShareRaw > 50) {
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

  // 10. Assumptions
  const assumptions = [
    'EMI uses the reducing-balance formula at the advertised rate.',
    'Processing fee, GST on the fee and other charges are deducted upfront.',
    'GST is applied to the processing fee only, not to interest.',
    'Effective rate = monthly IRR × 12.'
  ]

  // 11. Return complete result
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
    reasons
  }
}
