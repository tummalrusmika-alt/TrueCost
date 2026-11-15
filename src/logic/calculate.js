
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function calculateEMI(amount, tenureMonths, annualRatePercent) {
  const monthlyRate = annualRatePercent / 1200

  if (monthlyRate === 0) {
    return amount / tenureMonths
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return amount * monthlyRate * factor / (factor - 1)
}

function calculateMonthlyIRR(emi, tenureMonths, moneyReceived) {
  if (moneyReceived <= 0) {
    throw new Error('Money received must be greater than zero.')
  }

  const pv = rate => {
    if (rate === 0) return emi * tenureMonths

    return emi * (1 - Math.pow(1 + rate, -tenureMonths)) / rate
  }

  let low = 0
  let high = 1

  while (pv(high) > moneyReceived && high < 1e10) {
    high *= 2
  }

  if (!Number.isFinite(high) || pv(high) > moneyReceived) {
    throw new Error('Unable to calculate effective interest rate.')
  }

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2

    if (pv(mid) > moneyReceived) {
      low = mid
    } else {
      high = mid
    }
  }

  return (low + high) / 2
}

export function calculateLoan(terms, affordability) {
  if (!terms || !affordability) {
    throw new Error('Loan details are missing.')
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

  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid or missing value: ${key}`)
    }
  }

  if (amount <= 0 || tenureMonths <= 0 || monthlyIncome <= 0) {
    throw new Error('Amount, tenure and income must be above zero.')
  }

  if (!Number.isInteger(tenureMonths)) {
    throw new Error('Tenure must be a whole number of months.')
  }

  const emiRaw = calculateEMI(
    amount,
    tenureMonths,
    annualRatePercent
  )

  const totalInterestRaw = emiRaw * tenureMonths - amount
  const feesRaw = processingFee + otherCharges
  const gstAmountRaw = processingFee * gstOnFeesPercent / 100
  const hiddenExtraRaw = feesRaw + gstAmountRaw

  const moneyReceivedRaw = amount - hiddenExtraRaw

  if (moneyReceivedRaw <= 0) {
    throw new Error('Fees and GST must be less than the loan amount.')
  }

  const monthlyIRR = calculateMonthlyIRR(
    emiRaw,
    tenureMonths,
    moneyReceivedRaw
  )

  const moneyLeftRaw = monthlyIncome - monthlyExpenses

  const emiShareRaw = moneyLeftRaw > 0
    ? emiRaw / moneyLeftRaw * 100
    : null

  const emi = round2(emiRaw)
  const totalInterest = round2(totalInterestRaw)
  const fees = round2(feesRaw)
  const gstAmount = round2(gstAmountRaw)
  const hiddenExtra = round2(hiddenExtraRaw)
  const moneyReceived = round2(moneyReceivedRaw)

  const totalPaid = round2(
    amount + totalInterest + hiddenExtra
  )

  const moneyLeft = round2(moneyLeftRaw)

  const emiShareOfLeftPercent = emiShareRaw === null
    ? null
    : round2(emiShareRaw)

  let verdict
  const reasons = []

  if (moneyLeftRaw <= 0 || emiShareRaw > 50) {
    verdict = 'Avoid'
    reasons.push(
      moneyLeftRaw <= 0
        ? 'No money is left after monthly expenses.'
        : `The EMI takes ${round2(emiShareRaw)}% of the money left each month.`
    )
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

  if (hiddenExtra > 0) {
    reasons.push(
      `Fees and GST add ₹${hiddenExtra.toFixed(2)} on top of the interest.`
    )
  }

  return {
    emi,
    totalInterest,
    fees,
    gstAmount,
    hiddenExtra,
    totalPaid,
    moneyReceived,
    effectiveRatePercent: round2(monthlyIRR * 12 * 100),
    annualizationMethod: 'monthly IRR × 12',
    assumptions: [
      'EMI uses the reducing-balance formula at the advertised rate.',
      'Processing fee, GST on the fee and other charges are deducted upfront.',
      'GST is applied to the processing fee only, not to interest.',
      'Effective rate = monthly IRR × 12.'
    ],
    moneyLeft,
    emiShareOfLeftPercent,
    verdict,
    reasons
  }
}
