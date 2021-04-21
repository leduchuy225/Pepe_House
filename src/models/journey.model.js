const { Schema, model } = require("mongoose");

const JourneyType = new Schema({});

module.exports = model("Journey", JourneyType);
