import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;
  
  if (!role) {
    redirect("/role-selection");
  }
  
  if (!allowedRoles.includes(role)) {
    // If they have a role but it's not authorized for this route
    if (role === "TUTOR") redirect("/tutor-dashboard");
    if (role === "STUDENT" || role === "PARENT") redirect("/dashboard");
    if (role === "ADMIN") redirect("/admin");
    redirect("/");
  }
  
  return session;
}

export async function requireTutor() {
  return requireRole(["TUTOR"]);
}

export async function requireStudentOrParent() {
  return requireRole(["STUDENT", "PARENT"]);
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}
