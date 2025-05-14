const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Função para executar comandos com saída no console
function executeCommand(command, message) {
  console.log(`${colors.bright}${colors.cyan}==>${colors.reset} ${message}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.bright}${colors.green}✓${colors.reset} ${message} completo!\n`);
    return true;
  } catch (error) {
    console.error(`${colors.bright}${colors.red}✗${colors.reset} ${message} falhou: ${error.message}\n`);
    return false;
  }
}

// Função principal para construir o pacote
async function buildPackage() {
  console.log(`\n${colors.bright}${colors.cyan}===== Iniciando processo de construção do instalador Windows =====\n${colors.reset}`);
  
  // Verifica se a pasta electron/icons existe
  const iconsDir = path.join(__dirname, 'electron', 'icons');
  if (!fs.existsSync(iconsDir)) {
    console.log(`${colors.bright}${colors.yellow}⚠${colors.reset} Pasta de ícones não encontrada, criando...`);
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // Cópia o ícone padrão se ele não existir
  const iconPath = path.join(iconsDir, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    console.log(`${colors.bright}${colors.yellow}⚠${colors.reset} Ícone não encontrado, usando ícone padrão...`);
    // Aqui você pode adicionar código para copiar um ícone padrão, se necessário
    // ou criar um ícone básico usando canvas, etc.
  }
  
  // Adiciona tsconfig.server.json se não existir
  const tsconfigServerPath = path.join(__dirname, 'tsconfig.server.json');
  if (!fs.existsSync(tsconfigServerPath)) {
    console.log(`${colors.bright}${colors.yellow}⚠${colors.reset} tsconfig.server.json não encontrado, criando...`);
    const tsconfigServer = {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "module": "CommonJS",
        "outDir": "dist/server",
        "noEmit": false
      },
      "include": ["server/**/*"]
    };
    fs.writeFileSync(tsconfigServerPath, JSON.stringify(tsconfigServer, null, 2));
  }
  
  // Cria arquivo de licença se não existir
  const licensePath = path.join(__dirname, 'LICENSE');
  if (!fs.existsSync(licensePath)) {
    console.log(`${colors.bright}${colors.yellow}⚠${colors.reset} Arquivo LICENSE não encontrado, criando um básico...`);
    const licenseText = `MIT License\n\nCopyright (c) ${new Date().getFullYear()} MQL5 Editor\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;
    fs.writeFileSync(licensePath, licenseText);
  }

  // 1. Construir o frontend
  if (!executeCommand('npm run build', 'Construção do frontend')) {
    return;
  }

  // 2. Empacotar com electron-builder
  if (!executeCommand('npx electron-builder build --win --publish never', 'Empacotamento com electron-builder')) {
    return;
  }

  console.log(`\n${colors.bright}${colors.green}===== Construção concluída com sucesso! =====\n${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}Os instaladores podem ser encontrados na pasta ${colors.yellow}release/\n${colors.reset}`);
}

// Executar função principal
buildPackage().catch(console.error);