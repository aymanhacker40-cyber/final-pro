const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight");

router.get("/", async (req, res) => {
  try {
    const { from, to, luggage, tripType } = req.query;

    let filter = {};

    if (from) filter.fromCity = from;
    if (to) filter.toCity = to;
    if (tripType) filter.tripType = tripType;
    if (luggage === "true") filter.hasLuggage = true;

    const flights = await Flight.find(filter);

    res.json(flights); // نشيل الفورمات خالص
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;