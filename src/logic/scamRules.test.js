
import { test } from "node:test";
import assert from "node:assert/strict";

import { checkScamRules } from "./scamRules.js";

// Test 1: Normal loan message.
test("detects a normal loan message as low risk", () => {
  const result = checkScamRules(
    "Our bank offers personal loans. Please read the loan terms on our official website."
  );

  assert.equal(result.riskLevel, "Low");
  assert.deepEqual(result.redFlags, []);
  assert.equal(result.explanation, "");
  assert.ok(Array.isArray(result.nextSteps));
});

// Test 2: Upfront payment request.
test("detects an upfront payment request", () => {
  const result = checkScamRules(
    "Pay the processing fee before your loan is approved."
  );

  assert.equal(result.riskLevel, "Medium");
  assert.ok(result.redFlags.length > 0);
});

// Test 3: Urgent payment with upfront fee.
test("detects high risk when upfront fee and urgency are present", () => {
  const result = checkScamRules(
    "Pay the processing fee immediately within 10 minutes to receive your loan."
  );

  assert.equal(result.riskLevel, "High");
  assert.ok(result.redFlags.length >= 2);
  assert.ok(result.nextSteps.length > 0);
});

// Test 4: Empty message validation.
test("rejects an empty message", () => {
  assert.throws(() => {
    checkScamRules("");
  }, /Please provide a valid message/);
});

// Test 5: Rejects invalid input.
test("rejects non-string input", () => {
  assert.throws(() => {
    checkScamRules(null);
  }, /Please provide a valid message/);
});
