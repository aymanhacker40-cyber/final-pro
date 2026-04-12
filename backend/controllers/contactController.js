const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// إعداد OAuth2
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// حط الـ Refresh Token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

exports.sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // 1️⃣ حفظ في الداتا بيز
    await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    // 2️⃣ نجيب Access Token
    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // 3️⃣ إعداد الإيميل (نفس ستايل forgot password)
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

    // 4️⃣ إرسال الإيميل
    await transporter.sendMail({
      from: `"Rahal Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message - ${subject}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `,
    });

    res.status(201).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      message: "Error sending email",
    });
  }
};

//last change
