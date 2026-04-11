const express = require("express");
const router = express.Router();
const FlightBooking = require("../models/FlightBooking");
const protect = require("../middleware/authMiddleware"); // ✅ ضيف ده


// router.get("/admin", (req, res) => {
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).send("Forbidden");
//   }

//   res.send("Welcome Admin");
// });




const {
  createFlightBooking,
} = require("../controllers/flightBookingController");


// ===============================
// Create booking (User must login)
// ===============================
router.post("/", protect, createFlightBooking);


// ===============================
// Get MY bookings (for logged user)
// ===============================
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await FlightBooking
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// Get all bookings (Admin only)
// ===============================
router.get("/", async (req, res) => {
  try {
    const bookings = await FlightBooking
      .find()
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// Confirm booking
// ===============================
router.put("/:id/confirm", async (req, res) => {
  try {
    const booking = await FlightBooking.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { returnDocument: "after" }
    );

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// Delete booking
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await FlightBooking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
