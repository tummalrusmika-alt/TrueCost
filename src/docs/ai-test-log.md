
# TrueCost AI Test Log

**Owner:** Person C  
**AI service:** Firebase AI Logic  
**Status:** Testing pending because of Gemini daily quota limit.

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

Test explain() using Person B's calculation results T1–T7.

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

Test explainScam() using all 12 scam messages and Person B's rule results.

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

Check that the explanation never contradicts the risk level and never claims certainty.

## 4. Failure tests

| Test | Expected behaviour | Status |
|---|---|---|
| Wrong model name | Friendly error response | Pending |
| Offline connection | Friendly error response | Pending |
| Empty text | Friendly error response | Pending |
| 3001 characters | Friendly error response | Pending |
| Unsupported language | Friendly error response | Pending |
| Gemini quota exceeded | Friendly error response | Pending |

## 5. Test notes

- Do not mark a test as passed without actually testing it.
- Record errors and fixes.
- Compare all three extraction runs.
- Check prompt-injection protection using O9.
- Check that the application works without AI.

**Current result:** Testing has not been completed.