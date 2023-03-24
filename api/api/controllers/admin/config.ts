import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import handleExcpetions from "../../../utils/errors";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const configPath = path.join(__dirname, "../../../", "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return res.status(200).json(config);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
export const updateConfig = async (req: Request, res: Response) => {
  try {
    const configPath = path.join(__dirname, "../../../", "config.json");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, "{}");
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    for (const key in req.body) {
      if (!config.hasOwnProperty(key)) {
        delete req.body[key];
      }
    }
    Object.assign(config, req.body);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    res.sendStatus(200);
  } catch (e: any) {
    handleExcpetions(e, req, res);
  }
};
