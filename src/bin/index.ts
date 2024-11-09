#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Command } from "commander";
import { build } from "esbuild";

import findProjectRoot from "@utils/findProjectRoot";
import { makeTmpDirectory, deleteTmpDirectory } from "@utils/fsUtils";
import { buildDefaultCommands, defineNewCommand } from "@utils/commander";
import { __dirname } from "@utils/reactUtils";

import { BaseCommand } from "@core/index";

const program = new Command();
const processDir = process.cwd();
const userRoot = findProjectRoot(processDir);

async function loadCommand<T extends BaseCommand>(
  jsFilePath: string
): Promise<T> {
  const { default: CommandClass } = await import(jsFilePath);
  return new (CommandClass as { new (): T })();
}

async function loadCommands() {
  const commandsPath = path.join(userRoot, "src/scaffolding/commands");
  if (!fs.existsSync(commandsPath)) {
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  makeTmpDirectory(__dirname);
  for (const file of commandFiles) {
    const tempDirPath = path.join(__dirname, "../temp");
    const tsFilePath = path.join(commandsPath, file);
    const jsFilePath = path.join(tempDirPath, file.replace(/\.ts$/, ".js"));

    await build({
      entryPoints: [tsFilePath],
      outfile: jsFilePath,
      bundle: false,
      platform: "node",
      format: "esm",
      sourcemap: false,
      tsconfig: path.join(userRoot, "tsconfig.json"), // mudar para o ts do projeto
      target: "ESNext",
    });
    const command = await loadCommand<BaseCommand>(
      pathToFileURL(jsFilePath).href
    );
    defineNewCommand(program, command, userRoot);
  }
  deleteTmpDirectory(__dirname);
}

(async () => {
  buildDefaultCommands(program, userRoot);
  await loadCommands();
  program.parse(process.argv);
})();
