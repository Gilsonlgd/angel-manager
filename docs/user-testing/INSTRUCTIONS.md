# Passo a Passo de Testes para o Angel Manager em Projeto React

### Instrução Geral
O objetivo da ferramenta não é criar o conteúdo das páginas, mas sim planejar módulos e gerar a estrutura base de novos componentes de maneira automatizada, evitando a criação manual de arquivos e diretórios na arquitetura do projeto, além de aproveitar da geração de código para realizar documentação e reforçar padrões de desenvolvimento utilizados.

## Dependências
Você precisará ter instalado em seu computador:
- Node.js
- Yarn

## Objetivos do Teste

### 1. Avaliação de Funcionalidade
O objetivo desta rodada de testes é **verificar se a ferramenta está funcionando corretamente**, garantindo que ela realize as funções previstas.

### 2. Avaliação de Valor
Além de verificar o funcionamento, buscamos **avaliar a utilidade da ferramenta** para desenvolvedores, observando seu impacto no processo de planejamento, modelagem, padronização, documentação e produtividade do projeto.

### 3. Formulário de avaliação
Ao final dos testes na ferramenta, de acordo com sua experiência, você pode responder o formulário avaliação abaixo:

---

## **Passo 1**: Criando um Projeto Vazio em React
1. Acesse o repositório modelo [React Example](https://github.com/Gilsonlgd/react-example).
2. Clique em "use this template" para criar um novo repositório a partir do template.
3. Clone o novo repositório para sua máquina.
4. No terminal, dentro da raiz do projeto, execute:

```bash
   yarn install
```

## **Passo 2**: Instalando o Angel Manager
1. No mesmo terminal, execute:

```bash
   yarn add -D angel-manager
```

2. Após a instalação, a **CLI** do Angel Manager estará disponível através do comando `npx angel`.
3. Normalmente, o comando `npx angel init` é usado iniciar a estrutura de diretório necessária para a construção do seu modelo. Porém neste processo de testagem utilizaremos um modelo pronto.

## **Passo 3**: Escolhendo um Modelo de Arquitetura
1. Visite a pasta de exemplos de arquitetura em [Exemplos de Arquiteturas](https://github.com/Gilsonlgd/angel-manager/tree/main/examples).
2. Para este projeto React, abra o diretório `react` e selecione o exemplo `MVC Architecture`, que é um modelo inspirado nos princípios MVC (Model, View, Controller) de arquitetura.
3. Baixe o diretório `scaffolding` disponível em `examples/react/mvc-architecture`. Para isso, cole o URL do diretório https://github.com/Gilsonlgd/angel-manager/tree/main/examples/react/mvc-architecture em [download-directory](https://download-directory.github.io/).
4. Extraia e cole o diretório `scaffolding` dentro da pasta `src` do seu projeto React.

   Agora você pode visualizar os novos comandos disponíveis, de acordo com o modelo inserido. Execute:

```bash
   npx angel
```

ou 

```bash
   npx angel -h
```

---

## **Passo a Passo para Testagem**

### 1. Inicializar a Arquitetura Modelada
   - Execute:

```bash
    npx angel apply
```

   - Isso inicializará os diretórios correspondentes aos módulos da arquitetura escolhida.

### 2. Criar Layouts de Usuário
   - O projeto inclui três tipos de acesso: público (public), administradores (admin) e trabalhadores (worker).
   - Execute o comandos a seguir para criar layouts para cada um:

```bash
    npx angel make:layout publicLayout
    npx angel make:layout adminLayout
    npx angel make:layout workerLayout
```
   - Verifique os arquivos gerados em `src/layout`.
   - No final dos arquivos gerados, haverá instruções marcadas com `@note`. Siga essas instruções para configurar corretamente o projeto.

### 3. Adicionar Estilização
   - Cada layout criado gerará também um arquivo CSS.
   - Adicione a seguinte classe CSS nos novos layouts para estilizar o conteúdo das páginas:

```css
    .page-content {
        position: relative;
        min-height: 100%;
        width: 100%;
        display: flex;
        background-color: #f5fbff;
    }
```

### 4. Criar Componentes Básicos
   - Para criar um novo componente, execute o comando:

```bash
    npx angel make:component baseButton
```

   - Os novos arquivos foram gerados em `src/components`.
   - Repita este comando para outros componentes desejados, como `modal`, `BaseInput`, `SelectInput` ou `BaseTable`.
   - Observe que o código gerado fornece apenas a estrutura base do componente, sem incluir lógica específica. No entanto, além de gerar código, o modelo construído insere comentários úteis e exemplos para declaração de props com o intuito de reforçar padrões utilizados e instruir o desenvolvedor.
   - Revise o código gerado. Ao final de cada arquivo, você encontrará um comentário com `@note`. Siga essas instruções para configurar corretamente os novos componentes.

### 5. Inicializar o Sistema de Rotas
   - Para cada nível de acesso, crie um arquivo de rotas:
   
```bash
    npx angel make:router public
    npx angel make:router admin
    npx angel make:router worker
```
   
   - Os novos arquivos foram gerados em `src/routes`.
   - Os arquivos de rotas gerados contêm exemplos de importação e definição de uma nova rota `/home`. Esses exemplos podem ser removidos, mas são úteis como referência para o próximo passo.
   - Ao final de cada arquivo, você encontrará um comentário com `@note`. Siga essas instruções para configurar corretamente o roteamento.

### 6. Criar Views para Cada Nível de Usuário
   - Crie views para cada tipo de usuário:

```bash
    npx angel make:admin-view dashboard
    npx angel make:worker-view tasks
    npx angel make:public-view home
```

   - Você pode importar componentes criados anteriormente em suas novas views. Para importar um componente, utilize:

```javascript
    import { SeuComponente } from '@/components';
```

   - Dashboard é criada em `src/views/admin`, Tasks em `src/views/worker` e Home em `src/views/public`.
   - Inclua a `dashboard` nas rotas de admin, `tasks` nas rotas de worker e a `home` nas rotas públicas, conforme o exemplo incluído nos arquivos de rotas.

### 7. Iniciar a Aplicação
   - Se todos os passos foram seguidos corretamente, inicialize a aplicação:

```bash
    yarn start
```
   - No terminal aparecerá um link. Abra-o.
   - Acesse as views criadas nas rotas configuradas.

## **Finalizamos os testes de funcionalidade!!**


---

## **Passo Final**: Avaliação de Valor da Ferramenta

### 1. Assista o vídeo que explica o processo de modelagem: [Vídeo](youtube.com)

### 2. Construção do Modelo de um Novo Módulo: `models`

Vamos criar um novo módulo chamado `models`, localizado em `src/models`. Este módulo terá como responsabilidade armazenar as declarações de tipos para cada entidade da aplicação. Além disso, cada entidade contará com sua própria classe, contendo métodos para comunicação com o banco de dados, tais como: `get(id)`, `index`, `delete(id)`, `post(entidade)`.

Abaixo está o exemplo de um **model** para a entidade `Admin`:

```typescript
import axios from 'axios';

// Definindo a interface que descreve a entidade Admin
export interface Admin {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

// Classe Admin com os métodos de comunicação com o banco de dados
export class AdminModel {
  // URL base fictícia do backend
  private static baseUrl = 'https://api.ficticia.com/admins';

  // Método para obter um Admin pelo ID
  static async get(id: number): Promise<Admin> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar o Admin com ID ${id}: ${error}`);
    }
  }

  // Método para listar todos os Admins
  static async index(): Promise<Admin[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao listar os Admins: ${error}`);
    }
  }

  // Método para excluir um Admin pelo ID
  static async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error(`Erro ao excluir o Admin com ID ${id}: ${error}`);
    }
  }

  // Método para criar um novo Admin
  static async post(admin: Admin): Promise<Admin> {
    try {
      const response = await axios.post(this.baseUrl, admin);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao criar o Admin: ${error}`);
    }
  }
}
```

### Passos para Construção do Modelo de `models`:

A seguir, apresento um passo a passo para a construção do novo módulo `models` da arquitetura. Este processo inclui orientações subjetivas para ajudá-lo a criar o modelo. Para apoiá-lo, disponibilizei um exemplo de modelagem em [docs/user-testing/models-example], que inclui o template e o arquivo `.ts` de definição do comando.

A fim de tornar a avaliação mais precisa e autêntica, peço que tente construir o modelo por conta própria, sem consultar o exemplo de imediato. No entanto, se encontrar dificuldades, sinta-se à vontade para consultar o material de apoio.

1. **Criação do Template de Models**:
   1. Crie um novo diretório em `src/scaffolding` chamado `models`.
   2. Dentro do diretório `src/scaffolding/models`, crie um novo arquivo de template.
   3. Caso tenha dúvidas sobre a sintaxe usada nos templates, consulte a documentação da template engine utilizada em [Liquid Engine](https://shopify.github.io/liquid/).
   4. Implemente o template com base no exemplo de código fornecido acima:
      - Copie o código do modelo `Admin` para o template.
      - Identifique quais partes são estáticas, ou seja, que se mantêm iguais em todas as instâncias de modelos.
      - Identifique as partes parametrizáveis, ou seja, que variam entre as instâncias e que podem ser passadas como argumento através da CLI, como por exemplo o nome da entidade.
      - Analise as partes que variam entre instâncias, mas não são parametrizáveis. Essas podem ser substituídas por exemplos ou documentação, conforme necessário.

2. **Criação de um Novo Comando para Processar o Modelo**:
   1. Execute o comando `npx angel create:command models` para gerar um novo arquivo de definição pré-estruturado.
   2. Se necessário, consulte a documentação da ferramenta [Angel Manager](https://www.npmjs.com/package/angel-manager#design-time-input-construction) para entender os parâmetros e como configurar o comando adequadamente.

3. **Testagem e Criação de Novos Models**:
   1. Após completar a modelagem do template e do comando, utilize-os para criar novos models e testar o funcionamento

## Formulário de Avaliação:
Após testar e utilizar a ferramenta, por favor, preencha o formulário de avaliação abaixo:

---
