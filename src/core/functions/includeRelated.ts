import path from "path";
import fs from "fs";

import { BaseCommand, RunnableArgs } from "@core";

const includeRelated = (
  command: BaseCommand,
  args: RunnableArgs,
  files: string[]
): void => {
  let fileName: string | number = "";
  if (command.file && command.file.name) {
    if (typeof command.file.name === "string") {
      fileName = command.file.name;
    } else if (typeof command.file.name === "object") {
      const caseType = command.file.name.case;
      const argName = command.file.name.argName;
      const isPlural = command.file.name.plural;

      if (argName in args.arguments[caseType]) {
        fileName = isPlural
          ? args.arguments["plural"][caseType][argName]
          : args.arguments[caseType][argName];
      } else {
        console.warn(
          `Warning: The argument "${argName}" does not exist in the defined arguments.`
        );
        fileName = "undefined";
      }
    }
  } else {
    fileName = "undefined";
  }

  for (const ext of files) {
    const outputPath = path.join(
      args.__dirname,
      `src/${command.destinationPath}/${command.file?.subDir ? fileName + "/" : ""}${fileName}.${ext}`
    );

    fs.writeFileSync(outputPath, "");
  }
};

export default includeRelated;
