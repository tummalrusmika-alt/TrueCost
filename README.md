# TrueCost

**TrueCost** is an AI-powered financial awareness application designed to help users understand loan offers, evaluate borrowing costs, and identify possible scam risks.

The project uses React, Vite, Firebase AI Logic, and Gemini to make financial information easier to understand.

## Features

- **Loan Term Extraction:** Extracts loan amount, tenure, interest rate, processing fee, GST, and other charges from loan offer text.
- **Loan Explanation:** Explains loan calculation results in simple language.
- **Scam Risk Explanation:** Uses rule-based risk assessment results to explain possible warning signs in a loan message.
- **Multilingual AI Support:** Supports English, Telugu, and Hindi.
- **AI Error Handling:** Handles invalid inputs, unavailable responses, timeouts, and API quota limits.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend |
| Vite | Development and build tool |
| JavaScript | Application logic |
| Firebase | Backend services |
| Firebase AI Logic | AI integration |
| Gemini | AI-powered explanations |
| GitHub | Version control |

## Person C – AI Integration

Person C is responsible for implementing and testing the AI functionality.

Main file responsibilities:

- `src/firebase.js` – Firebase and AI initialization.
- `src/api/ai.js` – AI functions and response validation.
- `src/test-ai.js` – AI testing.
- `README.md` – AI integration documentation.

### AI Functions

**1. extractTerms(offerText)**

Extracts six loan-related fields:

- `amount`
- `tenureMonths`
- `annualRatePercent`
- `processingFee`
- `gstOnFeesPercent`
- `otherCharges`

Missing or unclear values are returned as `null` instead of being guessed.

**2. explain(result, language)**

Explains the loan calculation result in simple language and supports English, Telugu, and Hindi.

**3. explainScam(offerText, ruleResult, language)**

Explains possible scam warning signs using the supplied rule-based assessment. It does not claim that an offer is definitely genuine or fake.

### AI Safety and Validation

- Validates input length and language.
- Checks AI-generated JSON responses.
- Rejects invalid or unsupported numerical values.
- Checks whether numerical claims in explanations are supported by the supplied data.
- Includes a 20-second timeout.
- Handles API errors and quota limits.
- Does not intentionally expose API secrets in frontend code.

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/tummalrusmika-alt/TrueCost.git
cd TrueCost
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the project root and add your Firebase web app configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use your own Firebase project configuration. Never commit private credentials or debug tokens.

### 4. Run the application

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 5. Build the application

```bash
npm run build
```

## AI Testing

Run the AI tests using the project's test file and the browser console.

Test the following:

1. Loan term extraction.
2. Loan explanation in English.
3. Loan explanation in Telugu.
4. Loan explanation in Hindi.
5. Scam risk explanation in all three languages.
6. Invalid input handling.
7. Timeout and API quota error handling.

**Note:** Gemini free-tier request limits may temporarily prevent AI tests from completing. A quota error does not necessarily indicate a problem with the application code.

## Security Notes

- Keep `.env` out of GitHub.
- Do not expose Gemini API secrets in frontend code.
- Configure Firebase App Check for development and production.
- Never publish development debug tokens.
- Use fictional data for testing.

## Team Contribution

The project is developed collaboratively. Each team member works on assigned responsibilities using Git branches and pull requests.

---

**TrueCost – Understand Before You Borrow.**

## Person B – Loan Calculation Engine

The calculation engine is implemented in JavaScript in `src/logic/calculate.js`.

### 1. EMI Calculation
Uses the reducing-balance EMI formula:

EMI = P × r × (1+r)^n / ((1+r)^n - 1)

Where:
- P = Loan principal
- r = Monthly interest rate
- n = Loan tenure in months

For zero-interest loans, EMI = P / n.

### 2. Loan Cost Calculation
- Total Interest = Total EMI Payments - Principal
- Processing Fees = Processing Fee + Other Charges
- GST = Processing Fee × GST Percentage / 100
- Total Paid = Total EMI Payments + Fees + GST
- Money Received = Loan Amount - Upfront Charges

### 3. Effective Interest Rate
Uses the monthly Internal Rate of Return (IRR), calculated using the bisection method.

Annualized Rate = Monthly IRR × 12 × 100

### 4. Affordability Analysis
- Money Left = Monthly Income - Monthly Expenses
- EMI Share = EMI / Money Left × 100

### 5. Loan Verdict
- Good: EMI takes up to 30% of remaining money.
- Okay: EMI takes more than 30% but no more than 50%.
- Avoid: EMI takes more than 50%, or no money remains.

### 6. Testing
Automated tests are written using Vitest.

Current test coverage:
- Loan calculation: 7 tests
- Scam detection: 5 tests
- Total: 12 passing tests.
