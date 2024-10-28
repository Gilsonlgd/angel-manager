import fs from "fs";
import path from "path";

import findProjectRoot from "@utils/findProjectRoot";
import { ConfigFile } from "../types/ConfigFile";

const processDir = process.cwd();
const userRoot = findProjectRoot(processDir);

export const makeTmpDirectory = (__dirname: string): void => {
  const tempDirPath = path.join(__dirname, "../temp");
  fs.mkdir(tempDirPath, { recursive: true }, (err) => {
    if (err) {
      console.error(
        "Angel Manager [internal]: Error creating temp directory:",
        err
      );
      return;
    }
  });
};

export const deleteTmpDirectory = (__dirname: string): void => {
  const tempDirPath = path.join(__dirname, "../temp");
  fs.rm(tempDirPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(
        "Angel Manager [internal]: Error deleting temp directory:",
        err
      );
      return;
    }
  });
};

export const getConfigFile = async (): Promise<ConfigFile | {}> => {
  const configPath = path.join(userRoot, "angel-managerrc.json");
  let configData: ConfigFile = {};

  if (fs.existsSync(configPath)) {
    try {
      const fileContents = await fs.promises.readFile(configPath, "utf-8");
      configData = JSON.parse(fileContents);
      return configData;
    } catch (error) {
      console.error(
        "Angel Manager [internal]: Error parsing configuration file:",
        error
      );
    }
  }

  return {};
};