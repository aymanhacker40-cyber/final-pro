const Booking = require("../models/Booking");

// جلب بيانات الحجز لنزيل معين حسب البريد الإلكتروني
exports.getGuestBooking = async (req, res) => {
  const email = req.params.email;
  try {
    const booking = await Booking.findOne({ "guests.email": email });
    if (!booking) return res.status(404).json({ message: "لا يوجد حجز لهذا النزيل" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تحديث بيانات النزيل
exports.updateGuestBooking = async (req, res) => {
  const email = req.params.email;
  const { guestData, checkInDate, checkOutDate, numRooms, numPeople } = req.body;

  try {
    const booking = await Booking.findOne({ "guests.email": email });
    if (!booking) return res.status(404).json({ message: "لا يوجد حجز لهذا النزيل" });

    // تحديث بيانات النزيل داخل المصفوفة
    booking.guests = booking.guests.map(g => g.email === email ? { ...g.toObject(), ...guestData } : g);

    // تحديث بيانات الحجز العامة
    if (checkInDate) booking.checkInDate = checkInDate;
    if (checkOutDate) booking.checkOutDate = checkOutDate;
    if (numRooms) booking.numRooms = numRooms;
    if (numPeople) booking.numPeople = numPeople;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
