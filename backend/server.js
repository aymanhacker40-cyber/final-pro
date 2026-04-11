const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const carRoutes = require("./routes/carRoutes");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // السماح لو مفيش origin (زي mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://mern-frontend-rouge-five.vercel.app"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // 👈 نخليه يسمح مؤقتًا
    }
  },
  credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running"
  });
});


// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Hotels / Cars routes
app.use("/api/hotels", require("./routes/hotels-routes"));
// Car Booking routes
app.use("/api/car-bookings", require("./routes/carBookingRoutes"));
// Contact routes
app.use("/api", require("./routes/contactRoutes"));

app.use("/api/cars", carRoutes);
app.use("/api/carsar", carRoutes);
app.use("/api/flights", require("./routes/flights"));
app.use("/api/flight-bookings", require("./routes/flightBookingRoutes"));
app.use("/api/my-bookings", require("./routes/myBookingRoutes"));

// app.get("/", (req, res) => {
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).send("Forbidden");
//   }

//   res.send("Welcome Admin");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
