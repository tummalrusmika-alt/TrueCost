
# 💰 TrueCost – Understand Before You Borrow

**TrueCost** is an AI-powered financial awareness platform that helps users understand loan offers, calculate the actual cost of borrowing, compare loan offers, check affordability, and identify possible scam messages.

A low EMI or attractive interest rate does not always mean a loan is affordable. Processing fees, GST, and additional charges can increase the actual cost of borrowing.

**Our mission: Help people understand their money before making borrowing decisions.**

---

## ✨ Features

### 1. Smart Loan Calculator
- Calculate monthly EMI.
- Support reducing-balance and flat interest methods.
- Calculate total interest and total repayment.
- Include processing fees, GST, and additional charges.
- Calculate the effective annual interest rate.
- Understand the actual amount received after upfront charges.

### 2. Loan Affordability Checker
- Enter monthly income and expenses.
- Calculate money remaining after expenses.
- Evaluate whether the EMI fits the user's available money.
- Display a simple verdict: Good, Okay, or Avoid.

### 3. AI-Powered Loan Offer Extraction
- Paste loan offer text.
- Extract available loan details.
- Identify loan amount, interest rate, tenure, and charges.
- Use local text extraction when AI is unavailable.
- Review extracted values before calculating.

### 4. Loan Offer Comparison
- Compare two loan offers.
- Compare EMI and effective interest rates.
- Compare processing fees and additional charges.
- Compare total repayment and borrowing costs.
- Identify the more affordable offer.

### 5. Scam Message Detection
Identify suspicious patterns such as:
- Requests for OTP, PIN, or banking credentials.
- Advance processing fee demands.
- Urgent payment requests.
- Suspicious shortened links.
- Possible bank impersonation.

The scam checker provides:
- Low, Medium, or High risk.
- A risk score out of 100.
- Detected warning signs.
- Safety recommendations.
- Cybercrime reporting resources.

### 6. Screenshot-Based Message Reading
- Upload screenshots containing loan or suspicious messages.
- Use AI to read screenshot text when available.
- Check extracted messages for possible scam indicators.
- Allow manual text entry if AI is unavailable.

### 7. Multilingual Support
TrueCost supports:
- English
- తెలుగు (Telugu)
- हिंदी (Hindi)

### 8. Voice Support
- Enter scam messages using voice input where supported.
- Listen to explanations using text-to-speech.
- Support language-aware voice interactions.

### 9. AI Fallback Handling
- Handle AI timeouts and request-limit errors.
- Use rule-based explanations when AI is unavailable where supported.
- Keep financial calculations independent of AI availability.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite | Development and build tool |
| JavaScript | Application logic |
| CSS | Responsive styling |
| Firebase | Backend services |
| Firebase AI Logic | AI integration |
| Gemini | AI-powered explanations |
| Vitest | Testing |
| GitHub | Version control |

---

## 🏗️ Project Structure

```text
TrueCost/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── ai.js
│   │
│   ├── logic/
│   │   ├── TrueCost.jsx
│   │   ├── TrueCost.css
│   │   ├── Compare.jsx
│   │   ├── calculate.js
│   │   ├── scamRules.js
│   │   ├── extract.js
│   │   ├── translations.js
│   │   ├── privacy.js
│   │   └── speech.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm
- Git
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/tummalrusmika-alt/TrueCost.git
```

### 2. Open the project folder

```bash
cd TrueCost
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env` file in the root directory and add your Firebase web application configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use your own Firebase project values. Never upload private credentials or development debug tokens to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Create a production build

```bash
npm run build
```

### 7. Preview the production build

```bash
npm run preview
```

---

## 🧮 Financial Calculation Logic

TrueCost uses JavaScript-based calculations for financial results.

### EMI Formula

For reducing-balance loans:

\[
EMI = \frac{P \times r \times (1+r)^n}{(1+r)^n-1}
\]

Where:
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of monthly payments

For zero-interest loans:

\[
EMI = \frac{P}{n}
\]

### Additional Calculations

- Total Interest = Total EMI Payments − Principal
- GST on Processing Fee = Processing Fee × GST Percentage / 100
- Total Paid = Total EMI Payments + Fees + GST + Other Charges
- Money Received = Loan Amount − Upfront Charges

### Affordability

- Money Left = Monthly Income − Monthly Expenses
- EMI Share = EMI / Money Left × 100

The application uses its affordability rules to generate a loan verdict.

---

## 🛡️ Scam Detection

The scam checker uses rule-based detection to identify common warning signs.

| Risk Level | Meaning |
|---|---|
| Low | Few common warning signs detected |
| Medium | Some suspicious warning signs detected |
| High | Strong warning signs detected |

The risk score is an educational screening indicator, not proof that a message is genuine or fraudulent.

---

## 🤖 AI Integration

Firebase AI Logic and Gemini support the AI features.

Main functions:

- `extractTerms()` – Extracts loan details from offer text.
- `explain()` – Explains financial calculation results.
- `explainScam()` – Explains possible scam warning signs.

AI provides supplementary explanations. Financial calculations and initial scam risk assessment are handled by application logic.

---

## 📱 Responsive Design

TrueCost is a responsive web application designed for:
- Desktop computers
- Laptops
- Tablets
- Android phones
- iPhones

The interface aims to provide:
- Mobile-friendly forms.
- Readable text and buttons.
- Responsive content cards.
- Easy-to-use input fields.
- Mobile-friendly loan results.
- Touch-friendly controls.

---

## 🧪 Testing

Test the application with:

1. A normal loan offer.
2. A zero-interest EMI offer.
3. A loan with processing fees and GST.
4. A loan with additional charges.
5. Two different loan offers.
6. A message requesting OTP or PIN.
7. A message demanding an advance processing fee.
8. A suspicious shortened link.
9. A normal bank notification.
10. English, Telugu, and Hindi explanations.
11. AI timeout and quota-limit scenarios.

Run the production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

---

## 🔐 Security and Privacy

- Keep `.env` out of GitHub.
- Never expose private credentials.
- Configure Firebase App Check appropriately.
- Do not publish development debug tokens.
- Use fictional data during testing.
- Never share OTPs, PINs, or banking passwords.
- Verify financial offers through official lender channels.

---

## 👥 Team Contributions

### Person B – Financial Calculation and Scam Detection
- EMI calculation.
- Loan cost calculation.
- Effective interest rate.
- Affordability analysis.
- Loan offer comparison.
- Rule-based scam detection.

### Person C – AI Integration
- Firebase AI initialization.
- Gemini integration.
- Loan offer extraction.
- AI-generated explanations.
- Multilingual AI support.
- AI error handling and fallback support.

---

## 🔮 Future Improvements

- Installable Progressive Web App (PWA).
- Improved offline functionality.
- More Indian regional languages.
- Enhanced screenshot text extraction.
- Improved scam detection.
- Additional loan comparison features.
- Further mobile-first improvements.

---

## ⚠️ Disclaimer

TrueCost is an educational financial awareness application. It does not provide professional financial, legal, or banking advice.

Always verify loan terms, charges, and lender information through official sources before making financial decisions.

---

## 🔗 Project Repository

**GitHub:** https://github.com/tummalrusmika-alt/TrueCost

---

**TrueCost – Understand Before You Borrow.**