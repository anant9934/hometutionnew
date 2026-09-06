import { TutorBasicInfoSchema, TutorPricingSchema } from "@/lib/validation/tutor";

describe("Tutor Validation Logic", () => {
  describe("Basic Info Schema", () => {
    it("should validate correct basic info", () => {
      const data = {
        displayName: "John Doe",
        phone: "9876543210",
        gender: "MALE" as const
      };
      
      const result = TutorBasicInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should fail if name is too short", () => {
      const data = {
        displayName: "J",
        phone: "9876543210"
      };
      
      const result = TutorBasicInfoSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Pricing Schema", () => {
    it("should validate valid pricing", () => {
      const data = {
        hourlyRate: 200,
        monthlyStartingRate: 3000,
        trialPrice: 0
      };
      
      const result = TutorPricingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should fail if hourly rate is too low", () => {
      const data = {
        hourlyRate: 50,
        monthlyStartingRate: 3000,
        trialPrice: 0
      };
      
      const result = TutorPricingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
