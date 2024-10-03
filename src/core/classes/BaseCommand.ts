export type Arg = {
  name: string;
  type: string;
};

export default abstract class BaseCommand {
  public static commandName: string;
  public static description: string;
  public static templatePath: string;
  public static destinationPath: string;
  public static extension: string;

  public abstract run(): void;

  public abstract args(): Arg[];
}
