import fs from "fs";
import path from "path";

/**
 * Function to find the root directory of the project.
 * @param {string} startDir - The starting directory from which to begin the search.
 * @returns {string} - The absolute path to the project root.
 * @throws {Error} - If the project root is not found.
 */
const findProjectRoot = (startDir: string): string => {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error("Angel Manager: package.json not found. Not a Node.js project.");
};

export default findProjectRoot;
