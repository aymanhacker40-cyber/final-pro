const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const protect = require("../middleware/authMiddleware");
// =====================
// CREATE BOOKING
// =====================
router.post("/", protect, async (req, res) => {
  try {
    const data = req.body;

    if (data.guests && !Array.isArray(data.guests)) {
      data.guests = [data.guests];
    }

    if (!data.guests || data.guests.length === 0) {
      return res.status(400).json({
        message: "بيانات النزيل مطلوبة"
      });
    }

    const booking = await Booking.create({
      ...data,
      user: req.user._id   // 🔥 أهم سطر
    });

    res.status(201).json({
      message: "تم الحجز بنجاح",
      booking
    });

  } catch (error) {
    res.status(400).json({
      message: "فشل إنشاء الحجز",
      error: error.message
    });
  }
});

// =====================
// GET ALL BOOKINGS (ADMIN)
// =====================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =====================
// CONFIRM BOOKING
// =====================
router.put("/:id/confirm", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
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

// =====================
// DELETE BOOKING
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;