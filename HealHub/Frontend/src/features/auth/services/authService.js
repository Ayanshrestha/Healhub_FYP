import api from "../../../services/api";

export const startRegistration = (data) => {
  const config = data instanceof FormData 
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api.post("/auth/start-registration", data, config).then(res => res.data);
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