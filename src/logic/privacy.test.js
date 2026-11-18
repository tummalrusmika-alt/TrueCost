import { test, expect } from "vitest";
import { redactSensitive } from "./privacy.js";

test("hides an OTP code", () => {
  const result = redactSensitive("Your OTP is 482913. Share it now.");
  expect(result.text).not.toContain("482913");
  expect(result.changed).toBe(true);
});

test("hides phone numbers, with and without +91", () => {
  const result = redactSensitive("Call 9876543210 or +91 98765 43210");
  expect(result.text).not.toMatch(/9876543210/);
  expect(result.text).not.toMatch(/98765 43210/);
});

test("hides card, Aadhaar and PAN numbers", () => {
  const result = redactSensitive(
    "Card 4111 1111 1111 1111, Aadhaar 1234 5678 9012, PAN ABCDE1234F"
  );
  expect(result.text).not.toMatch(/4111/);
  expect(result.text).not.toMatch(/1234 5678 9012/);
  expect(result.text).not.toMatch(/ABCDE1234F/);
});

test("keeps loan amounts and links", () => {
  const result = redactSensitive(
    "Your loan of Rs 50,000 is approved. Pay Rs 1,500 at bit.ly/loan-now"
  );
  expect(result.text).toContain("Rs 50,000");
  expect(result.text).toContain("Rs 1,500");
  expect(result.text).toContain("bit.ly/loan-now");
  expect(result.changed).toBe(false);
});