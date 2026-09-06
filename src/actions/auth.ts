"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRole(role: "STUDENT" | "PARENT" | "TUTOR") {
  const session = await auth();
  
  if (!session?.user?.email) {
    return { success: false, error: "Not authenticated" };
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentRole = (session.user as any).role;
  
  // Do not allow changing role once set (except via admin)
  if (currentRole) {
    return { success: false, error: "Role already assigned" };
  }

  // Prevent users from setting themselves as ADMIN
  if (!["STUDENT", "PARENT", "TUTOR"].includes(role)) {
    return { success: false, error: "Invalid role selection" };
  }

  try {
    await db.update(users)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .set({ role })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .where(eq(users.id, (session.user as any).id));

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating role:", error);
    return { success: false, error: "Failed to update role" };
  }
}
