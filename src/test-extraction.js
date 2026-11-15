
import { extractTerms } from "./api/ai.js";
import offers from "../docs/test-data/offers.json";

async function runExtractionTests() {
  console.log("========== LOAN EXTRACTION TESTS ==========");

  let passed = 0;
  let failed = 0;

  const fields = [
    "amount",
    "tenureMonths",
    "annualRatePercent",
    "processingFee",
    "gstOnFeesPercent",
    "otherCharges"
  ];

  for (const offer of offers) {
    console.log(`\nTesting ${offer.id}...`);

    try {
      const actual = await extractTerms(offer.text);

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
  console.log("Total:", passed + failed);
}

runExtractionTests();