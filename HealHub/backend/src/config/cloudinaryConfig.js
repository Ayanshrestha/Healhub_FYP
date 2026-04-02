import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a buffer to Cloudinary
 * @param {Buffer} buffer - The file buffer from multer (memoryStorage)
 * @param {string} folder - Destination folder on Cloudinary (e.g., 'registrations')
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, folder = "others") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `healhub/${folder}`,
        resource_type: "auto", // Automatically detect if it's an image or PDF (raw)
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
