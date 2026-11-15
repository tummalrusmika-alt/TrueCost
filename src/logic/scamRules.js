
export function checkScamRules(text) {
  const message = text.toLowerCase()
  const redFlags = []

  // 1. Advance payment requests
  if (
    /processing fee|advance fee|pay first|upfront fee|payment required|registration fee/.test(message)
  ) {
    redFlags.push(
      'Requests an upfront payment before providing the loan.'
    )
  }

  // 2. Urgency and pressure
  if (
    /immediately|urgent|10 minutes|limited time|act now|within minutes|hurry/.test(message)
  ) {
    redFlags.push(
      'Creates urgency or pressures you to act quickly.'
    )
  }

  // 3. Suspicious links
  if (
    /click here|click the link|unknown link|open this link/.test(message)
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

  // Calculate risk using number of detected flags
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
