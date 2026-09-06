"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveTutor, rejectTutor } from "@/actions/admin";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function TutorReviewActions({ tutorId, status }: { tutorId: string; status: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve and publish this tutor?")) return;
    setIsLoading(true);
    await approveTutor(tutorId);
    setIsLoading(false);
    router.refresh();
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setIsLoading(true);
    await rejectTutor(tutorId, reason);
    setIsLoading(false);
    router.refresh();
  };

  if (status === "VERIFIED") {
    return <div className="text-green-600 font-medium">This tutor is currently VERIFIED and Live.</div>;
  }

  if (status === "REJECTED") {
    return <div className="text-red-600 font-medium">This tutor was REJECTED.</div>;
  }

  return (
    <div className="flex gap-4">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        className={cn(buttonVariants.primary)}
      >
        Approve & Publish
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        className={cn(buttonVariants.outline, "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200")}
      >
        Reject
      </button>
    </div>
  );
}
