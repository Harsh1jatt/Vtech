import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary configuration is incomplete.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export async function uploadToCloudinary(
  fileBuffer,
  {
    folder = "vtech",
    resourceType = "image",
    publicId,
    originalName,
  } = {}
) {
  if (!fileBuffer) {
    throw new Error("File buffer is required.");
  }

  const client = configureCloudinary();

  const result = await new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      unique_filename: true,
    };

    if (originalName) {
      uploadOptions.filename_override = originalName;
      uploadOptions.use_filename = true;
    }

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    const uploadStream = client.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format || null,
    resourceType: result.resource_type,
    width: result.width || null,
    height: result.height || null,
  };
}

export async function deleteFromCloudinary(
  publicId,
  resourceType = "image"
) {
  if (!publicId) {
    return null;
  }

  const client = configureCloudinary();

  return client.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export default cloudinary;