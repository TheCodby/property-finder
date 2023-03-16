import express from "express";
import { getTypes } from "../controllers/posts";
const mainRoutes = express.Router();

mainRoutes.get("/post_types", getTypes);
export default mainRoutes;
