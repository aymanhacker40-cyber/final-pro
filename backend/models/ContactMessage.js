const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
