import fs from "fs";
import path from "path";

export const getConfigOption = (key: string) => {
  const configPath = path.join(__dirname, "../", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  return config[key];
};
