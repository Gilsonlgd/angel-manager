import { Command } from "commander";
import { Liquid } from "liquidjs";

import fs from "fs";
import path from "path";

import { camelCase, snakeCase, kebabCase, pascalCase } from "change-case";
import pluralize from "pluralize";

import { BaseCommand, Arg } from "@core";
import { generateArgsString, argsObject } from "./templateArgs";
import { __dirname } from "./reactUtils";

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

export const buildDefaultCommands = (
  program: Command,
  userRoot: string
): void => {
  const engine = new Liquid();
  const templatePath = path.join(__dirname, "templates/command.liquid");
  const templateContent = fs.readFileSync(templatePath, "utf8");

  /* Create Commands */
  program
    .command("create:command <commandName>")
    .description("Creates a new command")
    .action(async (...args) => {
      const templateArgs = transformArgs(args, [
        { name: "commandName", type: "string" },
      ]);
      try {
        await engine
          .parseAndRender(templateContent, templateArgs)
          .then((output) => {
            const outputPath = path.join(
              userRoot,
              `src/scaffolding/commands/${templateArgs.pascal.commandName}.ts`
            );
            fs.writeFileSync(outputPath, output);
            console.log("Angel says: command created successfully");
          });
      } catch (err) {
        throw err;
      }
    });
};
