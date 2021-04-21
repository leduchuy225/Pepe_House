const multer = require("multer");
const { fileFilter } = require("../config/helper");
const { failureRes } = require("./response");
const { LIMIT_SIZE } = require("./const");

const validateFile = (req, res, next) => {
  const fileUpload = multer({
    fileFilter: fileFilter,
    limits: { fileSize: LIMIT_SIZE },
  }).single("file");

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

module.exports = { validateFile };
