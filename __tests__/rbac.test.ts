import { requireRole } from "@/lib/auth/authorization";

// Mock the auth module since it uses server-only APIs
jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn()
}));

const { auth } = require("@/lib/auth/auth");
const { redirect } = require("next/navigation");

jest.mock("next/navigation", () => ({
  redirect: jest.fn()
}));

describe("RBAC Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access if role matches", async () => {
    auth.mockResolvedValueOnce({
      user: { id: "1", role: "TUTOR" }
    });

    const session = await requireRole(["TUTOR", "ADMIN"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((session?.user as any)?.role).toBe("TUTOR");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect to role-selection if no role is set", async () => {
    auth.mockResolvedValueOnce({
      user: { id: "1" } // No role
    });

    await requireRole(["TUTOR"]);
    expect(redirect).toHaveBeenCalledWith("/role-selection");
  });

  it("should redirect to appropriate dashboard if role is not authorized", async () => {
    auth.mockResolvedValueOnce({
      user: { id: "1", role: "STUDENT" }
    });

    await requireRole(["ADMIN"]);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
