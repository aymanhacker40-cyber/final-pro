const CarBooking = require("../models/CarBooking");
const Booking = require("../models/Booking");
const FlightBooking = require("../models/FlightBooking"); // ✅ ضيف ده

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const carBookings = await CarBooking
      .find({ user: userId })
      .sort({ createdAt: -1 });

    const hotelBookings = await Booking
      .find({ user: userId })
      .sort({ createdAt: -1 });

    const flightBookings = await FlightBooking   // ✅ ضيف ده
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({
      carBookings,
      hotelBookings,
      flightBookings // ✅ رجعهم هنا
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
