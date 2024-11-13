<p align="center">
  <img src="angel-manager.webp" alt="Angel Manager" width="300">
</p>

<h1 align="center">Angel Manager</h1>

**Angel Manager** é um gerenciador de arquitetura baseado em templates via CLI para **Node.js**. Totalmente **customizável** e **independente de framework**, esta ferramenta facilita a implementação e manutenção de arquiteturas de software web, automatizando a geração de código e padronizando convenções tanto no frontend quanto no backend. Ideal para desenvolvedores que buscam modularizar e otimizar seu fluxo de trabalho em Node.js a partir de modelagem e geração de código.


## Índice
- [Índice](#índice)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Reutilização](#reutilização)
- [Diretório scaffolding](#diretório-scaffolding)
- [Criando um novo módulo](#criando-um-novo-módulo)
- [Construindo um Template](#construindo-um-template)
  - [Exemplo de Template](#exemplo-de-template)
- [Construção do Design-Time Input](#construção-do-design-time-input)
  - [Tabela de Tipos](#tabela-de-tipos)
  - [Método `run`](#método-run)
    - [Método `renderTemplate`](#método-rendertemplate)
    - [Método `includeRelated`](#método-includerelated)
- [angel-managerrc.json](#angel-managerrcjson)
- [Contribuições](#contribuições)

---

## Instalação

Instale o Angel Manager como uma dependência de desenvolvimento no seu projeto:

```bash
npm install angel-manager --save-dev
```

ou 

```bash
yarn add -D angel-manager
```

## Configuração
Após a instalação, a utilização da CLI (Linha de Comando) estará disponível através de ```npx angel```. Inicie a estrutura básica para configuração do Angel Manager:

```bash
npx angel init
```

Este comando criará a estrutura de diretórios necessária dentro do diretório src/scaffolding, que inclui os subdiretórios ```architecture``` e ```commands``` para definir templates e comandos customizados.

## Uso
Para listar todos os comandos disponíveis, use:

```bash
npx angel -h
```

## Reutilização
Se você já criou um modelo de arquitetura em outro projeto, pode reutilizá-lo facilmente. Para isso, copie o diretório scaffolding do projeto anterior e cole-o no novo projeto.

Em seguida, utilize o comando:
```bash
npx angel apply
```

Esse comando aplica a estrutura de diretórios modelada em scaffolding/architecture, inicializando automaticamente os diretórios no novo projeto. Dessa forma, você evita configurar manualmente a arquitetura para cada projeto.

Por exemplo, a estrutura modelada:
```bash
scaffolding/
└── architecture/
    ├── components/
    └── views/
        ├── admin/
        └── public/
```

Deve gerar:
```bash
src/
└── components/
└── views/
    ├── admin/
    └── public/
```

## Diretório scaffolding
O diretório **scaffolding** é onde se define o modelo da arquitetura do projeto. Ele contém dois subdiretórios principais:

- ```/architecture```: Este subdiretório armazena os templates que representam a estrutura modular da arquitetura. Deve refletir a organização de diretórios desejada para o projeto. Cada módulo **(como components ou views)** terá seu próprio template.
- ```/commands```: Contém arquivos **TypeScript** que configuram as transformações dos templates. Cada modelo na arquitetura deve ter um arquivo correspondente em ```commands``` para definir as regras de geração e transformação de código. Esses arquivos também servem para mapear os comandos disponíveis na CLI, permitindo que o Angel Manager identifique e execute comandos de geração para cada template.

Por exemplo:
```bash
src/
└── scaffolding/
    ├── architecture/  # Armazena templates de arquitetura, como components, views, etc.
    │   ├── components/
    │   │   └── index.liquid
    │   └── views/
    │       ├── admin/
    │       │   └── index.liquid
    │       └── public/
    │           └── index.liquid
    │   └── ...    # Outros módulos da arquitetura...
    └── commands/  # Define regras de geração e mapeia comandos para cada modelo
        ├── Components.ts
        ├── AdminViews.ts
        └── PublicViews.ts
```

**Obs.:** Note que os correspondentes ao template de cada módulo leva `OBRIGATORIAMENTE` o nome `index.liquid`. 

## Criando um novo módulo
Ao criar um novo módulo, comece construindo o template e armazene-o no diretório correspondente dentro de scaffolding/architecture.

Em seguida, crie um novo arquivo no diretório commands, correspondente ao módulo que está sendo modelado. Para isso, o Angel Manager fornece um comando para inicializar a estrutura base do arquivo ```.ts```, recebendo como argumento o nome do módulo:

```bash
npx angel create:command <commandName>
```

## Construindo um Template

O **Angel Manager** utiliza a **Liquid Engine** para processar os templates criados. Para entender melhor como construir seus templates, consulte a documentação da engine em [Liquid Engine](https://shopify.github.io/liquid/).

Como exemplo, vamos construir o template para o módulo `components` em um projeto que utiliza **React**.

### Exemplo de Template

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
  /* As propriedades do componente */
  requiredProp: string;
  optionalProp?: string;
}

function {{ pascal.componentName }}({
  requiredProp,
  optionalProp = 'Valor Padrão',
}: {{ pascal.componentName }}Props): JSX.Element {
  return (
    <div className="{{ kebab.componentName }}">
      Seu HTML aqui: {requiredProp}, {optionalProp}
    </div>
  );
}

export default {{ pascal.componentName }};

/**
 * @note
 * Não se esqueça de listar este novo componente.
 * Adicione o seguinte trecho em components/index.ts:
 * export { default as {{ pascal.componentName }} } from './{{ pascal.componentName }}/{{ pascal.componentName }}';
 */
```

O **Angel Manager** oferece variações de case para cada argumento, incluindo: camelCase, kebab-case, snake_case e PascalCase. Além disso, cada uma dessas variações possui uma versão plural correspondente.

Por exemplo, para acessar o argumento `componentName` em `PascalCase`, utilizamos `{{ pascal.componentName }}`. Para obter sua versão no **plural e em PascalCase**, usamos `{{ plural.pascal.componentName }}`.

**Importante!!!!:** Este é apenas um exemplo de template. Ele é totalmente customizáel para se ajustar às suas necessidades. A engine de templates não depende de uma linguagem de saída específica. A extensão e o nome do arquivo gerado são definidos no arquivo TypeScript correspondente em commands.

## Construção do Design-Time Input

Ao arquivo de **configuração do modelo**, definido dentro de ```/commands``` chamamos **design-time input**. Durante a construção deste, os desenvolvedores podem personalizar a geração de código de acordo com as necessidades do projeto.

O exemplo a seguir mostra a implementação de um comando que gera um novo componente:

```bash
src/
└── scaffolding/
    └── commands/ 
        └── Components.ts
```

```typescript
import {
  BaseCommand,
  FileConfig,
  Arg,
  RunnableArgs,
  renderTemplate,
} from 'angel-manager';

export default class Components extends BaseCommand {
  /**
   * O nome do comando, que será utilizado para executá-lo
   */
  public commandName = 'make:component';

  /**
   * Descrição do comando
   */
  public description = 'Cria um novo componente';

  /**
   * Caminho do template Liquid, relativo a scaffolding/architecture
   */
  public templatePath = 'components';

  /**
   * Caminho de destino para o arquivo gerado, relativo a src
   */
  public destinationPath = 'components';

  public file: FileConfig = {
    // Define nome do arquivo gerado
    name: { argName: 'componentName', case: 'camel' },
    // A extensão do arquivo gerado
    extension: 'tsx',
    // Se verdadeiro, o código será gerado dentro de um diretório nomeado conforme o arquivo
    subDir: true,
  };

  /**
   *
   * @returns um array de argumentos representando os parâmetros
   * que serão solicitados pela linha de comando e disponibilizados no template
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

### Tabela de Tipos

| Tipo           | Propriedade | Descrição                                                                                                                                                                                                |
| -------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arg**        | `name`      | O nome do argumento que será solicitado pela linha de comando. Esse valor é utilizado para referenciar o parâmetro no código.                                                                            |
|                | `type`      | O tipo do argumento. Pode ser "number" ou "string", indicando o tipo de dado que será esperado do usuário.                                                                                               |
| **FileConfig** | `name`      | Define o nome do arquivo gerado. Pode ser uma string estática ou um objeto que utiliza um dos argumentos solicitados pela CLI e o formato de case (camel, kebab, snake, pascal) desejado. Também pode incluir a opção `plural` para transformar o valor no plural. |
|                | `extension` | Define a extensão do arquivo gerado (por exemplo, `.tsx`).                                                                                                                                               |
|                | `subDir`    | Se verdadeiro, o código será gerado dentro de um diretório com o mesmo nome do arquivo gerado.                                                                                                           |

### Método `run`

O método `run` é um método abstrato e assíncrono que executa a lógica do comando. Ele disponibiliza como argumento `args`, que são os parâmetros passados pelo usuário ao executar o comando. Dentro do método, o desenvolvedor tem a liberdade de definir a lógica de execução do comando da maneira que for necessária para o seu caso de uso.

No exemplo fornecido, a principal responsabilidade do método `run` é chamar a função `renderTemplate` e passar a si mesmo (`this`) e os argumentos (`args`) como parâmetros. A função `renderTemplate`, disponibilizada pelo **Angel Manager** será responsável por processar o template Liquid, substituindo os placeholders pelas variáveis definidas nos argumentos, e gerar o código de saída. O método `run` também inclui um bloco `try-catch` para capturar e tratar erros que possam ocorrer durante o processo de execução.


#### Método `renderTemplate`

O método assíncrono `renderTemplate`, disponibilizado pelo **Angel Manager**, é responsável por processar o template através da engine, utilizando os argumentos recebidos e os atributos estáticos. Ele gera o código de saída com base no template Liquid e nas configurações definidas.


| Argumento | Tipo           | Descrição                                                                                                                                                           |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command` | `BaseCommand`  | Instância do comando, utilizada para acessar os atributos estáticos do modelo e fornecer o contexto necessário para o processamento. Sendo passada dentro da classe através de ```this```                                |
| `args`    | `RunnableArgs` | Objeto que contém os argumentos passados ao comando. Ele inclui os parâmetros necessários para gerar o código. |

#### Método `includeRelated`

O método síncrono `includeRelated`, disponibilizado pelo **Angel Manager**, permite a inclusão de arquivos vazios relacionados ao código gerado. Este método é útil quando é necessário criar arquivos complementares, como arquivos de estilo ou testes, no mesmo diretório do código gerado.


| Argumento | Tipo           | Descrição                                                                                                                                                                                                         |
| --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command` | `BaseCommand`  | Instância do comando, utilizada para acessar os atributos estáticos do modelo e fornecer o contexto necessário para a inclusão dos arquivos relacionados.                                                         |
| `args`    | `RunnableArgs` | Objeto contendo os argumentos passados ao comando, utilizado para configurar o comportamento da inclusão.                                                                                                         |
| `files`   | `string[]`     | Array de strings que especifica as extensões dos arquivos relacionados a serem criados. Permite incluir, por exemplo, arquivos de estilo (`.css`) ou de testes (`.test.tsx`) no mesmo diretório do código gerado. |

## angel-managerrc.json

Este é o arquivo de configuração global do Angel Manager. Ele é utilizado para definir valores iniciais (default) para a construção dos modelos.

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

## Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, enviar pull requests ou sugerir melhorias para a documentação. 






