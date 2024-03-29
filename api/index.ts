import express, { Request, Response } from "express";
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
const https = require("https");
const http = require("http");
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
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure && req.headers.host === process.env.API_HOST) {
      // If request is already secure (HTTPS), no need to redirect
      next();
    } else {
      // Redirect to HTTPS version of the request URL
      res.redirect(`https://${process.env.API_HOST}${req.url}`);
    }
  });
}
app.use(middleware.handle(i18next));
app.use(helmet());
app.use(bodyParser.json({ limit: "10mb" }));
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
if (process.env.NODE_ENV === "production") {
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string),
      },
      app
    )
    .listen(443, () => {
      console.log(
        `Server is running in producation mode on https://${process.env.API_HOST}`
      );
    });
} else {
  app.listen(process.env.PORT, () => {
    console.log(
      `Server is running in development mode at port ${process.env.PORT}`
    );
  });
}
