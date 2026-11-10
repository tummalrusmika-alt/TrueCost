
# TrueCost AI Examples

This file explains how the three AI functions work.

AI only extracts loan details and explains results. It does not calculate EMIs or detect scams. Those tasks are handled by code.

---

## 1. extractTerms()

Purpose: Extract loan details from pasted text.

### Example input

Sample Bank offers a loan of Rs. 50,000 for 12 months at 14% annual interest. Processing fee is Rs. 999 plus 18% GST. There are no other charges.

### Expected output

```json
{
  "amount": 50000,
  "tenureMonths": 12,
  "annualRatePercent": 14,
  "processingFee": 999,
  "gstOnFeesPercent": 18,
  "otherCharges": 0
}
```

---

## 2. explain()

Purpose: Explain the calculation result provided by Person B.

### Example input

```json
{
  "emi": 4489.36,
  "totalInterest": 3872.32,
  "fees": 999,
  "gstAmount": 179.82,
  "hiddenExtra": 1178.82,
  "totalPaid": 55051.14,
  "moneyReceived": 48821.18,
  "effectiveRatePercent": 18.58,
  "annualizationMethod": "monthly IRR × 12",
  "assumptions": [
    "EMI uses the reducing-balance formula at the advertised rate."
  ],
  "moneyLeft": 10000,
  "emiShareOfLeftPercent": 44.9,
  "verdict": "Okay",
  "reasons": [
    "The EMI takes 44.9% of the money you have left each month."
  ]
}
```

### Expected output

```json
{
  "text": "Your loan verdict is Okay. Your monthly EMI is 4489.36. The EMI takes 44.9% of your remaining monthly money. The effective annual rate is 18.58%. This is an educational tool, not financial advice."
}
```

---

## 3. explainScam()

Purpose: Explain the scam risk result provided by Person B.

### Example input

```json
{
  "riskLevel": "High",
  "redFlags": [
    "Asks for a fee before the loan is given",
    "Creates urgency"
  ],
  "explanation": "",
  "nextSteps": [
    "Do not pay anything.",
    "Check with your bank using its official app or website."
  ]
}
```

### Expected output

```json
{
  "text": "This message has a high risk level because it asks for a fee before giving the loan. Do not pay or share personal information. Verify the offer using your bank's official app or website. This is a guide, not proof. Always verify with your bank."
}
```

---

## 4. Common error response

All three functions must return this type of error when something goes wrong.

```json
{
  "error": true,
  "message": "The AI helper is not available right now. You can fill in the form by hand."
}
```

Possible reasons:
- Daily AI request limit reached.
- Internet connection unavailable.
- AI response could not be read.
- Empty text.
- Text exceeds 3000 characters.
- Unsupported language.

The app must continue working without AI.

---

## Important rule

AI extracts and explains information.

Person B's code calculates loan results and detects scam risk.

AI must never calculate or change numbers.