# TrueCost AI Examples

This file explains how the three AI functions work.

AI only extracts loan details and explains results. It does not calculate EMIs or detect scams. Those tasks are handled by code.

---

## 1. extractTerms()

**Purpose:** Extract loan details from pasted text.

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

The AI must extract only information supported by the offer text. It must not invent missing values.

---

## 2. explain()

**Purpose:** Explain the calculation result provided by Person B.

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

### Example output

```json
{
  "text": "Your loan verdict is Okay. Your monthly EMI is 4489.36. The EMI takes 44.9% of your remaining monthly money. The effective annual rate is 18.58%. This is an educational tool, not financial advice."
}
```

The wording is illustrative. Actual AI responses may use different wording.

**Important rules:**
- Explain the result provided by Person B.
- Do not calculate or change any numbers.
- Do not change the verdict.
- Do not invent financial information.

---

## 3. explainScam()

**Purpose:** Explain the scam risk result provided by Person B.

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

### Example output

```json
{
  "text": "This message has a high risk level because it asks for a fee before giving the loan. Do not pay or share personal information. Verify the offer using your bank's official app or website. This is a guide, not proof. Always verify with your bank."
}
```

The wording is illustrative. Actual AI responses may use different wording.

**Important rules:**
- Explain the risk result provided by Person B.
- Do not change the risk level.
- Do not claim that a message is definitely a scam.
- Always include this exact final disclaimer:

"This is a guide, not proof. Always verify with your bank."

---

## 4. Common error response

All three functions must return a consistent error object when something goes wrong.

```json
{
  "error": true,
  "message": "AI could not process this request. Please try again or fill in the form manually."
}
```

Possible reasons:
- Daily AI request limit reached.
- Internet connection unavailable.
- AI response could not be read.
- Empty text.
- Text exceeds 3000 characters.
- Unsupported language.

The actual error message may vary depending on the error type.

The app must continue working without AI.

---

## 5. Important responsibility rules

| Task | Responsible part |
|---|---|
| Extract loan details | Person C – AI |
| Calculate EMI and loan costs | Person B – Code |
| Decide loan verdict | Person B – Code |
| Detect scam risk | Person B – Code |
| Explain loan results | Person C – AI |
| Explain scam risk | Person C – AI |

**Final rule:** AI extracts and explains information. It must never calculate, change, or invent numbers. Person B's code remains responsible for calculations and scam detection.
