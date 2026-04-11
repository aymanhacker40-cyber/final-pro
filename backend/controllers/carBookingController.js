const CarBooking = require("../models/CarBooking");
const Car = require("../models/cars");
const CarAr = require("../models/carAr");

// ===================================
// CREATE CAR BOOKING (USER)
// ===================================
const createCarBooking = async (req, res) => {
  try {
    const {
      carId,
      pickupDateTime,
      dropoffDateTime,
      pickupLocation,
      dropoffLocation,
      privateDriver,
      lang = "en",
    } = req.body;

    // ✅ validation
    if (
      !carId ||
      !pickupDateTime ||
      !dropoffDateTime ||
      !pickupLocation ||
      !dropoffLocation
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const pickup = new Date(pickupDateTime);
    const dropoff = new Date(dropoffDateTime);

    if (dropoff <= pickup) {
      return res.status(400).json({
        message: "Invalid booking duration",
      });
    }

    // ✅ choose model
    let car;
    let carModel;

    if (lang === "ar") {
      car = await CarAr.findById(carId);
      carModel = "CarAr";
    } else {
      car = await Car.findById(carId);
      carModel = "Car";
    }

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // ✅ price calculation
    const totalDays = Math.ceil(
      (dropoff - pickup) / (1000 * 60 * 60 * 24)
    );

    const pricePerDay = car.pricePerDay;
    let totalPrice = totalDays * pricePerDay;

    let driverCost = 0;

    if (privateDriver) {
      driverCost = totalDays * 100;
      totalPrice += driverCost;
    }

    // ✅ create booking
    const booking = await CarBooking.create({
      user: req.user._id,

      // snapshot user data
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,

      car: car._id,
      carModel,
      carName: car.name,

      pickupDateTime: pickup,
      dropoffDateTime: dropoff,

      pickupLocation,
      dropoffLocation,

      totalDays,
      pricePerDay,
      driverCost,
      totalPrice,

      privateDriver: privateDriver || false,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================================
// GET ALL CAR BOOKINGS (ADMIN)
// ===================================
const getAllCarBookings = async (req, res) => {
  try {
    const bookings = await CarBooking.find()
      .populate("user", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCarBooking,
  getAllCarBookings,
};