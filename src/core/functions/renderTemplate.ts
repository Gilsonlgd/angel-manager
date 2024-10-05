import { Liquid } from "liquidjs";
import path from "path";
import fs from "fs";
import { BaseCommand, RunnableArgs } from "@core";
import { getObjectFirstProperty } from "@utils/reactUtils";

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
  const fileName =
    getObjectFirstProperty(args.arguments) || command.commandName;

  fs.mkdirSync(`${args.__dirname}/src/${command.destinationPath}/${fileName}`, {
    recursive: true,
  });

  try {
    await engine
      .parseAndRender(templateContent, args.arguments)
      .then((output) => {
        const outputPath = path.join(
          args.__dirname,
          `src/${command.destinationPath}/${command.subDir ? fileName + "/" : ""}${fileName}.${command.extension}`
        );
        fs.writeFileSync(outputPath, output);
        console.log("Angel says: template rendered successfully");
      });
  } catch (err) {
    throw err;
  }
};

export default renderTemplate;
