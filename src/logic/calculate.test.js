
import { test, expect } from "vitest";
import { calculateLoan, compareLoanOffers } from "./calculate.js";

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

  expect(result.emi).toBe(1000);
  expect(result.totalInterest).toBe(0);
  expect(result.fees).toBe(0);
  expect(result.gstAmount).toBe(0);
  expect(result.totalPaid).toBe(12000);
  expect(result.moneyReceived).toBe(12000);
  expect(result.verdict).toBe("Good");
});

test("rejects invalid loan amount", () => {
  expect(() => {
    calculateLoan(
      {
        amount: 0,
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
  }).toThrow(/Loan amount must be above 0/);
});

test("rejects invalid tenure", () => {
  expect(() => {
    calculateLoan(
      {
        amount: 12000,
        tenureMonths: 0,
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
  }).toThrow(/Tenure must be a positive whole number/);
});

test("calculates a loan with an odd tenure correctly", () => {
  const result = calculateLoan(
    {
      amount: 12000,
      tenureMonths: 7,
      annualRatePercent: 12,
      processingFee: 0,
      gstOnFeesPercent: 18,
      otherCharges: 0
    },
    {
      monthlyIncome: 30000,
      monthlyExpenses: 10000
    }
  );

  expect(result.emi).toBeGreaterThan(0);
  expect(Number.isFinite(result.emi)).toBe(true);
  expect(result.totalPaid).toBeGreaterThan(12000);
});

test("rejects missing loan inputs", () => {
  expect(() => {
    calculateLoan(null, null);
  }).toThrow(/Loan terms and affordability inputs are required/);
});

test("returns Avoid when no money is left after expenses", () => {
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
      monthlyIncome: 20000,
      monthlyExpenses: 20000
    }
  );

  expect(result.verdict).toBe("Avoid");
  expect(result.moneyLeft).toBe(0);
  expect(result.emiShareOfLeftPercent).toBe(null);
});

test("calculates GST on processing fee correctly", () => {
  const result = calculateLoan(
    {
      amount: 50000,
      tenureMonths: 12,
      annualRatePercent: 0,
      processingFee: 1000,
      gstOnFeesPercent: 18,
      otherCharges: 0
    },
    {
      monthlyIncome: 30000,
      monthlyExpenses: 10000
    }
  );

  expect(result.fees).toBe(1000);
  expect(result.gstAmount).toBe(180);
  expect(result.hiddenExtra).toBe(1180);
  expect(result.moneyReceived).toBe(48820);
});

test("identifies the cheaper loan offer", () => {
  const offerA = {
    amount: 50000,
    tenureMonths: 12,
    annualRatePercent: 10,
    processingFee: 1000,
    gstOnFeesPercent: 18,
    otherCharges: 0
  };

  const offerB = {
    amount: 50000,
    tenureMonths: 12,
    annualRatePercent: 12,
    processingFee: 1000,
    gstOnFeesPercent: 18,
    otherCharges: 0
  };

  const result = compareLoanOffers(
    offerA,
    offerB,
    { monthlyIncome: 30000, monthlyExpenses: 10000 }
  );

  expect(result.betterOffer).toBe("Offer A");
  expect(result.savings).toBeGreaterThan(0);
});

test("identifies equal-cost loan offers", () => {
  const offer = {
    amount: 50000,
    tenureMonths: 12,
    annualRatePercent: 10,
    processingFee: 1000,
    gstOnFeesPercent: 18,
    otherCharges: 0
  };

  const result = compareLoanOffers(
    offer,
    { ...offer },
    { monthlyIncome: 30000, monthlyExpenses: 10000 }
  );

  expect(result.betterOffer).toBe(
    "Both offers have equal total costs"
  );
  expect(result.savings).toBe(0);
});

