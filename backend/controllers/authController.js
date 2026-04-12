const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { google } = require("googleapis");

// إعداد OAuth2
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// =====================
// SIGN UP
// =====================
exports.signup = async (req, res) => {
  try {
    const { email, password, nationalId, phone } = req.body;

    if (!email || !password || !nationalId || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { nationalId }, { phone }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      ...req.body,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully"
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with this data"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error, try again"
    });
  }
};


// =====================
// FORGOT PASSWORD (UPDATED 🔥)
// =====================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `https://mern-frontend-rouge-five.vercel.app/registration/login/reset-password.html?token=${resetToken}`;

    const message = `
Please click on the link below to reset your password:

${resetLink}

⚠️ Do not share this link with anyone.

If you did not request this, ignore this email.
    `;

    // ✅ Gmail OAuth2 بدل SMTP
    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });



    await transporter.sendMail({
      from: `"Rahal App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      text: message,
    });

    return res.json({
      success: true,
      message: "Reset password email sent"
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error sending email"
    });
  }
};


// =====================
// RESET PASSWORD
// =====================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
//last change