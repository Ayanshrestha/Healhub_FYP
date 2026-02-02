import axios from "axios";

const AUTH_API = "http://localhost:5000/api/auth";
const OTP_API = "http://localhost:5000/api/otp";

export const startRegistration = (data) =>
  axios.post(`${AUTH_API}/start-registration`, data).then(res => res.data);

export const verifyOtpAPI = (data) =>
  axios.post(`${OTP_API}/verify`, data).then(res => res.data);

export const resendOtpAPI = (data) =>
  axios.post(`${OTP_API}/send`, data).then(res => res.data);

export const completeRegistration = (data) =>
  axios.post(`${AUTH_API}/complete-registration`, data).then(res => res.data);

export const login = (data) =>
  axios.post(`${AUTH_API}/Login`, data).then(res => res.data);

export const verifyPaymentAPI = (pidx, token) =>
  axios.post(`http://localhost:5000/api/payment/verify`, { pidx }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);