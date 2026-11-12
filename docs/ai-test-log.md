# TrueCost AI Test Log

**Owner:** Person C  
**AI service:** Firebase AI Logic  
**Status:** Input validation tests passed. Real AI response testing is pending because of the Gemini daily quota limit.

---

## 1. Loan extraction tests

Each offer O1–O12 must be tested three times.

| Test ID | Run 1 | Run 2 | Run 3 | Status |
|---|---|---|---|---|
| O1 | Pending | Pending | Pending | Not tested |
| O2 | Pending | Pending | Pending | Not tested |
| O3 | Pending | Pending | Pending | Not tested |
| O4 | Pending | Pending | Pending | Not tested |
| O5 | Pending | Pending | Pending | Not tested |
| O6 | Pending | Pending | Pending | Not tested |
| O7 | Pending | Pending | Pending | Not tested |
| O8 | Pending | Pending | Pending | Not tested |
| O9 | Pending | Pending | Pending | Not tested |
| O10 | Pending | Pending | Pending | Not tested |
| O11 | Pending | Pending | Pending | Not tested |
| O12 | Pending | Pending | Pending | Not tested |

## 2. Explanation tests

Test `explain()` using Person B's calculation results T1–T7.

| Test ID | Status |
|---|---|
| T1 | Pending |
| T2 | Pending |
| T3 | Pending |
| T4 | Pending |
| T5 | Pending |
| T6 | Pending |
| T7 | Pending |

Check that every number in the explanation exists in the calculation result.

## 3. Scam explanation tests

Test `explainScam()` using all 12 scam messages and Person B's rule results.

| Test ID | Status |
|---|---|
| S1 | Pending |
| S2 | Pending |
| S3 | Pending |
| S4 | Pending |
| S5 | Pending |
| S6 | Pending |
| S7 | Pending |
| S8 | Pending |
| S9 | Pending |
| S10 | Pending |
| S11 | Pending |
| S12 | Pending |

Check that explanations do not contradict the risk level or claim certainty.

## 4. Failure tests

| Test | Expected behaviour | Status |
|---|---|---|
| Wrong model name | Friendly error response | Pending |
| Offline connection | Friendly error response | Pending |
| Empty text | Friendly error response | PASS for tested functions |
| 3001 characters | Friendly error response | PASS for tested functions |
| Unsupported language | Friendly error response | PASS for explainScam |
| Gemini quota exceeded | Friendly error response | Pending |

## 5. Input validation test results

**Date: 10–11 November 2026**

### extractTerms()

- Empty input: PASS
- Spaces-only input: PASS
- Input over 3000 characters: PASS
- Null input: PASS
- Number input: PASS

### explain()

- Null result: PASS
- Invalid verdict: PASS
- Invalid reasons type: PASS
- Invalid assumptions type: PASS

### explainScam() – Rule-result validation

- Invalid risk level: PASS
- Missing explanation: PASS
- Missing nextSteps: PASS
- nextSteps as a string: PASS
- Explanation as a number: PASS

### explainScam() – Language validation

- Unsupported language code: PASS
- Language name instead of language code: PASS
- Empty language: PASS
- Null language: PASS
- Number as language: PASS

### explainScam() – Offer input validation

- Empty offer: PASS
- Spaces-only offer: PASS
- Input over 3000 characters: PASS
- Null offer: PASS
- Number offer: PASS

**Total: 27 input validation tests passed.**

Note: These tests validate input handling only. They do not count as successful Gemini response tests.

## 6. Test notes

- Do not mark a test as passed without actually testing it.
- Record errors and fixes.
- Compare all three extraction runs.
- Check prompt-injection protection using O9.
- Check that the application works without AI.
- Do not count validation tests as real AI response tests.

**Current result:** Input validation tests passed. Real AI response tests and remaining failure tests are pending because the Gemini daily quota was exhausted.
## Person C Progress – 11 November 2026

### Completed
- Firebase AI initialized.
- extractTerms() implemented.
- explain() implemented.
- explainScam() implemented.
- Input validation completed.
- Language validation completed.
- Error handling implemented.
- AI examples documented.
- Test datasets created and formatted.
- 27 validation tests passed.

### Pending
- Real AI extraction tests O1–O12.
- Explanation tests T1–T7.
- Scam explanation tests S1–S12.
- Quota and offline failure tests.
- Integration with Person B's calculation and scam detection functions.

Note: Real AI tests are pending because of Gemini quota limits.

## Updated Validation Run – 11 November 2026

Latest test runner results:

| Function | Passed | Failed |
|---|---:|---:|
| extractTerms() | 5 | 0 |
| explain() | 5 | 0 |
| explainScam() offer validation | 5 | 0 |
| explainScam() rule validation | 5 | 0 |
| **Total** | **20** | **0** |

All 20 tests passed. These tests checked invalid inputs and did not require Gemini API calls.

This is a separate test run and overlaps with previously recorded validation tests. Do not add it to the earlier total.
## Updated Validation Run – 11 November 2026

- extractTerms invalid input tests: 5 passed
- explain invalid input tests: 5 passed
- explainScam invalid offer tests: 5 passed
- explainScam invalid rule tests: 5 passed

Total: 20 passed, 0 failed.

Note: These tests check input validation only. They do not call Gemini or verify real AI responses.

## Prepared AI Test Files – 11 November 2026

| Test file | Purpose | Status |
|---|---|---|
| src/test-extraction.js | Test 12 loan extraction examples (O1–O12) | Prepared – Pending |
| src/test-explanations.js | Test loan explanations in English, Telugu and Hindi | Prepared – Pending |
| src/test-scam-explanations.js | Test scam explanations and required disclaimer | Prepared – Pending |

Real Gemini tests have not yet been run because of API quota limitations.

The scam explanation test uses a sample rule result. It does not verify Person B's scam detection accuracy.

## Prepared AI Test Files – 11 November 2026

| Test file | Purpose | Status |
|---|---|---|
| src/test-extraction.js | Test 12 loan extraction examples (O1–O12) | Prepared – Pending Gemini quota |
| src/test-explanations.js | Test loan explanations in English, Telugu and Hindi | Prepared – Pending Gemini quota |
| src/test-scam-explanations.js | Test S1 scam explanation and required disclaimer | Prepared – Pending Gemini quota |

The scam explanation test uses a sample High-risk result. It does not verify Person B's scam detection accuracy.

Real Gemini tests are pending because of API quota limitations.