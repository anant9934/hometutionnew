import * as z from "zod";

export const TutorBasicInfoSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: z.string().min(10, "Valid phone number required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const TutorAboutSchema = z.object({
  headline: z.string().min(10, "Headline must be descriptive (e.g. 'Patient Maths Tutor for Class 10')").max(100),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000),
  teachingApproach: z.string().optional(),
});

export const TutorQualificationSchema = z.object({
  qualification: z.string().min(2, "Qualification is required (e.g. 'B.Tech')"),
  qualificationDetails: z.string().optional(),
  experienceYears: z.coerce.number().min(0, "Experience must be 0 or more"),
});

export const TutorLocationSchema = z.object({
  city: z.string().default("Patna"),
  pincode: z.string().min(6, "Valid 6-digit Pincode").max(6),
});

export const TutorPricingSchema = z.object({
  hourlyRate: z.coerce.number().min(100, "Minimum hourly rate is ₹100").optional(),
  monthlyStartingRate: z.coerce.number().min(500, "Minimum monthly rate is ₹500").optional(),
  trialPrice: z.coerce.number().min(0).default(0),
});

// A combined schema for final validation
export const TutorProfileCompleteSchema = TutorBasicInfoSchema
  .merge(TutorAboutSchema)
  .merge(TutorQualificationSchema)
  .merge(TutorLocationSchema)
  .merge(TutorPricingSchema);
