const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ نتأكد إن فيه Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ ناخد التوكن
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ نفك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ نجيب اليوزر من الداتا بيز
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      // 5️⃣ نعدي على الـ controller
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // لو مفيش توكن
  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = protect;
