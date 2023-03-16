import express from "express";
import {
  sendVerificationEmail,
  signIn,
  signUp,
  verifyEmail,
} from "../controllers/auth";
import authorized from "../middleware/auth";
const authRoutes = express.Router();

authRoutes.post("/sign-in", signIn);
authRoutes.post("/sign-up", signUp);
authRoutes.get("/verify-email/:token", authorized, verifyEmail);
authRoutes.get("/send_verification_email", authorized, sendVerificationEmail);
export default authRoutes;
