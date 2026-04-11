const express = require("express");
const router = express.Router();
const Car = require("../models/cars");
const CarAr = require("../models/carAr");

router.get("/", async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    let cars;

    if (lang === "ar") {
      cars = await CarAr.find({ isAvailable: true });
    } else {
      cars = await Car.find({ isAvailable: true });
    }

    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
