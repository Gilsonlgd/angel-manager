export default abstract class BaseCommand {
  public static commandName: string;
  public static description: string;

  public abstract run(): void;
}
