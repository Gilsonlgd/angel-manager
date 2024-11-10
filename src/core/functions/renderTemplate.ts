import { Liquid } from "liquidjs";
import path from "path";
import fs from "fs";
import { BaseCommand, RunnableArgs } from "@core";

const engine = new Liquid();

const renderTemplate = async (
  command: BaseCommand,
  args: RunnableArgs
): Promise<void> => {
  const templatePath = path.join(
    args.__dirname,
    `src/scaffolding/architecture/${command.templatePath}/index.liquid`
  );
  const templateContent = fs.readFileSync(templatePath, "utf8");
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

  if (command.file?.subDir)
    fs.mkdirSync(
      `${args.__dirname}/src/${command.destinationPath}/${fileName}`,
      {
        recursive: true,
      }
    );
  try {
    await engine
      .parseAndRender(templateContent, args.arguments)
      .then((output) => {
        const outputPath = path.join(
          args.__dirname,
          `src/${command.destinationPath}/${command.file?.subDir ? fileName + "/" : ""}${fileName}.${command.file?.extension}`
        );
        fs.writeFileSync(outputPath, output);
        console.log("Template rendered successfully");
      });
  } catch (err) {
    throw err;
  }
};

export default renderTemplate;
