import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    //  Gmail SMTP
    // Reverting to the original "service: gmail" config which worked previously
    const transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true, // Use a pool to keep connections open
      auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS, 
      },
      // Keep-alive settings to prevent timeouts
      connectionTimeout: 20000, 
      greetingTimeout: 20000,
      socketTimeout: 20000,
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
