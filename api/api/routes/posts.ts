import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  getAllPostsSlugs,
} from "../controllers/posts";
import authorized from "../middleware/auth";
import { author, postExist } from "../middleware/post";
import { privateEndpoint } from "../middleware/private-endpoint";
import commentsRoute from "./comments";
const postsRoute = express.Router();

postsRoute.get("/", getPosts);
postsRoute.get("/all-posts", privateEndpoint, getAllPostsSlugs);
postsRoute.get("/:postSlug", getPost);
postsRoute.post("/", authorized, createPost);
postsRoute.delete("/:postSlug", postExist, authorized, author, deletePost);
postsRoute.put("/:postSlug", postExist, authorized, author, updatePost);

postsRoute.use("/", commentsRoute);
export default postsRoute;
