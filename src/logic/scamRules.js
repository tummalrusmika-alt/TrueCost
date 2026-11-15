
export function checkScamRules(text) {
  const message = String(text || '').toLowerCase()
  const redFlags = []

  // 1. Advance payment requests
  if (
    /processing fee|advance fee|pay first|upfront fee|payment required|registration fee|transfer.*before|pay.*before|before.*release|before.*disbursement|send.*money/.test(message)
  ) {
    redFlags.push(
      'Requests an upfront payment before providing the loan.'
    )
  }

  // 2. Urgency and pressure
  if (
    /immediately|urgent|10 minutes|limited time|act now|within minutes|hurry|within \d+ minutes/.test(message)
  ) {
    redFlags.push(
      'Creates urgency or pressures you to act quickly.'
    )
  }

  // 3. Suspicious links
  if (
    /click here|click the link|unknown link|open this link|click this link/.test(message)
  ) {
    redFlags.push(
      'Asks you to open a potentially suspicious link.'
    )
  }

  // 4. Sensitive information requests
  if (
    /share otp|send otp|tell us your otp|share your pin|bank password|share your password/.test(message)
  ) {
    redFlags.push(
      'Requests sensitive personal or banking information.'
    )
  }

  // 5. Suspicious approval claims
  if (
    /guaranteed loan|guaranteed approval|no verification|instant approval/.test(message)
  ) {
    redFlags.push(
      'Promises guaranteed or instant loan approval.'
    )
  }

  // 6. Personal payment accounts
  if (
    /personal upi|personal account|personal upi account|individual upi/.test(message)
  ) {
    redFlags.push(
      'Requests payment to a personal account instead of a verified lender.'
    )
  }

  // 7. Discourages bank verification
  if (
    /do not contact the bank|don't contact the bank|never contact the bank|do not verify|don't verify|avoid contacting the bank/.test(message)
  ) {
    redFlags.push(
      'Discourages you from independently verifying the loan with your bank.'
    )
  }

  // 8. Risk classification
  let riskLevel = 'Low'

  if (redFlags.length >= 2) {
    riskLevel = 'High'
  } else if (redFlags.length === 1) {
    riskLevel = 'Medium'
  }

  return {
    riskLevel,
    redFlags,
    explanation: '',
    nextSteps: [
      'Do not pay an advance fee without verifying the lender.',
      'Contact your bank through its official website or app.',
      'Never share your OTP, PIN or password.',
      'Report suspected financial fraud at 1930 or cybercrime.gov.in.'
    ]
  }
}
