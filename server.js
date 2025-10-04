// server.js
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve current directory (not "public")
app.use(express.static("./"));
app.use(bodyParser.json());

// Contact Form API
app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, company, subject, message } = req.body;

  console.log("📩 Contact form received:", req.body);

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ciphra Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      text: `
        From: ${firstName} ${lastName} (${email})
        Company: ${company || "N/A"}
        Message: ${message}
      `,
    });

    console.log("✅ Email sent successfully!");
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Default route now serves index.html from root
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
