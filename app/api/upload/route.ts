import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured" },
        { status: 500 }
      );
    }

    // Convert file to base64 or forward as is
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureToSign).digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", base64Data);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Upload failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
