const { Schema, model } = require("mongoose");

const CityType = new Schema({});

module.exports = model("City", CityType);
