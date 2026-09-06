"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveTutorDraft, submitTutorVerification } from "@/actions/tutor";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function TutorOnboardingFunnel() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified state for this demonstration
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    gender: "MALE",
    headline: "",
    bio: "",
    qualification: "",
    experienceYears: 0,
    city: "Patna",
    pincode: "",
    hourlyRate: 200,
    monthlyStartingRate: 3000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    setError(null);
    
    // Determine which step payload to send
    let stepName = "";
    let payload = {};
    
    if (step === 1) {
      stepName = "basic";
      payload = { displayName: formData.displayName, phone: formData.phone, gender: formData.gender };
    } else if (step === 2) {
      stepName = "about";
      payload = { headline: formData.headline, bio: formData.bio };
    } else if (step === 3) {
      stepName = "qualification";
      payload = { qualification: formData.qualification, experienceYears: Number(formData.experienceYears) };
    } else if (step === 4) {
      stepName = "location";
      payload = { city: formData.city, pincode: formData.pincode };
    } else if (step === 5) {
      stepName = "pricing";
      payload = { hourlyRate: Number(formData.hourlyRate), monthlyStartingRate: Number(formData.monthlyStartingRate), trialPrice: 0 };
    }

    const res = await saveTutorDraft(stepName, payload);
    
    setIsSubmitting(false);

    if (res.success) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        // Final submit
        const finalRes = await submitTutorVerification();
        if (finalRes.success) {
          router.push("/tutor-dashboard");
        } else {
          setError(finalRes.error || "Failed to submit verification.");
        }
      }
    } else {
      setError(res.error || "Validation failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-[var(--background)] rounded-[var(--radius-card)] border border-[var(--accent-border)] shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-serif mb-2">Tutor Application</h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={cn("h-2 flex-1 rounded-full", s <= step ? "bg-[var(--accent)]" : "bg-[var(--accent-light)]")} />
          ))}
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      <div className="space-y-6">
        {step === 1 && (
          <>
            <h2 className="text-xl font-medium">Personal Information</h2>
            <input name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 rounded-md border" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 rounded-md border" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 rounded-md border bg-transparent">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2 text-[var(--foreground-secondary)]">Verification Document / Profile Photo (Required)</h3>
              <input 
                type="file" 
                accept="image/jpeg,image/png,application/pdf"
                onChange={async (e) => {
                  if (!e.target.files || !e.target.files[0]) return;
                  const file = e.target.files[0];
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File size exceeds 5MB.");
                    return;
                  }
                  
                  setIsSubmitting(true);
                  setError(null);
                  try {
                    const fd = new FormData();
                    fd.append("file", file);
                    // The action is imported below, but since it's a server action, it should be in the file scope.
                    const { uploadTutorDocument } = await import("@/actions/tutor");
                    const res = await uploadTutorDocument(fd);
                    
                    if (res.success) {
                      // Note: usually we'd save this to local state, but the server action saves it directly to DB
                      alert("Document uploaded securely!");
                    } else {
                      setError(res.error || "Upload failed");
                    }
                  } catch (err) {
                    setError("Upload exception occurred.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-[var(--foreground-secondary)] mt-2">Max 5MB (JPG, PNG, PDF). Uploads are secured on the server.</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-medium">About You</h2>
            <input name="headline" value={formData.headline} onChange={handleChange} placeholder="Headline (e.g. Patient Maths Tutor for Class 10)" className="w-full p-3 rounded-md border" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio (min 50 characters)" className="w-full p-3 rounded-md border h-32" />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-medium">Education & Qualification</h2>
            <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Highest Qualification (e.g. B.Tech)" className="w-full p-3 rounded-md border" />
            <input name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} placeholder="Years of Experience" className="w-full p-3 rounded-md border" />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-medium">Location</h2>
            <input name="city" value={formData.city} readOnly className="w-full p-3 rounded-md border bg-[var(--background-alt)]" />
            <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode (e.g. 800001)" className="w-full p-3 rounded-md border" />
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-medium">Pricing</h2>
            <label className="block text-sm text-[var(--foreground-secondary)]">Hourly Rate (₹)</label>
            <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleChange} className="w-full p-3 rounded-md border mb-4" />
            
            <label className="block text-sm text-[var(--foreground-secondary)]">Monthly Starting Rate (₹)</label>
            <input name="monthlyStartingRate" type="number" value={formData.monthlyStartingRate} onChange={handleChange} className="w-full p-3 rounded-md border" />
          </>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--accent-border)]">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm text-[var(--foreground-secondary)]">
              Back
            </button>
          ) : <div></div>}
          
          <button 
            onClick={handleNext} 
            disabled={isSubmitting}
            className={cn(buttonVariants.primary, "px-6 py-2 rounded-full")}
          >
            {isSubmitting ? "Saving..." : step === 5 ? "Submit Application" : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
