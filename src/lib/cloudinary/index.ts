// Phase 1: Service Abstraction Foundation
// Real implementation requires cloudinary SDK in Phase 2

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const CloudinaryService = {
  /**
   * Generates a signed signature for secure client-side uploads.
   * MUST NOT expose API Secret to client.
   */
  async generateSignature(): Promise<{ timestamp: number; signature: string }> {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Missing Cloudinary credentials");
    }
    // Implementation deferred to Phase 2
    return { timestamp: Math.round(new Date().getTime() / 1000), signature: "mock-signature" };
  },

  /**
   * Server-side upload function for private documents.
   */
  async uploadPrivateDocument(fileBuffer: Buffer, folder: string): Promise<CloudinaryUploadResult> {
    // Implementation deferred to Phase 2
    console.log(`Mock uploading to ${folder}`);
    return {
      url: "https://res.cloudinary.com/mock/image/upload/v1/mock.jpg",
      publicId: "mock-id"
    };
  }
};
