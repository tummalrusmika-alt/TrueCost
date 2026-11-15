import { extractTerms } from "./api/ai.js";
import offers from "../docs/test-data/offers.json";

// Free tier allows 5 requests/minute, so wait between tests.
const DELAY_BETWEEN_TESTS_MS = 13000;
// If a request still hits the limit, wait this long and retry.
const RETRY_WAIT_MS = 25000;
const MAX_RETRIES = 2;

// To re-run only some offers, list their ids, e.g. ["O8", "O10", "O11", "O12"].
// Leave empty to run all offers.
const ONLY = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ai.js returns this message when Gemini replies 429 (quota exceeded).
function isRateLimited(result) {
  return (
    result?.error === true &&
    typeof result.message === "string" &&
    result.message.toLowerCase().includes("request limit")
  );
}

// Calls extractTerms and retries when the free-tier limit is hit.
async function extractWithRetry(text) {
  let result = await extractTerms(text);
  let attempts = 0;

  while (isRateLimited(result) && attempts < MAX_RETRIES) {
    attempts++;
    console.warn(
      `Rate limit reached. Waiting ${RETRY_WAIT_MS / 1000}s before retry ${attempts}/${MAX_RETRIES}...`
    );
    await sleep(RETRY_WAIT_MS);
    result = await extractTerms(text);
  }

  return result;
}

async function runExtractionTests() {
  console.log("========== LOAN EXTRACTION TESTS ==========");

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  const fields = [
    "amount",
    "tenureMonths",
    "annualRatePercent",
    "processingFee",
    "gstOnFeesPercent",
    "otherCharges"
  ];

  const selectedOffers =
    ONLY.length > 0 ? offers.filter((offer) => ONLY.includes(offer.id)) : offers;

  for (let i = 0; i < selectedOffers.length; i++) {
    const offer = selectedOffers[i];

    if (i > 0) {
      await sleep(DELAY_BETWEEN_TESTS_MS);
    }

    console.log(`\nTesting ${offer.id}...`);

    try {
      const actual = await extractWithRetry(offer.text);

      // A quota error is not a real answer from the AI, so don't count it as pass or fail.
      if (isRateLimited(actual)) {
        skipped++;
        console.warn(
          "SKIPPED:",
          offer.id,
          "Rate limit still reached after retries. Run this offer again later."
        );
        continue;
      }

      if (offer.expected === "ERROR_NO_LOAN_TERMS") {
        if (actual?.error === true) {
          passed++;
          console.log("PASS:", offer.id, "Correctly rejected offer without loan terms.");
        } else {
          failed++;
          console.error("FAIL:", offer.id, "Expected an error, received:", actual);
        }
        continue;
      }

      if (!actual || actual.error) {
        failed++;
        console.error("FAIL:", offer.id, actual);
        continue;
      }

      const mismatches = [];

      for (const field of fields) {
        if (actual[field] !== offer.expected[field]) {
          mismatches.push({
            field,
            expected: offer.expected[field],
            received: actual[field]
          });
        }
      }

      if (mismatches.length === 0) {
        passed++;
        console.log("PASS:", offer.id);
      } else {
        failed++;
        console.error("FAIL:", offer.id, mismatches);
      }
    } catch (error) {
      failed++;
      console.error("FAIL:", offer.id, error);
    }
  }

  console.log("\n========== TEST SUMMARY ==========");
  console.log("Passed:", passed);
  console.log("Failed:", failed);
  console.log("Skipped (rate limit):", skipped);
  console.log("Total:", passed + failed + skipped);
}

runExtractionTests();