import express from "express";
import { addComment, getComments } from "../controllers/comments";
import authorized from "../middleware/auth";
import { postExist } from "../middleware/comment";
const commentsRoute = express.Router();

commentsRoute.get("/:postId/comments", postExist, getComments);
commentsRoute.post("/:postId/comments", postExist, authorized, addComment);
commentsRoute.get("/:postId/comments/:commentId", postExist);

export default commentsRoute;
