const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMyBookings } = require("../controllers/myBookingController");

router.get("/", protect, getMyBookings);

module.exports = router;