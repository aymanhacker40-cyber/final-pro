const mongoose = require("mongoose");

const carArSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // تأكد من أن اسم العربية بالعربي موجود
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

module.exports = mongoose.model("CarAr", carArSchema);
