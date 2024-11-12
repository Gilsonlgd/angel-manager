import {
  BaseCommand,
  Arg,
  FileConfig,
  RunnableArgs,
  renderTemplate,
  includeRelated,
} from 'angel-manager';

export default class AdminViews extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public commandName = 'make:admin-view';

  /**
   * Description of the command
   */
  public description = 'Makes a new Admin View';

  /**
   * Liquid template path
   */
  public templatePath = 'views/admin';

  /**
   * Processed template destination path
   */
  public destinationPath = 'views/admin';

  public file: FileConfig = {
    // The name of the generated file
    name: { argName: 'viewName', case: 'pascal' },
    // The extension of the generated file
    extension: 'tsx',
    // If true, the code will be generated inside a directory named after the file.
    subDir: true,
  };

  /**
   *
   * @returns an array of Arguments representing the arguments
   * to be passed to the command in the order they are defined
   */
  public args(): Arg[] {
    return [{ name: 'viewName', type: 'string' }];
  }

  public async run(args: RunnableArgs): Promise<void> {
    try {
      await renderTemplate(this, args);
      includeRelated(this, args, ['scoped.css']);
    } catch (error) {
      console.error();
    }
  }
}
