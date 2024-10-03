import fs from "fs";
import path from "path";

export const makeTmpDirectory = (__dirname: string): void => {
  const tempDirPath = path.join(__dirname, "../temp");
  fs.mkdir(tempDirPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Angel Says: Error creating temp directory:", err);
      return;
    }
  });
};

export const deleteTmpDirectory = (__dirname: string): void => {
  const tempDirPath = path.join(__dirname, "../temp");
  fs.rm(tempDirPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Angel Says: Error deleting temp directory:", err);
      return;
    }
  });
};
