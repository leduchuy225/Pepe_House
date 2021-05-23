const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadFile = (req, path) => {
  return new Promise(async (resolve, reject) => {
    let imageURL = [];
    if (!req.files?.length) {
      return resolve(imageURL);
    }

    let stream;

    for (let i = 0; i < req.files.length; i++) {
      stream = cloudinary.uploader.upload_stream(
        { folder: path },
        (error, result) => {
          if (result) {
            imageURL.push(result.url);
            if (imageURL.length === req.files.length) return resolve(imageURL);
          } else return reject(error);
        }
      );

      await streamifier.createReadStream(req.files[i].buffer).pipe(stream);
    }
  })
    .then((upload) => {
      console.log("Upload images successfully");
      return {
        result: upload,
        success: true,
      };
    })
    .catch((err) => {
      console.log("Fail to upload images");
      return {
        result: [err?.message || "Something goes wrong while uploading images"],
        success: false,
      };
    });
};
