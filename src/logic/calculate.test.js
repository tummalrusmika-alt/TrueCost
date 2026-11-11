
import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateLoan } from "./calculate.js";

test("calculates a zero-interest loan correctly", () => {
  const result = calculateLoan(
    {
      amount: 12000,
      tenureMonths: 12,
      annualRatePercent: 0,
      processingFee: 0,
      gstOnFeesPercent: 18,
      otherCharges: 0
    },
    {
      monthlyIncome: 30000,
      monthlyExpenses: 10000
    }
  );

  assert.equal(result.emi, 1000);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.fees, 0);
  assert.equal(result.gstAmount, 0);
  assert.equal(result.totalPaid, 12000);
  assert.equal(result.moneyReceived, 12000);
  assert.equal(result.verdict, "Good");
});

test("rejects an invalid loan amount", () => {
  assert.throws(() => {
    calculateLoan(
      {
        amount: -1000,
        tenureMonths: 12,
        annualRatePercent: 10,
        processingFee: 0
      },
      {
        monthlyIncome: 30000,
        monthlyExpenses: 10000
      }
    );
  }, /Loan amount must be above 0/);
});

test("rejects invalid tenure", () => {
  assert.throws(() => {
    calculateLoan(
      {
        amount: 10000,
        tenureMonths: 0,
        annualRatePercent: 10,
        processingFee: 0
      },
      {
        monthlyIncome: 30000,
        monthlyExpenses: 10000
      }
    );
  }, /Tenure must be a positive whole number/);
});
