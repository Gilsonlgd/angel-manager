import { Arguments } from "@utils/templateArgs";

export type Arg = {
  name: string;
  type: "number" | "string";
};

export type RunnableArgs = {
  arguments: Arguments;
  __dirname: string;
};


export type FileConfig = {
  name?:
    | string
    | {
        argName: string;
        case: "camel" | "kebab" | "snake" | "pascal";
        plural?: boolean;
      };
  extension?: string;
  subDir?: boolean;
};

export default abstract class BaseCommand {
  public abstract commandName: string;
  public abstract description: string;
  public abstract templatePath?: string;
  public abstract destinationPath?: string;

  public abstract file?: FileConfig;

  public abstract run(args: RunnableArgs): void;

  public abstract args(): Arg[];
}
