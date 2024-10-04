#!/usr/bin/env node
import { Command } from "commander";
import { build } from "esbuild";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import findProjectRoot from "src/utils/findProjectRoot";
import { makeTmpDirectory, deleteTmpDirectory } from "src/utils/fsUtils";
import { defineNewCommand } from "src/utils/commander";
import { BaseCommand } from "src/core";

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const program = new Command();

async function loadCommand<T extends BaseCommand>(
  jsFilePath: string
): Promise<T> {
  const { default: CommandClass } = await import(jsFilePath);
  return new (CommandClass as { new (): T })();
}

async function loadCommands() {
  const processDir = process.cwd();
  const projectRoot = findProjectRoot(processDir);
  const commandsPath = path.join(projectRoot, "src/scaffolding/commands");
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
      tsconfig: path.join(__dirname, "../../tsconfig.json"), // mudar para o ts do projeto
      target: "ESNext",
    });

    const command = await loadCommand<BaseCommand>(jsFilePath);
    defineNewCommand(program, command, projectRoot);
  }
  deleteTmpDirectory(__dirname);
}

(async () => {
  await loadCommands();
  program.parse(process.argv);
})();
