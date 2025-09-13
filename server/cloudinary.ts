import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer from multer
 * @param originalName - Original filename for better organization
 * @returns Promise with Cloudinary upload result
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
  folder: string = 'ecolearn/challenges'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      public_id: `${Date.now()}_${originalName.split('.')[0]}`,
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Limit max size
        { quality: 'auto:good' }, // Optimize quality
        { format: 'auto' } // Auto format selection
      ]
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        } else {
          reject(new Error('Unknown error during upload'));
        }
      }
    ).end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
}

export { cloudinary };