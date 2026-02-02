import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Create JWT
function createJwt(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "1d", 
  });
}

// Verify JWT
async function verifyJwt(token) {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (error, decoded) => {
      if (error) return reject(error);
      return resolve(decoded);
    });
  });
}

export { createJwt, verifyJwt };
