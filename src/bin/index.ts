#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { build } from "esbuild";

import findProjectRoot from "@utils/findProjectRoot";
import { makeTmpDirectory, deleteTmpDirectory } from "@utils/fsUtils";
import { defineNewCommand } from "@utils/commander";
import { __dirname } from "@utils/reactUtils";

import { BaseCommand } from "@core/index"

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
      tsconfig: path.join(projectRoot, "tsconfig.json"), // mudar para o ts do projeto
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
