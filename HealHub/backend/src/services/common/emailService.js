import nodemailer from "nodemailer";
import config from "../../config/config.js";

// Create a transporter using config credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

/**
 * Send a generic email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"HealHub Reminders" <${config.emailUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

/**
 * Medicine Reminder Template - Professional Hospital Grade
 */
export const getMedicineReminderTemplate = (data) => {
  const { patientName, medicineName, dosage, cleanTime } = data;
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #3498db; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Medicine Reminder 💊</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Hospital Management System</p>
      </div>
      <div style="padding: 30px; color: #444; line-height: 1.6;">
        <p style="font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
        <p>This is a scheduled reminder to take your medication. Staying consistent with your dosage is crucial for your recovery.</p>
        
        <div style="background-color: #f8fbff; padding: 20px; border-radius: 10px; border-left: 5px solid #3498db; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Medicine:</strong></td>
              <td style="padding: 8px 0; color: #333;">${medicineName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Dosage:</strong></td>
              <td style="padding: 8px 0; color: #333;">${dosage}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Scheduled Time:</strong></td>
              <td style="padding: 8px 0; color: #333;">${cleanTime}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-style: italic; color: #888; font-size: 14px;">If you have already taken this dose, please ignore this email.</p>
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. All rights reserved.<br>Ensuring your health and wellness every day.</p>
      </div>
    </div>
  `;
};

/**
 * Appointment Confirmation Template
 */
export const getAppointmentConfirmationTemplate = (data) => {
  const { patientName, doctorName, clinicName, date, timeSlot, bookingRef, amount } = data;
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #27ae60; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed ✅</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Appointment Services</p>
      </div>
      <div style="padding: 30px; color: #444; line-height: 1.6;">
        <p style="font-size: 18px;">Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment has been successfully booked and confirmed. We have received your payment of <strong>NPR ${amount}</strong>.</p>
        
        <div style="background-color: #f9fffb; padding: 20px; border-radius: 10px; border-left: 5px solid #27ae60; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Booking Ref:</strong></td>
              <td style="padding: 8px 0; color: #333;">#${bookingRef}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Doctor:</strong></td>
              <td style="padding: 8px 0; color: #333;">Dr. ${doctorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Clinic:</strong></td>
              <td style="padding: 8px 0; color: #333;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Date:</strong></td>
              <td style="padding: 8px 0; color: #333;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Time Slot:</strong></td>
              <td style="padding: 8px 0; color: #333;">${timeSlot}</td>
            </tr>
          </table>
        </div>
        
        <p>Please arrive at the clinic at least 15 minutes prior to your scheduled time.</p>
        <div style="text-align: center; margin-top: 30px;">
           <a href="http://localhost:5173/patient/appointments" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Appointment Details</a>
        </div>
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. All rights reserved.<br>Excellence in Healthcare Management.</p>
      </div>
    </div>
  `;
};

/**
 * Appointment Reminder Template (24h or 1h)
 */
export const getAppointmentReminderTemplate = (data) => {
  const { patientName, doctorName, clinicName, date, timeSlot, type } = data;
  const isOneHour = type === '1h';
  const mainColor = isOneHour ? '#e67e22' : '#27ae60';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: ${mainColor}; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Upcoming Appointment 🏥</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">${isOneHour ? 'Starting in 1 hour' : 'Scheduled for tomorrow'}</p>
      </div>
      <div style="padding: 30px; color: #444; line-height: 1.6;">
        <p style="font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
        <p>This is a friendly reminder of your upcoming check-up at HealHub.</p>
        
        <div style="background-color: #fffaf5; padding: 20px; border-radius: 10px; border-left: 5px solid ${mainColor}; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Doctor:</strong></td>
              <td style="padding: 8px 0; color: #333;">Dr. ${doctorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Clinic:</strong></td>
              <td style="padding: 8px 0; color: #333;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Date:</strong></td>
              <td style="padding: 8px 0; color: #333;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Time Slot:</strong></td>
              <td style="padding: 8px 0; color: #333;">${timeSlot}</td>
            </tr>
          </table>
        </div>
        
        ${isOneHour ? '<p style="color: #c0392b; font-weight: bold;">Please start heading to the clinic to ensure you arrive on time.</p>' : '<p>If you need to reschedule, please let us know as soon as possible.</p>'}
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. All rights reserved.</p>
      </div>
    </div>
  `;
};

/**
 * Provider Booking Notification Template
 */
export const getProviderBookingNotificationTemplate = (data) => {
  const { providerName, patientName, clinicName, date, timeSlot, bookingRef } = data;
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #34495e; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">New Appointment Booked 📅</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Provider Portal</p>
      </div>
      <div style="padding: 30px; color: #444; line-height: 1.6;">
        <p style="font-size: 18px;">Hello <strong>Dr. ${providerName}</strong>,</p>
        <p>A new appointment has been scheduled and paid for at your clinic, <strong>${clinicName}</strong>.</p>
        
        <div style="background-color: #f4f7f9; padding: 20px; border-radius: 10px; border-left: 5px solid #34495e; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Patient:</strong></td>
              <td style="padding: 8px 0; color: #333;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Booking Ref:</strong></td>
              <td style="padding: 8px 0; color: #333;">#${bookingRef}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Date:</strong></td>
              <td style="padding: 8px 0; color: #333;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Time Slot:</strong></td>
              <td style="padding: 8px 0; color: #333;">${timeSlot}</td>
            </tr>
          </table>
        </div>
        
        <p>You can view your full schedule in the provider dashboard.</p>
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. For Providers.</p>
      </div>
    </div>
  `;
};
