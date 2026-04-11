const express = require("express");
const router = express.Router();

const {
  createCarBooking,
  getAllCarBookings,
} = require("../controllers/carBookingController");

const protect = require("../middleware/authMiddleware");
const CarBooking = require("../models/CarBooking");

// ===================================
// USER → Create Booking
// ===================================
router.post("/", protect, createCarBooking);

// ===================================
// ADMIN → Get All Bookings
// ===================================
router.get("/", protect, getAllCarBookings);
// ======================
// Confirm Booking
// ======================
router.put("/:id/confirm", async (req, res) => {
  try {
    const booking = await CarBooking.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// Delete Booking
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const booking = await CarBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;