import config from "../../config/config.js";

/**
 * Send a generic email via Brevo HTTP API (any recipient, no domain needed)
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "HealHub", email: process.env.EMAIL_USER || config.emailUser },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error sending email:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await response.json();
    console.log(`📧 Email sent: ${data?.messageId}`);
    return data;
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
           <a href="${config.appUrl}/patient/appointments" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Appointment Details</a>
        </div>
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. All rights reserved.<br>Excellence in Healthcare Management.</p>
      </div>
    </div>
  `;
};

/**
 * Appointment Request (Pending) Template
 */
export const getAppointmentRequestTemplate = (data) => {
  const { patientName, doctorName, clinicName, date, timeSlot } = data;
  return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #34495e; padding: 25px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Request Received 📨</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Appointment Services</p>
        </div>
        <div style="padding: 30px; color: #444; line-height: 1.6;">
          <p style="font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
          <p>We have received your appointment request. Your booking is currently <strong>Awaiting Doctor Approval</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #34495e; margin: 20px 0;">
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
          
          <p>You will receive another email once the doctor reviews and approves your request.</p>
        </div>
        <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} HealHub. All rights reserved.</p>
        </div>
      </div>
    `;
};

/**
 * Payment Required Template (Model B)
 */
export const getPaymentRequiredTemplate = (data) => {
  const { patientName, doctorName, clinicName, date, timeSlot, amount } = data;
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #f39c12; padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Action Required: Payment Due 💳</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Appointment Services</p>
      </div>
      <div style="padding: 30px; color: #444; line-height: 1.6;">
        <p style="font-size: 18px;">Dear <strong>${patientName}</strong>,</p>
        <p>Great news! Your appointment request with <strong>Dr. ${doctorName}</strong> has been <strong>Approved</strong>.</p>
        <p>To finalize your booking and secure your slot, please complete the payment of <strong>NPR ${amount}</strong>.</p>
        
        <div style="background-color: #fff9f0; padding: 20px; border-radius: 10px; border-left: 5px solid #f39c12; margin: 20px 0;">
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
             <tr>
              <td style="padding: 8px 0; color: #777;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px 0; color: #e67e22; font-weight: bold;">NPR ${amount}</td>
            </tr>
          </table>
        </div>
        
        <p>Please log in to your dashboard to complete the payment.</p>
        <div style="text-align: center; margin-top: 30px;">
           <a href="${config.appUrl}/patient/appointments" style="background-color: #f39c12; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay for Appointment Now</a>
        </div>
      </div>
      <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} HealHub. Professional Healthcare Management.</p>
      </div>
    </div>
  `;
};

/**
 * Appointment Rejection Template
 */
export const getAppointmentRejectionTemplate = (data) => {
  const { patientName, doctorName, date, timeSlot, reason } = data;
  return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #c0392b; padding: 25px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Booking Update ❌</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Appointment Not Available</p>
        </div>
        <div style="padding: 30px; color: #444; line-height: 1.6;">
          <p style="font-size: 18px;">Hello <strong>${patientName}</strong>,</p>
          <p>Regrettably, your appointment request with <strong>Dr. ${doctorName}</strong> on ${date} cannot be fulfilled at this time.</p>
          
          <div style="background-color: #fff5f5; padding: 20px; border-radius: 10px; border-left: 5px solid #c0392b; margin: 20px 0;">
            <p style="margin: 0; color: #c0392b; font-weight: bold;">Status: Rejected</p>
            ${reason ? `<p style="margin: 10px 0 0; color: #666;"><strong>Reason:</strong> ${reason}</p>` : ''}
          </div>
          
          <p>This may be due to an unexpected change in the doctor's schedule or an emergency. Any payments made will be processed for refund automatically.</p>
          <p>We apologize for the inconvenience and encourage you to book another available slot.</p>
        </div>
        <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} HealHub. Healthcare Management.</p>
        </div>
      </div>
    `;
};

/**
 * Payment Receipt Template
 */
export const getPaymentReceiptTemplate = (data) => {
  const { patientName, amount, transactionId, packageName, date } = data;
  return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #2c3e50; padding: 25px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Payment Receipt 🧾</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">HealHub Billing Department</p>
        </div>
        <div style="padding: 30px; color: #444; line-height: 1.6;">
          <p style="font-size: 18px;">Thank you, <strong>${patientName}</strong>,</p>
          <p>Your payment has been successfully processed. Here are the transaction details:</p>
          
          <div style="background-color: #fdfdfd; padding: 25px; border: 1px dashed #ddd; border-radius: 10px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Amount:</strong></td>
                <td style="padding: 8px 0; color: #000; font-weight: bold;">NPR ${amount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Description:</strong></td>
                <td style="padding: 8px 0; color: #444;">${packageName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Transaction ID:</strong></td>
                <td style="padding: 8px 0; color: #444; font-family: monospace;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #444;">${date}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 13px; color: #888;">Note: This receipt confirms your payment only. For appointments, please wait for the doctor's manual approval email.</p>
        </div>
        <div style="background-color: #f4f7f6; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} HealHub. Professional Medical Solutions.</p>
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
 * Clinic Approval Email Template
 * Sent when admin approves a clinic registration.
 * Contains a secure link to set the password.
 */
export const getClinicApprovalTemplate = ({ clinicName, ownerName, setPasswordLink }) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 40px 30px; text-align: center; color: white;">
        <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.15); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 36px;">🏥</span>
        </div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Congratulations!</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Your clinic has been approved on HealHub</p>
      </div>
      <div style="padding: 36px 32px; color: #374151; line-height: 1.7;">
        <p style="font-size: 17px; margin-top: 0;">Dear <strong>${ownerName}</strong>,</p>
        <p>We are excited to let you know that <strong>${clinicName}</strong> has been reviewed and <strong style="color: #059669;">officially approved</strong> to join HealHub — Nepal's modern health platform.</p>
        <p>To activate your account, please set a secure password by clicking the button below. This link is valid for <strong>48 hours</strong>.</p>

        <div style="text-align: center; margin: 36px 0;">
          <a href="${setPasswordLink}"
             style="display: inline-block; background: linear-gradient(135deg, #059669, #0d9488); color: white; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 15px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.35);">
            🔑 Set Password &amp; Activate Account
          </a>
        </div>

        <div style="background-color: #f0fdf4; padding: 18px 20px; border-radius: 10px; border-left: 4px solid #059669; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #065f46;"><strong>Next steps after setting your password:</strong></p>
          <ol style="margin: 8px 0 0; padding-left: 18px; font-size: 13px; color: #065f46;">
            <li>Log in to your clinic dashboard</li>
            <li>Select a subscription plan (BASIC / STANDARD / PREMIUM)</li>
            <li>Complete payment via Khalti to go fully ACTIVE</li>
          </ol>
        </div>

        <p style="font-size: 13px; color: #9ca3af;">If you did not register a clinic on HealHub, please ignore this email. The link will expire automatically.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} HealHub. All rights reserved.<br>Empowering Healthcare in Nepal.</p>
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
