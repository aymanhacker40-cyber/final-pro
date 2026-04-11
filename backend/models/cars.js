const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    seats: Number,
    bags: Number,
    transmission: String,
    fuel: String,

    image: String,

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
