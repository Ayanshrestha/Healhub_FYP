import dotenv from "dotenv";

dotenv.config();

const config = {
  name: process.env.NAME,
  version: process.env.VERSION,
  port: process.env.PORT,

  enableTestFeature: Boolean(process.env.FEATURE_TEST) || false,

  mongoDBUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET || "",

  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,


  appUrl: process.env.APP_URL || "",
  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY || "",
    apiKey: process.env.KHALTI_API_KEY || "",
    apiUrl: process.env.KHALTI_API_URL || "",
    returnUrl: process.env.KHALTI_RETURN_URL || "",
  },
};

export default config;
