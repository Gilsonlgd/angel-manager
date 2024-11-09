import { Command } from "commander";
import { Liquid } from "liquidjs";

import fs from "fs";
import path from "path";

import { camelCase, snakeCase, kebabCase, pascalCase } from "change-case";
import pluralize from "pluralize";

import { BaseCommand, Arg } from "@core";
import { generateArgsString, argsObject } from "./templateArgs";
import { __dirname } from "./reactUtils";
import { getConfigFile } from "./fsUtils";

export const transformArgs = (
  args: string[],
  expectedArgs: Arg[]
): typeof argsObject => {
  const result = JSON.parse(JSON.stringify(argsObject));
  args.forEach((arg, index) => {
    if (typeof arg !== "string" && typeof arg !== "number") return;

    const { name: attribute, type } = expectedArgs[index];
    if (type === "number") {
      result.base[attribute] = Number(arg);
      return;
    }

    result.base[attribute] = arg;
    const camel = camelCase(arg);
    const kebab = kebabCase(arg);
    const snake = snakeCase(arg);
    const pascal = pascalCase(arg);

    result.camel[attribute] = camel;
    result.kebab[attribute] = kebab;
    result.snake[attribute] = snake;
    result.pascal[attribute] = pascal;

    result.plural.camel[attribute] = pluralize(camel);
    result.plural.kebab[attribute] = pluralize(kebab);
    result.plural.snake[attribute] = pluralize(snake);
    result.plural.pascal[attribute] = pluralize(pascal);
  });

  return result;
};

export const defineNewCommand = (
  program: Command,
  command: BaseCommand,
  __dirname: string
): void => {
  program
    .command(`${command.commandName} ${generateArgsString(command.args())}`)
    .description(command.description)
    .action(async (...args) => {
      const definedArgs = command.args();

      if (args.length - 2 !== definedArgs.length) {
        console.warn(
          `Warning: Expected ${definedArgs.length} arguments but received ${args.length}.`
        );
      }

      let argsObject = transformArgs(args, definedArgs);
      command.run({ arguments: argsObject, __dirname });
    });
};

function createScaffoldingDirectories(userRoot: string): void {
  const directories = [
    path.join(userRoot, "src/scaffolding"),
    path.join(userRoot, "src/scaffolding/architecture"),
    path.join(userRoot, "src/scaffolding/commands"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  console.log("Scaffolding directory initialized successfully!");
}

function replicateDirectoryStructure(
  sourceDir: string,
  targetDir: string
): void {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      replicateDirectoryStructure(sourcePath, targetPath);
    }
  });
}

export const buildDefaultCommands = (
  program: Command,
  userRoot: string
): void => {
  const engine = new Liquid();
  const templatePath = path.join(__dirname, "templates/command.liquid");
  const templateContent = fs.readFileSync(templatePath, "utf8");

  /* Initialize the scaffolding directory */
  program
    .command("init")
    .description("Initializes the required directories")
    .action(() => {
      createScaffoldingDirectories(userRoot);
    });

  /* Applies the scaffolding/architecture directory structure */
  program
    .command("apply")
    .description("Applies the modeled architecture")
    .action(() => {
      const sourceDir = path.join(
        userRoot,
        "src",
        "scaffolding",
        "architecture"
      );

      const targetDir = path.join(userRoot, "src");
      replicateDirectoryStructure(sourceDir, targetDir);
      console.log("Modeled architecture applied successfully!");
    });

  /* Create Commands */
  program
    .command("create:command <commandName>")
    .description("Creates a new command")
    .action(async (...args) => {
      const templateArgs = transformArgs(args, [
        { name: "commandName", type: "string" },
      ]);
      const configData = await getConfigFile();

      try {
        await engine
          .parseAndRender(templateContent, {
            ...templateArgs,
            model: { ...configData },
          })
          .then((output) => {
            const outputPath = path.join(
              userRoot,
              `src/scaffolding/commands/${templateArgs.plural.pascal.commandName}.ts`
            );
            fs.writeFileSync(outputPath, output);
            console.log("Command created successfully!");
          });
      } catch (err) {
        throw err;
      }
    });
};
