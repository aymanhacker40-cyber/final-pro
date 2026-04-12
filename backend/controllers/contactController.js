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

// 🔥 نفس function بتاعة forgot password
const sendEmail = async (to, subject, message) => {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const email = [
    `From: "Rahal Contact" <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  const encodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedEmail,
    },
  });
};

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

    // 2️⃣ تجهيز محتوى الرسالة
    const fullMessage = `
📩 New Contact Message

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Subject: ${subject}

Message:
${message}
    `;

    // 3️⃣ إرسال الإيميل (لنفسك)
    await sendEmail(
      process.env.EMAIL_USER, // ← الإيميل بتاعك
      `📩 Contact Message - ${subject}`,
      fullMessage
    );

    res.status(201).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      message: "Error sending email",
    });
  }
};