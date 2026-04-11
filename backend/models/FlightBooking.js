const mongoose = require("mongoose");

const flightBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Flight Details
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    tripType: { type: String, required: true },

    // Passenger Details
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    passportNumber: { type: String, required: true },
    passportExpiry: { type: Date, required: true },

    // Contact Info
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // ✅ ADD THIS
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true } // ✅ أفضل من createdAt اليدوي
);

module.exports = mongoose.model("FlightBooking", flightBookingSchema);
