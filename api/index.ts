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
const httpServer = http.createServer(app);
if (process.env.SSL_KEY && process.env.SSL_CERT) {
  app.use((req, res, next) => {
    if (req.secure) {
      // If request is already secure (HTTPS), no need to redirect
      next();
    } else {
      // Redirect to HTTPS version of the request URL
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
      },
      app
    )
    .listen(443, () => {
      console.log(`server is runing at port 443`);
    });
}
httpServer.listen(80, () => {
  console.log(`server is runing at port 80`);
});
