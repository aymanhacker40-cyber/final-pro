const ContactMessage = require("../models/ContactMessage");
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

    // 2️⃣ Gmail API
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 3️⃣ تجهيز الإيميل
    const emailContent = `
From: "Rahal Contact" <${process.env.EMAIL_USER}>
To: ${process.env.EMAIL_USER}
Subject: 📩 New Contact Message - ${subject}

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Message:
${message}
    `;

    const encodedMessage = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 4️⃣ إرسال الإيميل
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
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
