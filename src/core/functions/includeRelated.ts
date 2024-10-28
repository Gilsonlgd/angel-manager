import path from "path";
import fs from "fs";

import { BaseCommand, RunnableArgs } from "@core";
import { getObjectFirstProperty } from "@utils/reactUtils";

const includeRelated = (
  command: BaseCommand,
  args: RunnableArgs,
  files: string[]
): void => {
  const fileName =
    getObjectFirstProperty(args.arguments.pascal) || command.commandName;

  for (const ext of files) {
    const outputPath = path.join(
      args.__dirname,
      `src/${command.destinationPath}/${command.subDir ? fileName + "/" : ""}${fileName}.${ext}`
    );

    fs.writeFileSync(outputPath, "");
  }
};

export default includeRelated;
