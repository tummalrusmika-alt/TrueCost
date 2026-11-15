
import { test, expect } from "vitest";

import { checkScamRules } from "./scamRules.js";

// Test 1: Normal loan message.
test("detects a normal loan message as low risk", () => {
  const result = checkScamRules(
    "Our bank offers personal loans. Please read the loan terms on our official website."
  );

  expect(result.riskLevel).toBe("Low");
  expect(result.redFlags).toEqual([]);
  expect(result.explanation).toBe("");
  expect(Array.isArray(result.nextSteps)).toBe(true);
});

// Test 2: Upfront payment request.
test("detects an upfront payment request", () => {
  const result = checkScamRules(
    "Pay the processing fee before your loan is approved."
  );

  expect(result.riskLevel).toBe("Medium");
  expect(result.redFlags.length).toBeGreaterThan(0);
});

// Test 3: Urgent payment with upfront fee.
test("detects high risk when upfront fee and urgency are present", () => {
  const result = checkScamRules(
    "Pay the processing fee immediately within 10 minutes to receive your loan."
  );

  expect(result.riskLevel).toBe("High");
  expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
  expect(result.nextSteps.length).toBeGreaterThan(0);
});

// Test 4: Empty message validation.
test("rejects an empty message", () => {
  expect(() => {
    checkScamRules("");
  }).toThrow(/Please provide a valid message/);
});

// Test 5: Rejects invalid input.
test("rejects non-string input", () => {
  expect(() => {
    checkScamRules(null);
  }).toThrow(/Please provide a valid message/);
});
