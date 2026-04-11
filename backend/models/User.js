const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {type: Boolean, default: false},
    isAdmin: { type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
