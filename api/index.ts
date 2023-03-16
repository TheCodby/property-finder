import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./api/routes/auth";
import postsRoute from "./api/routes/posts";
import fs from "fs";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { admin } from "./api/middleware/admin";
import adminRoute from "./api/routes/admin";
import authorized from "./api/middleware/auth";
import { getTypes } from "./api/controllers/posts";
import userRoutes from "./api/routes/user";
import mainRoutes from "./api/routes/main";
dotenv.config();
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "ar"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: path.join(__dirname, "locales", "{{lng}}", "{{ns}}.json"),
      addPath: path.join(
        __dirname,
        "locales",
        "{{lng}}",
        "{{ns}}.missing.json"
      ),
    },
  });
const app = express();
app.use(middleware.handle(i18next));
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);
app.use("/", mainRoutes);
app.use("/auth", authRoutes);

app.use("/posts", postsRoute);
app.use("/user", authorized, userRoutes);
app.use("/admin", authorized, admin, adminRoute);
app.listen(process.env.PORT, () => {
  console.log(`3akar backend started on port ${process.env.PORT}`);
});
