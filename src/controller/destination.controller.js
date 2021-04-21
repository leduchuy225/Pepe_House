const { validateDestination } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../config/cloudinary");
const Destionation = require("../models/destination.model");
const { isValidID } = require("../config/helper");

module.exports.getDestinationById = async (req, res) => {
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }
  const destination = await Destionation.findById(id).populate(
    "author",
    "displayName"
  );
  if (!destination) {
    return failureRes(req, res)(["Destionation not found"]);
  }
  return successRes(req, res)(destination);
};

module.exports.createDestination = async (req, res) => {
  const { _id } = req.user;
  const { name, address, description, coordinates, tags } = req.body;
  const { errors, valid } = validateDestination(
    name,
    address,
    description,
    coordinates,
    tags
  );
  if (!valid) {
    return failureRes(req, res)(errors);
  }

  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  console.log("Upload images successfully");

  const { url } = result;
  const destination = new Destionation({
    name,
    address,
    description,
    images: [url],
    coordinates,
    author: _id,
    tags,
  });

  /* const destination = new Destionation({
    name,
    address,
    description,
    coordinates,
    author: _id,
    tags,
  });
 */
  try {
    await destination.save();
    return successRes(req, res)(destination);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.deleteDestionation = async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  try {
    const delDestination = await Destionation.deleteOne({
      _id: id,
      author: _id,
    });
    if (!delDestination.deletedCount) {
      return failureRes(req, res)(["Destionation not found"]);
    }
    return successRes(req, res)("Delete destionation successfully");
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};
