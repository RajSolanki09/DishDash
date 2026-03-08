import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret_if_env_fails";
    const token = jwt.sign({ userId }, secret, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.log("Token Generation Error:", error);
    return null;
  }
};

export default genToken;