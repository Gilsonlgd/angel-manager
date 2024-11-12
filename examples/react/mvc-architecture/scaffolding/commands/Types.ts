import {
  BaseCommand,
  FileConfig,
  Arg,
  RunnableArgs,
  renderTemplate,
} from 'angel-manager';

export default class Types extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public commandName = 'make:type';

  /**
   * Description of the command
   */
  public description = 'Makes a new Type';

  /**
   * Liquid template path
   */
  public templatePath = 'types';

  /**
   * Processed template destination path
   */
  public destinationPath = 'types';

  public file: FileConfig = {
    // The name of the generated file
    name: { argName: 'typeName', case: 'camel' },
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
    return [{ name: 'typeName', type: 'string' }];
  }

  public async run(args: RunnableArgs): Promise<void> {
    try {
      await renderTemplate(this, args);
    } catch (error) {
      console.error(error);
    }
  }
}
