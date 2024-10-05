import { Command } from "commander";
import { BaseCommand, Arg } from "@core";

const generateArgsString = (args: Arg[]) => {
  return args.map((arg) => `<${arg.name}>`).join(" ");
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

      let argsObject = {};
      definedArgs.forEach((arg, index) => {
        argsObject = { ...argsObject, [arg.name]: args[index] };
      });

      command.run({ arguments: argsObject, __dirname });
    });
};
