import { Liquid } from "liquidjs";
import path from "path";
import fs from "fs";

const engine = new Liquid();

export const processTemplate = (dirname: string): void => {
  const rootDir = "components";
  const templatePath = path.join(
    dirname,
    `architecture/${rootDir}/index.liquid`
  );
  const templateContent = fs.readFileSync(templatePath, "utf8");
  const componentName = "MyComponent";

  const data = {
    componentName,
  };

  fs.mkdirSync(`${dirname}/${rootDir}/${componentName}`, { recursive: true });
  engine
    .parseAndRender(templateContent, data)
    .then((output) => {
      const outputPath = path.join(
        dirname,
        `${rootDir}/${componentName}/${componentName}.tsx`
      );
      fs.writeFileSync(outputPath, output);
      console.log("Arquivo .tsx gerado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao gerar o arquivo .tsx:", err);
    });
};
