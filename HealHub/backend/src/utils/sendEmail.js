import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    //  Gmail SMTP
    // Gmail SMTP with explicit host and port for better reliability on Render
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS, 
      },
      // Increase timeout for slow cloud networks
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
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
