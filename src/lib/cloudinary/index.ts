import { v2 as cloudinary } from "cloudinary";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

// Configure Cloudinary globally
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const CloudinaryService = {
  /**
   * Server-side upload function for private documents.
   * This uses an in-memory stream to avoid writing files to disk.
   */
  async uploadPrivateDocument(fileBuffer: Buffer, folder: string): Promise<CloudinaryUploadResult> {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Missing Cloudinary credentials. Cannot upload.");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload failed:", error);
            reject(new Error("Cloudinary upload failed"));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Optional: Safely delete a document
   */
  async deleteDocument(publicId: string): Promise<void> {
    if (!process.env.CLOUDINARY_API_SECRET) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.error("Failed to delete from Cloudinary:", e);
    }
  }
};
