// src/logic/privacy.js
// Hides personal and sensitive numbers BEFORE any text is sent to the AI.
// The rule-based checks run on the user's device, so they use the original text.

const RULES = [
  // OTP / PIN / CVV / password followed by a code, e.g. "OTP is 482913".
  {
    pattern:
      /\b(otp|pin|cvv|cvc|password|passcode)\b([^0-9\n]{0,25})(\d{3,8})\b/gi,
    replace: (match, word, between) => `${word}${between}[hidden]`
  },

  // Card numbers (13-19 digits, optional spaces or hyphens).
  {
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    replace: () => '[card number hidden]'
  },

  // Aadhaar numbers (12 digits, often grouped 4-4-4).
  {
    pattern: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g,
    replace: () => '[ID number hidden]'
  },

  // PAN numbers, e.g. ABCDE1234F.
  {
    pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
    replace: () => '[PAN hidden]'
  },

  // Indian mobile numbers with optional +91 / 0 prefix.
  {
    pattern: /(?:\+?91[-\s]?|0)?\b[6-9]\d{4}[-\s]?\d{5}\b/g,
    replace: () => '[phone hidden]'
  },

  // Email addresses.
  {
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    replace: () => '[email hidden]'
  },

  // UPI IDs, e.g. name@okaxis (no dot after the @).
  {
    pattern: /\b[a-z0-9.\-_]{2,}@[a-z]{2,}\b/gi,
    replace: () => '[UPI ID hidden]'
  }
];

export function redactSensitive(text) {
  if (typeof text !== 'string') {
    return { text: '', changed: false };
  }

  let output = text;

  for (const rule of RULES) {
    output = output.replace(rule.pattern, rule.replace);
  }

  return { text: output, changed: output !== text };
}