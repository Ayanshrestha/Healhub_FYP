import axios from "axios";

/**
 * Real SMS Delivery Utility (Sparrow SMS Implementation)
 */
export const sendSMS = async (to, message) => {
    const token = process.env.SMS_TOKEN;
    const from = process.env.SMS_SENDER_ID || "HealHub";

    // If no token, log and return (development mode)
    if (!token) {
        console.warn("[SMS SERVICE] Skipping SMS - No SMS_TOKEN found in .env");
        console.log(`[SMS SENDER] TO: ${to} | MSG: ${message}`);
        return { success: false, message: "SMS_TOKEN missing" };
    }

    try {
        // Example: Sparrow SMS API
        const response = await axios.get("https://api.sparrowsms.com/v2/sms/", {
            params: {
                token: token,
                from: from,
                to: to,
                text: message
            }
        });

        console.log("[SMS SERVICE] SMS Response:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("[SMS SERVICE] Error sending SMS:", error.response?.data || error.message);
        return { success: false, message: error.message };
    }
};
