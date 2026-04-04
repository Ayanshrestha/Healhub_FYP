import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    //  Gmail SMTP
    // Using Port 587 (STARTTLS) which is often more compatible with cloud firewalls
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS, 
      },
      connectionTimeout: 15000, 
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    // Email details
    const mailOptions = {
      from: `"HealHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "No text content provided.",
      html: html || `<p>${text}</p>`,
    };

    //Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully",
    };

  } catch (error) {
    console.log("EMAIL ERROR:", error);

    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
      fullError: error
    };
  }
};

export default sendEmail;
