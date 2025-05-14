# Como construir o MQL5 Editor para Windows

Este documento explica como construir o instalador do MQL5 Editor para Windows a partir do código-fonte.

## Pré-requisitos

- Node.js 18 ou superior
- npm
- Git
- Ambiente Windows para construir o instalador Windows

## Passos para Construção

### 1. Preparar o ambiente

Primeiro, clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/mql5-editor.git
cd mql5-editor
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL=postgresql://usuário:senha@localhost:5432/mql5editor
HF_API_TOKEN=seu_token_do_huggingface
```

### 3. Construir o projeto

Existem duas maneiras de construir o instalador:

#### Método A: Usando o script de construção

Execute o script de construção automatizado:

```bash
node build-instalador.js
```

Isso irá:
- Construir o frontend
- Construir o backend
- Empacotar com electron-builder

#### Método B: Construção manual

Ou você pode executar os comandos individualmente:

```bash
# Construir o frontend e o backend
npm run build

# Empacotar com electron-builder
npx electron-builder build --win --publish never
```

### 4. Localizar o instalador

Após a construção bem-sucedida, o instalador estará disponível na pasta `release/`:

- `MQL5-Editor-Setup.exe` - Instalador normal
- `MQL5Editor-Portable.exe` - Versão portátil (sem instalação)

## Solução de Problemas

### Erro na construção do instalador

Se você encontrar erros durante a construção do instalador:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se de que o Node.js está atualizado
3. Em sistemas Windows, pode ser necessário instalar ferramentas de construção:
   ```
   npm install --global windows-build-tools
   ```

### Erros de execução

Se o aplicativo não iniciar após a instalação:

1. Verifique se o banco de dados PostgreSQL está acessível
2. Certifique-se de que o token do Hugging Face é válido
3. Verifique os logs no diretório de instalação

## Personalização

Para personalizar o aplicativo antes da construção:

- Altere os ícones em `electron/icons/`
- Modifique as configurações em `electron-builder.json`
- Atualize informações da empresa em `package.json`

---

Se você encontrar algum problema não coberto neste guia, por favor reporte-o como uma issue no repositório do projeto.