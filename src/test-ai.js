
import { extractTerms } from "./api/ai.js";

async function runTests() {
  console.log("Testing extractTerms validation...");

  const invalidCases = [
    "",
    "   ",
    "A".repeat(3001),
    null,
    123
  ];

  for (let i = 0; i < invalidCases.length; i++) {
    const result = await extractTerms(invalidCases[i]);
    console.log(`Invalid case ${i + 1}:`, result);
  }

  console.log("extractTerms validation tests completed.");
}

runTests();
