import {
  BaseCommand,
  FileConfig,
  Arg,
  RunnableArgs,
  renderTemplate,
} from 'angel-manager';

export default class Models extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public commandName = 'make:model';

  /**
   * Description of the command
   */
  public description = 'Makes a new model';

  /**
   * Path to the Liquid template, relative to src/scaffolding/architecture
   */
  public templatePath = 'models';

  /**
   * Destination path for the generated code, relative to src
   */
  public destinationPath = 'models';

  public file: FileConfig = {
    // The name of the generated file
    name: { argName: 'modelName', case: 'pascal' },
    // The extension of the generated file
    extension: 'ts',
    // If true, the code will be generated inside a directory named after the file.
    subDir: false,
  };

  /**
   *
   * @returns an array of Arguments representing the arguments
   * to be passed to the command in the order they are defined
   */
  public args(): Arg[] {
    return [{ name: 'modelName', type: 'string' }];
  }

  public async run(args: RunnableArgs): Promise<void> {
    try {
      await renderTemplate(this, args);
    } catch (error) {
      console.error(error);
    }
  }
}
