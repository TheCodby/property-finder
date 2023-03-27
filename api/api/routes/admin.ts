import express, { Request, Response } from "express";
import { getConfig, updateConfig } from "../controllers/admin/config";
import { getGeneralReports } from "../controllers/admin/main";
import { updatePost } from "../controllers/admin/posts";
import {
  addType,
  deleteType,
  getUsersCounts,
  searchUsers,
  updateType,
  updateUser,
} from "../controllers/admin/users";
import { postExist } from "../middleware/post";
import { userExists } from "../middleware/user";
const adminRoute = express.Router();

adminRoute.put("/posts/:postId", postExist, updatePost);

adminRoute.get("/users/counts", getUsersCounts);
adminRoute.get("/users", searchUsers);

adminRoute.put("/users/:userId", userExists, updateUser);
adminRoute.delete("/users/:userId", userExists, updateUser);

adminRoute.put("/post_types/:typeId", updateType);
adminRoute.post("/post_types/types", addType);
adminRoute.delete("/post_types/:typeId", deleteType);

adminRoute.get("/settings", getConfig);
adminRoute.put("/settings", updateConfig);
adminRoute.get("/check", (req: Request, res: Response) => {
  return res.sendStatus(200);
});
adminRoute.get("/general-reports", getGeneralReports);
export default adminRoute;
