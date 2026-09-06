import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only TUTORs can upload profile/verification documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "TUTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { folder } = body;

    // Restrict folders to prevent arbitrary uploads
    const allowedFolders = ["bodh/public/tutors", "bodh/private/verification"];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const timestamp = Math.round((new Date()).getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      console.error("Cloudinary secret missing");
      return NextResponse.json({ error: "Internal Configuration Error" }, { status: 500 });
    }

    // Generate Cloudinary Signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
