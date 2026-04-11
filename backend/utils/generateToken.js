const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id }, // 👈 أهم سطر في الموضوع كله
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
