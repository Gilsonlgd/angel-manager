#!/usr/bin/env node
import { Command } from "commander";
import { build } from "esbuild";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import findProjectRoot from "src/utils/findProjectRoot";
import { makeTmpDirectory, deleteTmpDirectory } from "src/utils/fsUtils";

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);
const program = new Command();

async function loadCommands() {
  const processDir = process.cwd();
  const projectRoot = findProjectRoot(processDir);
  const commandsPath = path.join(projectRoot, "src/scaffolding/commands");
  makeTmpDirectory(__dirname);

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
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
      tsconfig: path.join(__dirname, "../../tsconfig.json"),
      target: "ESNext",
    });

    const { default: CommandClass } = await import(jsFilePath);
    const command = new CommandClass();
    console.log(command.args());
    deleteTmpDirectory(__dirname);
  }
}

loadCommands();
program.version("0.1.0").description("Angel Manager").parse(process.argv);
