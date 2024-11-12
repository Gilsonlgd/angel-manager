<p align="center">
  <img src="angel-manager.webp" alt="Angel Manager" width="300">
</p>

<h1 align="center">Angel Manager</h1>

**Angel Manager** is a CLI-based, template-driven architecture manager for **Node.js**. Completely **customizable** and **framework-independent**, this tool simplifies the implementation and maintenance of web software architectures by automating code generation and standardizing conventions across both frontend and backend. Ideal for developers seeking to modularize and streamline their Node.js workflow through modeling and code generation.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Reuse](#reuse)
- [Scaffolding Directory](#scaffolding-directory)
- [Creating a New Module](#creating-a-new-module)
- [Building a Template](#building-a-template)
- [Template Example](#template-example)
- [Design-Time Input Construction](#design-time-input-construction)
  - [Type Table](#type-table)
  - [`run` Method](#run-method)
    - [`renderTemplate` Method](#rendertemplate-method)
    - [`includeRelated` Method](#includerelated-method)
- [angel-managerrc.json](#angel-managerrcjson)
- [Contributions](#contributions)

---

## Installation

Install Angel Manager as a development dependency in your project:

```bash
npm install angel-manager --save-dev
```

or

```bash
yarn add -D angel-manager
```

## Configuration
After installation, the CLI will be available via npx angel. Initialize the basic structure for configuring Angel Manager:

```bash
npx angel init
```

This command will create the required directory structure within the src/scaffolding directory, which includes the ```architecture``` and ```commands``` subdirectories to define templates and custom commands.

## Usage
To list all available commands, use:

```bash
npx angel -h
```

## Reuse
If you have created an architecture model in another project, you can easily reuse it. Copy the scaffolding directory from the previous project and paste it into the new project.

Then, use the following command:

```bash
npx angel apply
```

This command applies the directory structure modeled in scaffolding/architecture, automatically initializing the directories in the new project. This avoids manually configuring the architecture for each project.

For example, the modeled structure:

```bash
scaffolding/
└── architecture/
    ├── components/
    └── views/
        ├── admin/
        └── public/
```

Should generate:

```bash
src/
└── components/
└── views/
    ├── admin/
    └── public/
```

## Scaffolding Directory
The **scaffolding** directory is where the project's architecture model is defined. It contains two main subdirectories:

- ```/architecture```: This subdirectory stores templates representing the modular structure of the architecture. It should reflect the desired directory organization for the project. Each module **(such as components or views)** will have its own template.

- ```/commands```: Contains **TypeScript** files that configure template transformations. Each model in the architecture should have a corresponding file in ```commands``` to define code generation and transformation rules. These files also serve to map the CLI commands available, enabling Angel Manager to identify and execute generation commands for each template.

For example:

```bash
src/
└── scaffolding/
    ├── architecture/  # Stores architecture templates like components, views, etc.
    │   ├── components/
    │   │   └── index.liquid
    │   └── views/
    │       ├── admin/
    │       │   └── index.liquid
    │       └── public/
    │           └── index.liquid
    │   └── ...    # Other architecture modules...
    └── commands/  # Defines generation rules and maps commands for each model
        ├── Components.ts
        ├── AdminViews.ts
        └── PublicViews.ts
```

**Note:** Each module template **must** be named `index.liquid`.

## Creating a New Module
When creating a new module, start by building the template and storing it in the corresponding directory within scaffolding/architecture.

Then, create a new file in the commands directory corresponding to the module being modeled. Angel Manager provides a command to initialize the basic structure of the ```.ts``` file, taking the module name as an argument:

```bash
npx angel create:command <commandName>
```

## Building a Template
**Angel Manager** uses the **Liquid Engine** to process the templates created. For further details on building your templates, refer to the engine documentation at [Liquid Engine](https://shopify.github.io/liquid/)..

As an example, let's build the template for the ```components``` module in a project that uses React.

## Template Example
```bash
src/
└── scaffolding/
    └── architecture/ 
        └── components/
            └── index.liquid
```

```javascript
import './{{ pascal.componentName }}.css';

interface {{ pascal.componentName }}Props {
  /* Component properties */
  requiredProp: string;
  optionalProp?: string;
}

function {{ pascal.componentName }}({
  requiredProp,
  optionalProp = 'Default Value',
}: {{ pascal.componentName }}Props): JSX.Element {
  return (
    <div className="{{ kebab.componentName }}">
      Your HTML here: {requiredProp}, {optionalProp}
    </div>
  );
}

export default {{ pascal.componentName }};

/**
 * @note
 * Don’t forget to list this new component.
 * Add the following snippet in components/index.ts:
 * export { default as {{ pascal.componentName }} } from './{{ pascal.componentName }}/{{ pascal.componentName }}';
 */
```

**Important!!!!:** This is just an example template. It is fully customizable to suit your needs. The template engine does not depend on a specific output language. The extension and file name of the generated file are defined in the corresponding TypeScript file in commands.

## Design-Time Input Construction
The **model configuration file**, defined within ```commands```, is called **design-time input**. During its construction, developers can customize code generation according to the project's needs.

The following example shows the implementation of a command that generates a new component:

```bash
src/
└── scaffolding/
    └── commands/ 
        └── Components.ts
```

```javascript
import {
  BaseCommand,
  FileConfig,
  Arg,
  RunnableArgs,
  renderTemplate,
} from 'angel-manager';

export default class Components extends BaseCommand {
  /**
   * Command name to be used when executing it
   */
  public commandName = 'make:component';

  /**
   * Command description
   */
  public description = 'Creates a new component';

  /**
   * Liquid template path, relative to scaffolding/architecture
   */
  public templatePath = 'components';

  /**
   * Destination path for the generated file, relative to src
   */
  public destinationPath = 'components';

  public file: FileConfig = {
    // Defines the generated file name
    name: { argName: 'componentName', case: 'camel' },
    // The extension of the generated file
    extension: 'tsx',
    // If true, the code will be generated inside a directory named after the file
    subDir: true,
  };

  /**
   *
   * @returns an array of arguments representing the parameters
   * that will be requested by the command line and made available in the template
   */
  public args(): Arg[] {
    return [{ name: 'componentName', type: 'string' }];
  }

  public async run(args: RunnableArgs): Promise<void> {
    try {
      await renderTemplate(this, args);
      includeRelated(this, args, ['css']);
    } catch (error) {
      console.error(error);
    }
  }
}

```

### Type Table

| Type           | Property | Description                                                                                                                                                                                                                                                          |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Arg**        | `name`      | The name of the argument that will be requested by the command line. This value is used to reference the parameter in the template.                                                                                                                                      |
|                | `type`      | 	The argument type. Can be "number" or "string", indicating the data type expected from the user.                                                                                                                                                         |
| **FileConfig** | `name`      | Defines the generated file name. Can be a `static string` or an `object` that uses one of the CLI-requested arguments and the desired case format (camel, kebab, snake, pascal). It can also include the plural option to make the value plural. |
|                | `extension` | Defines the generated file extension ```(e.g., .tsx).```                                                                                                                                                                                                         |
|                | `subDir`    | 	If true, the code will be generated inside a directory with the same name as the generated file.                                                                                                        |

### `run` Method

The `run` method is an abstract and asynchronous method that executes the command logic. It makes available the `args` argument, which contains the parameters passed by the user when executing the command. Inside the method, the developer has the freedom to define the command execution logic as needed.

In the provided example, the main responsibility of the run method is to call the `renderTemplate` function and pass itself (`this`) and the arguments (`args`) as parameters. The `renderTemplate` function, provided by **Angel Manager**, will process the Liquid template, replacing placeholders with the variables defined in the arguments, and generate the output code. The `run` method also includes a `try-catch` block to catch and handle errors that may occur during execution.


#### `renderTemplate` Method

The asynchronous `renderTemplate` method, provided by **Angel Manager**, processes the template through the engine using the received arguments and static attributes. It generates the output code based on the Liquid template and defined configurations.


| Argument  | Type           | Description                                                                                                                                                          |
| --------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command` | `BaseCommand`  | Instance of the command, used to access the static attributes of the model and provide the necessary context for processing. Passed within the class through `this`. |
| `args`    | `RunnableArgs` | Object containing the arguments passed to the command. It includes the parameters required to generate the code.                                                     |


#### `includeRelated` Method

The synchronous `includeRelated` method, provided by **Angel Manager**, allows for the inclusion of empty files related to the generated code. This method is useful when there is a need to create complementary files, such as style or test files, in the same directory as the generated code.

| Argument  | Type           | Description                                                                                                                                                                                                                 |
| --------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command` | `BaseCommand`  | Instance of the command, used to access the model's static attributes and provide the necessary context for including related files.                                                                                        |
| `args`    | `RunnableArgs` | Object containing the arguments passed to the command, used to configure the inclusion behavior.                                                                                                                            |
| `files`   | `string[]`     | Array of strings that specifies the extensions of related files to be created. This allows for the inclusion of, for example, style files (`.css`) or test files (`.test.tsx`) in the same directory as the generated code. |

## angel-managerrc.json

This is the global configuration file for Angel Manager. It is used to define default values for model construction.

```json
{
  "staticAttributes": {
    "extension": {
      "defaultValue": "tsx"
    },
    "subDir": {
      "defaultValue": true
    }
  }
}
```

## Contributions
Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements to the documentation.