import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "HealHub <onboarding@resend.dev>",
      to,
      subject,
      html: html || `<p>${text}</p>`,
      text: text || "",
    });

    if (error) {
      console.log("EMAIL ERROR:", error);
      return {
        success: false,
        message: "Failed to send email",
        error: error.message,
        fullError: error
      };
    }

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
