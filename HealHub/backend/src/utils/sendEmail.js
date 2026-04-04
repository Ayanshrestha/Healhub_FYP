const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "HealHub", email: process.env.EMAIL_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html || `<p>${text}</p>`,
        textContent: text || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("EMAIL ERROR:", errorData);
      return {
        success: false,
        message: "Failed to send email",
        error: errorData,
      };
    }

    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.log("EMAIL ERROR:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
      fullError: error,
    };
  }
};

export default sendEmail;
