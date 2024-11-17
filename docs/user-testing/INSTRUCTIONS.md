# Passo a Passo de Testes para o Angel Manager
Antes de começar os testes, assista o vídeo disponibilizado de introdução ao Angel Manager.

Ele é **rapidinho**, em **menos de três minutos** você entenderá um pouco melhor a motivação e o objetivo da ferramenta.

[🎥 Vídeo curtinho de introdução 🎥]()

Assistido? Vamos seguir em frente então!

## Dependências
Você precisará ter instalado em seu computador:
- Git
- Node.js
- Yarn

## 🔧 Criando o ambiente de testes 🔧:
### **Passo 1**: Clonando um template de projeto em React.
1. Abra um terminal no diretório de sua escolha.
2. Para clonar o template de projeto, execute:
```bash
   git clone https://github.com/Gilsonlgd/react-example.git
```
3. Acesse o novo diretório:
```bash
   cd react-example
```
4. Instale todas a dependências do projeto:

Esse passo pode demorar um pouquinho, então pegue um cafézinho ☕ enquanto isso 😊!

```bash
   yarn install
```

### **Passo 2**: Instalando o Angel Manager
1. Para instalar o Angel Manager em seu projeto, execute:

```bash
   yarn add -D angel-manager
```

2. Após a instalação, a **CLI** do Angel Manager estará disponível através do comando `npx angel`.

### **Passo 3**: Importando um Modelo de Arquitetura
1. Em [Exemplos de Arquiteturas](https://github.com/Gilsonlgd/angel-manager/tree/main/examples), disponibilizamos alguns modelos de arquitetura pré-construídos.
2. Para este exemplo, utilizaremos o modelo `MVC Architecture`.
3. Para importar o modelo citado diretamente em seu projeto, execute:

Linux:
```bash
   curl -o src/scaffolding.zip https://raw.githubusercontent.com/Gilsonlgd/angel-manager/main/examples/react/mvc-architecture/scaffolding.zip
   unzip src/scaffolding.zip -d src
   rm src/scaffolding.zip
```

Windows:
```bash
   curl -o "src\scaffolding.zip" https://raw.githubusercontent.com/Gilsonlgd/angel-manager/main/examples/react/mvc-architecture/scaffolding.zip
   Expand-Archive -Path "src\scaffolding.zip" -DestinationPath "src"
   Remove-Item "src\scaffolding.zip"
```

- O modelo importado corresponde ao diretório **"src/scaffolding"** criado. 
- **Agora você pode visualizar os novos comandos disponíveis, de acordo com o modelo importado. Execute:**

```bash
   npx angel -h
```
---

## **🔬 Testagem 🔬**
- Agora começam efetivamente os testes com o Angel Manager.
- Siga os passos a seguir para construirmos um projeto de acordo com o modelo utilizado.

### 1. Aplicando o modelo importado
- Execute:

```bash
   npx angel apply
```

- Isso **inicializará os principais diretórios da arquitetura**.

### 2. Criar Layouts de Usuário
- O projeto inclui 2 tipos de acesso: administradores (admin) e trabalhadores (worker).
- Execute o comandos a seguir para criar layouts base de cada um:

```bash
    npx angel make:layout adminLayout
    npx angel make:layout workerLayout
```
- **Importante:** No final dos arquivos gerados, haverá instruções marcadas com `@important`. Siga essas instruções para configurar corretamente o projeto.

### 3. Adicionar Estilização
- Cada layout criado gerará também um arquivo CSS.
- Adicione a seguinte classe CSS nesses arquivos para estilizar o conteúdo das páginas:

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
 - Para criar um novo componente de nome **BaseButton**, execute o comando:

```bash
    npx angel make:component baseButton
```

- Os novos arquivos foram gerados em `src/components`.
- Repita este comando para outros dois novos componentes: `modal`, `BaseInput`.
- **Importante:** No final dos arquivos gerados, haverá instruções marcadas com `@important`. Siga essas instruções para configurar corretamente o projeto.

### 5. Inicializar o Sistema de Rotas
- Para cada nível de acesso, crie um arquivo de rotas:
   
```bash
    npx angel make:router admin
    npx angel make:router worker
```
   
- Os novos arquivos foram gerados em `src/routes`.
- **Importante:** No final dos arquivos gerados, haverá instruções marcadas com `@important`. Siga essas instruções para configurar corretamente o projeto.

### 6. Criar novas views
- Crie views (páginas) para cada tipo de usuário:

```bash
   npx angel make:admin-view dashboard
   npx angel make:worker-view tasks
```

- Dashboard é criada em `src/views/admin` e Tasks em `src/views/worker`.
- **Importante:** No final dos arquivos gerados, haverá instruções marcadas com `@important`. Siga essas instruções para configurar corretamente o projeto.

### 7. Iniciar a Aplicação
- Se todos os passos foram seguidos corretamente, inicialize a aplicação:

```bash
   yarn start
```
- No terminal aparecerá um link. Abra-o.
- Acesse as views criadas nas rotas configuradas para verificar sua funcionalidade.
- **🎉 Finalizamos os testes!! 🎉**

---

# Para terminar, uma introdução à modelagem 🗺️:
- Até agora, usamos o Angel Manager com um modelo pré-definido.
- Porém, o Angel Manager é totalmente **customizável**: templates e comandos podem ser criados e ajustados conforme a necessidade do seu projeto e estrutura desejada.
- Veja o **vídeo abaixo** para entender melhor como funciona o processo de modelagem e definição de comandos.
- (Esse vídeo também é curto, prometo 😄)

[🎥 Vídeo curtinho sobre modelagem 🎥]()

# Formulário de Avaliação:
Por fim, após testar e utilizar a ferramenta, por favor, preencha o formulário de avaliação abaixo:

[📝 Formulário de avaliação 📝](https://docs.google.com/forms/d/e/1FAIpQLSdHYcbOCzMyGmM87B4B-o8fRz5k7mSWxdO7isO3Csi7T9zGpA/viewform?usp=sf_link)

---
