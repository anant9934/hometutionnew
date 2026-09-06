import { moneyToPaise, paiseToRupees, calculateCommission } from "../src/lib/utils/money";

describe("Money Utility Functions", () => {
  describe("moneyToPaise", () => {
    it("converts rupees to exact integer paise", () => {
      expect(moneyToPaise(100)).toBe(10000);
      expect(moneyToPaise(9.99)).toBe(999);
      expect(moneyToPaise(10.99)).toBe(1099); // Prevents 1098.9999999999998
    });

    it("throws on invalid inputs", () => {
      expect(() => moneyToPaise(NaN)).toThrow();
      expect(() => moneyToPaise(Infinity)).toThrow();
    });
  });

  describe("paiseToRupees", () => {
    it("converts exact integer paise to rupees", () => {
      expect(paiseToRupees(10000)).toBe(100);
      expect(paiseToRupees(999)).toBe(9.99);
    });

    it("throws if input is a float", () => {
      expect(() => paiseToRupees(10.5)).toThrow();
    });
  });

  describe("calculateCommission", () => {
    it("calculates exact 10% commission and tutor share", () => {
      const result = calculateCommission(10000); // 100 INR
      expect(result.commissionAmountPaise).toBe(1000); // 10 INR
      expect(result.tutorAmountPaise).toBe(9000); // 90 INR
      expect(result.commissionAmountPaise + result.tutorAmountPaise).toBe(10000);
    });

    it("rounds commission to nearest paise correctly", () => {
      const result = calculateCommission(1005); // 10.05 INR
      // 10% of 1005 = 100.5 -> Math.round -> 101 paise
      expect(result.commissionAmountPaise).toBe(101); // 1.01 INR
      expect(result.tutorAmountPaise).toBe(904); // 9.04 INR
      expect(result.commissionAmountPaise + result.tutorAmountPaise).toBe(1005);
    });
  });
});
