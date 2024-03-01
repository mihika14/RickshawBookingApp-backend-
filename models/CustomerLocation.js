const mongoose = require("mongoose");

const CustomerLocationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    Timing: {
      type: String,
      required: true,
    },
  },
  {
    collection: "LocationCustomer",
  }
);

module.exports = mongoose.model("LocationCustomer", CustomerLocationSchema);
