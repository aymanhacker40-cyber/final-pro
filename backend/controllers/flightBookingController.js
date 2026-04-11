const FlightBooking = require("../models/FlightBooking");

exports.createFlightBooking = async (req, res) => {
  try {

    const booking = new FlightBooking({
      ...req.body,
      user: req.user._id   // ✅ اربط الحجز بالمستخدم
    });

    await booking.save();

    res.status(201).json({
      message: "Flight booked successfully",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
