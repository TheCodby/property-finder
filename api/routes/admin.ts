import express from "express";
import { updatePost } from "../controllers/admin/posts";
import {
  addType,
  deleteType,
  updateType,
  updateUser,
} from "../controllers/admin/users";
import { postExist } from "../middleware/post";
import { userExists } from "../middleware/user";
const adminRoute = express.Router();

adminRoute.put("/posts/:postId", postExist, updatePost);

adminRoute.put("/users/:userId", userExists, updateUser);
adminRoute.delete("/users/:userId", userExists, updateUser);

adminRoute.put("/post_types/:typeId", updateType);
adminRoute.post("/post_types/types", addType);
adminRoute.delete("/post_types/:typeId", deleteType);
export default adminRoute;
