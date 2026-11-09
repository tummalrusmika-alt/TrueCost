
import { model } from "../firebase.js";

const MAX_LENGTH = 3000;
const TIMEOUT_MS = 20000;

const LANGUAGES = {
  en: "English",
  te: "Telugu",
  hi: "Hindi",
};

const ERROR_MESSAGES = {
  general: "AI could not process this request. Please try again or fill in the form manually.",
  timeout: "AI is taking too long to respond. Please try again.",
  quota: "Daily AI request limit reached. Please try again after the quota resets.",
  invalid: "Please enter valid information and try again.",
  noTerms: "No clear loan terms were found. Please enter the loan details manually.",
};

const TERM_KEYS = [
  "amount",
  "tenureMonths",
  "annualRatePercent",
  "processingFee",
  "gstOnFeesPercent",
  "otherCharges",
];

function error(message) {
  return {
    error: true,
    message,
  };
}

function validateText(value) {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();

  return (
    trimmed.length > 0 &&
    trimmed.length <= MAX_LENGTH
  );
}

function validateLanguage(language) {
  return Object.prototype.hasOwnProperty.call(
    LANGUAGES,
    language
  );
}

function withTimeout(promise, milliseconds = TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("AI_TIMEOUT"));
    }, milliseconds);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function generate(prompt) {
  try {
    const result = await withTimeout(
      model.generateContent(prompt)
    );

    const response = result.response;
    const text = response.text();

    if (!text || typeof text !== "string") {
      return error(ERROR_MESSAGES.general);
    }

    return {
      text: text.trim(),
    };
  } catch (err) {
    console.error("AI generation error:", err);

    const message = String(err?.message || "");
    const lowerMessage = message.toLowerCase();

    if (message === "AI_TIMEOUT") {
      return error(ERROR_MESSAGES.timeout);
    }

    if (
      message.includes("429") ||
      lowerMessage.includes("quota exceeded") ||
      lowerMessage.includes("limit exceeded") ||
      lowerMessage.includes("too many requests")
    ) {
      return error(ERROR_MESSAGES.quota);
    }

    return error(ERROR_MESSAGES.general);
  }
}

