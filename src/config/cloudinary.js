const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = (req, path) => {
  return new Promise((resolve, reject) => {
    if (!req?.file?.buffer) {
      reject({ message: "File not found" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: path },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  })
    .then((upload) => {
      return {
        result: upload,
        success: true,
      };
    })
    .catch((err) => {
      return {
        result: [err?.message || "Something goes wrong while uploading images"],
        success: false,
      };
    });
};

module.exports = { uploadFile };
