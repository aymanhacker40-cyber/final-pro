const mongoose = require("mongoose");

const carBookingSchema = new mongoose.Schema(
  {
    user: {
      
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,

    // ✅ يقبل Car أو CarAr
    car: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "carModel",
    },

    // ✅ يحدد أنهي collection
    carModel: {
      type: String,
      required: true,
      enum: ["Car", "CarAr"],
    },

    carName: {
      type: String,
      required: true,
    },

    pickupDateTime: {
      type: Date,
      required: true,
    },

    dropoffDateTime: {
      type: Date,
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropoffLocation: {
      type: String,
      required: true,
    },

    totalDays: Number,
    pricePerDay: Number,
    driverCost: Number,
    totalPrice: Number,

    privateDriver: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarBooking", carBookingSchema);