function parseJSON(text) {
  if (typeof text !== "string") return null;

  try {
    return JSON.parse(text);
  } catch {
    // Try removing Markdown code fences.
  }

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try extracting the JSON object.
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function validNumber(value, min = 0, max = Infinity) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

function validateTerms(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  const keys = Object.keys(data);

  if (
    keys.length !== TERM_KEYS.length ||
    !TERM_KEYS.every((key) => keys.includes(key))
  ) {
    return false;
  }

  for (const key of TERM_KEYS) {
    const value = data[key];

    if (value === null) continue;

    if (!validNumber(value)) {
      return false;
    }
  }

  if (
    data.amount !== null &&
    !validNumber(data.amount, 0.01)
  ) {
    return false;
  }

  if (
    data.tenureMonths !== null &&
    (
      !Number.isInteger(data.tenureMonths) ||
      !validNumber(data.tenureMonths, 1, 480)
    )
  ) {
    return false;
  }

  if (
    data.annualRatePercent !== null &&
    !validNumber(data.annualRatePercent, 0, 100)
  ) {
    return false;
  }

  if (
    data.processingFee !== null &&
    !validNumber(data.processingFee)
  ) {
    return false;
  }

  if (
    data.gstOnFeesPercent !== null &&
    !validNumber(data.gstOnFeesPercent, 0, 100)
  ) {
    return false;
  }

  if (
    data.otherCharges !== null &&
    !validNumber(data.otherCharges)
  ) {
    return false;
  }

  return true;
}

function containsUnsupportedDigits(text) {
  return /[०-९౦-౯]/.test(text);
}

function extractNumbers(text) {
  const matches = text.match(
    /-?\d[\d,]*(?:\.\d+)?/g
  );

  if (!matches) return [];

  return matches.map((number) =>
    number.replace(/,/g, "")
  );
}

function numbersAreGrounded(output, input) {
  const outputNumbers = extractNumbers(output);
  const inputText = JSON.stringify(input);

  return outputNumbers.every((number) => {
    return inputText.includes(number);
  });
}

function validExplanation(text, input, type = "normal") {
  if (
    typeof text !== "string" ||
    text.trim().length === 0
  ) {
    return false;
  }

  if (containsUnsupportedDigits(text)) {
    return false;
  }

  if (!numbersAreGrounded(text, input)) {
    return false;
  }

  if (type === "scam") {
    const unsafeClaim =
      /100%\s*(?:safe|genuine|real)|(?:this message|this offer|it) is definitely (?:fake|real|genuine)|guaranteed safe/i;

    if (unsafeClaim.test(text)) {
      return false;
    }
  }

  return true;
}

// --------------------------------------------------
// 1. EXTRACT LOAN TERMS
// --------------------------------------------------

export async function extractTerms(offerText) {
  try {
    if (!validateText(offerText)) {
      return error(ERROR_MESSAGES.invalid);
    }

    const prompt = `
You are a careful financial information extraction assistant.

Extract loan terms from the following offer.

Return ONLY valid JSON.
Do not include Markdown or explanations.

The JSON must contain exactly these six keys:

{
  "amount": number or null,
  "tenureMonths": number or null,
  "annualRatePercent": number or null,
  "processingFee": number or null,
  "gstOnFeesPercent": number or null,
  "otherCharges": number or null
}

Rules:

1. Never guess missing information. Use null.
2. Amount must be the loan principal amount.
3. Convert lakh and crore into numeric rupees.
4. Convert years into months.
5. Convert monthly interest rates into annual percentages only when clearly stated as a monthly rate.
6. If the interest is flat interest, return null for annualRatePercent.
7. If the processing fee is a percentage instead of a fixed amount, return null for processingFee.
8. GST must be a percentage.
9. Set otherCharges to 0 only when the offer explicitly says there are no other charges.
10. Do not treat EMI as the loan amount.
11. Use numbers only, without currency symbols or percentage signs.
12. Do not add any extra keys.

Loan offer:

${offerText}
`;

    const response = await generate(prompt);

    if (response.error) return response;

    const data = parseJSON(response.text);

    if (!validateTerms(data)) {
      return error(ERROR_MESSAGES.general);
    }

    const allNull = TERM_KEYS.every(
      (key) => data[key] === null
    );

    if (allNull) {
      return error(ERROR_MESSAGES.noTerms);
    }

    return data;
  } catch (err) {
    console.error("extractTerms error:", err);
    return error(ERROR_MESSAGES.general);
  }
}

// --------------------------------------------------
// 2. EXPLAIN CALCULATION RESULT
// --------------------------------------------------

export async function explain(result, language = "en") {
  try {
    if (
      !result ||
      typeof result !== "object" ||
      Array.isArray(result)
    ) {
      return error(ERROR_MESSAGES.invalid);
    }

    if (!validateLanguage(language)) {
      return error(ERROR_MESSAGES.invalid);
    }

    const languageName = LANGUAGES[language];

    const prompt = `
You are a simple financial education assistant.

Explain the following loan calculation result.

Return ONLY a short explanation in ${languageName}.

Rules:

1. Write exactly 3 to 4 short sentences.
2. Explain whether the verdict is Good, Okay, or Avoid.
3. Explain the EMI share of the user's remaining money.
4. Explain the effective annual rate and fees when available.
5. Use ONLY numbers already present in the supplied calculation result.
6. Never calculate or invent new financial numbers.
7. Do not change the verdict.
8. If emiShareOfLeftPercent is null, explain that no money is left after expenses.
9. Use simple language suitable for a beginner.
10. Do not give guaranteed financial advice.
11. Keep the verdict word in English: Good, Okay, or Avoid.

Calculation result:

${JSON.stringify(result)}
`;

    const response = await generate(prompt);

    if (response.error) return response;

    if (
      !validExplanation(
        response.text,
        result,
        "normal"
      )
    ) {
      console.error("Rejected financial explanation:", response.text);
      return error(ERROR_MESSAGES.general);
    }

    return {
      text: response.text,
    };
  } catch (err) {
    console.error("explain error:", err);
    return error(ERROR_MESSAGES.general);
  }
}

// --------------------------------------------------
// 3. EXPLAIN SCAM / RISK RESULT
// --------------------------------------------------

export async function explainScam(
  offerText,
  ruleResult,
  language = "en"
) {
  try {
    if (!validateText(offerText)) {
      return error(ERROR_MESSAGES.invalid);
    }

    if (
      !ruleResult ||
      typeof ruleResult !== "object" ||
      Array.isArray(ruleResult)
    ) {
      return error(ERROR_MESSAGES.invalid);
    }

    if (!validateLanguage(language)) {
      return error(ERROR_MESSAGES.invalid);
    }

    const languageName = LANGUAGES[language];

    const prompt = `
You are a responsible financial scam-awareness assistant.

Explain the risk assessment of this loan message.

Write the explanation in ${languageName}.

Return plain text only. Do not return JSON.

Rules:

1. Write exactly 3 to 4 short sentences.
2. Explain the risk level using the supplied rule result.
3. Explain the important red flags listed in the result.
4. Never claim that an offer is definitely fake or definitely genuine.
5. Never promise that an offer is safe.
6. Recommend checking the lender through official bank channels.
7. Do not repeat phone numbers, links, UPI IDs, or personal details.
8. Use simple language.
9. Do not invent additional red flags.
10. Do not introduce new numbers or percentages.
11. Do not contradict the supplied risk level.

Loan message:

${offerText}

Rule assessment:

${JSON.stringify(ruleResult)}
`;

    const response = await generate(prompt);

    if (response.error) return response;

    if (
      !validExplanation(
        response.text,
        {
          offerText,
          ruleResult,
        },
        "scam"
      )
    ) {
      console.error("Rejected scam explanation:", response.text);
      return error(ERROR_MESSAGES.general);
    }

    return {
      text: response.text,
    };
  } catch (err) {
    console.error("explainScam error:", err);
    return error(ERROR_MESSAGES.general);
  }
}
