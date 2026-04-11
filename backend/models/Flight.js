const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: String,
  fromCity: String,
  toCity: String,
  fromCode: String,
  toCode: String,
  departDate: Date,
  returnDate: Date,   // أضفناها
  departTime: String,
  arrivalTime: String,
  returnTime: String, // أضفناها
  duration: String,
  stops: String,
  flightClass: String,
  price: Number,
  currency: String,
  hasLuggage: Boolean,
  tripType: {
    type: String,
    enum: ["oneway", "roundtrip"],
  },
});

module.exports = mongoose.model("Flight", flightSchema);
