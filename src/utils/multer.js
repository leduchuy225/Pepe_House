const multer = require("multer");
const { failureRes } = require("../config/response");
const { LIMIT_SIZE } = require("../config/const");

const validateFile = (req, res, next) => {
  const fileUpload = multer({
    fileFilter: fileFilter,
    limits: { fileSize: LIMIT_SIZE },
  }).array("file");

  fileUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return failureRes(
        req,
        res
      )([err?.message || "Something goes wrong while uploading images"]);
    } else if (err) {
      return failureRes(req, res)([err]);
    }

    next();
  });
};

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback("Unsupported file format", false);
  }
};

module.exports = { validateFile };
