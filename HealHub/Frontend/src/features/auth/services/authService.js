import api from "../../../services/api";

export const startRegistration = (data) => {
  let payload = data;
  
  // Always convert plain objects to FormData because the backend route 
  // uses multer (multipart/form-data) to support optional file uploads.
  if (!(data instanceof FormData)) {
    payload = new FormData();
    Object.keys(data).forEach(key => {
      payload.append(key, data[key]);
    });
  }

  return api.post("/auth/start-registration", payload, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(res => res.data);
};


export const verifyOtpAPI = (data) =>
  api.post("/otp/verify", data).then(res => res.data);

export const resendOtpAPI = (data) =>
  api.post("/otp/send", data).then(res => res.data);

// Called after OTP verification for clinic role — submits the pending registration
export const registerClinicFromOtp = (email) =>
  api.post("/clinic/auth/register-from-otp", { email }).then(res => res.data);

export const completeRegistration = (data) =>
  api.post("/auth/complete-registration", data).then(res => res.data);

export const login = (data) =>
  api.post("/auth/Login", data).then(res => res.data);

export const verifyPaymentAPI = (pidx, token) =>
  api.post("/payment/verify", { pidx }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);