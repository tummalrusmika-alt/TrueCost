
export function checkScamRules(text) {
  const message = text.toLowerCase()
  const redFlags = []

  if (
    message.includes('processing fee') ||
    message.includes('pay') ||
    message.includes('payment')
  ) {
    redFlags.push('Requests an upfront payment.')
  }

  if (
    message.includes('10 minutes') ||
    message.includes('immediately') ||
    message.includes('urgent')
  ) {
    redFlags.push('Creates urgency or pressure.')
  }

  if (
    message.includes('click the link') ||
    message.includes('click here')
  ) {
    redFlags.push('Asks the user to click a link.')
  }

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
      'Do not pay an advance fee without verification.',
      'Verify the offer through your bank official website.',
      'Never share your OTP, PIN or password.'
    ]
  }
}
