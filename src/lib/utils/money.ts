/**
 * BODH Tuition - Financial Utility
 * 
 * Rules:
 * - NEVER use floating point for monetary storage.
 * - ALL money is stored as exact integers (paise).
 * - 1 INR = 100 Paise.
 * - Commission is calculated using basis points (1000 bps = 10%).
 */

export const PLATFORM_COMMISSION_BPS = 1000; // 10%

/**
 * Converts INR (e.g. from user input) to Paise.
 * Uses Math.round to prevent floating point inaccuracies like 10.99 * 100 = 1098.9999999999998
 */
export function moneyToPaise(rupees: number): number {
  if (isNaN(rupees) || !isFinite(rupees)) {
    throw new Error("Invalid monetary amount");
  }
  return Math.round(rupees * 100);
}

/**
 * Converts Paise to INR for display purposes.
 */
export function paiseToRupees(paise: number): number {
  if (!Number.isInteger(paise)) {
    throw new Error("Paise must be an exact integer");
  }
  return paise / 100;
}

/**
 * Formats Paise into a display string (e.g., ₹3,000)
 */
export function formatPaise(paise: number): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(rupees);
}

/**
 * Calculates commission deterministically.
 * Formula: (grossAmount * commissionBps) / 10000
 * We use Math.floor to ensure we don't overcharge, or Math.round based on policy.
 * Here we'll use Math.round to nearest paise.
 */
export function calculateCommission(grossAmountPaise: number, commissionBps: number = PLATFORM_COMMISSION_BPS): {
  commissionAmountPaise: number;
  tutorAmountPaise: number;
} {
  if (!Number.isInteger(grossAmountPaise)) {
    throw new Error("Gross amount must be an exact integer");
  }
  
  const commissionAmountPaise = Math.round((grossAmountPaise * commissionBps) / 10000);
  const tutorAmountPaise = grossAmountPaise - commissionAmountPaise;

  return {
    commissionAmountPaise,
    tutorAmountPaise
  };
}
