import express from "express";
import {
  updateEmail,
  updatePassword,
  updateName,
  getSession,
} from "../controllers/user";
const userRoutes = express.Router();

userRoutes.put("/email", updateEmail);
userRoutes.put("/password", updatePassword);
userRoutes.put("/name", updateName);
userRoutes.get("/session", getSession);

export default userRoutes;
