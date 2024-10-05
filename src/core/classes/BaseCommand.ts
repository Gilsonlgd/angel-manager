import { Arguments } from "@utils/templateArgs";

export type Arg = {
  name: string;
  type: string;
};

export type RunnableArgs = {
  arguments: Arguments;
  __dirname: string;
};

export default abstract class BaseCommand {
  public abstract commandName: string;
  public abstract description: string;
  public abstract templatePath?: string;
  public abstract destinationPath?: string;
  public abstract extension?: string;
  public abstract subDir?: boolean;

  public abstract run(args: RunnableArgs): void;

  public abstract args(): Arg[];
}
