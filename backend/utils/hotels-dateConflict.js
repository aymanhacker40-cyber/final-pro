const Booking = require("../models/Booking");

const hasConflict = async (
  hotelName,
  checkInDate,
  checkOutDate,
  bookingId = null
) => {
  const query = {
    hotelName,
    checkInDate: { $lt: new Date(checkOutDate) },
    checkOutDate: { $gt: new Date(checkInDate) }
  };

  if (bookingId) {
    query._id = { $ne: bookingId };
  }

  return await Booking.findOne(query);
};

module.exports = hasConflict;
