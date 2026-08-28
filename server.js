const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  console.log(`[HTTP ${req.method}] ${req.url}`);
  let filePath = path.join(__dirname, reqUrl === '/' ? 'index.html' : reqUrl);

  fs.stat(filePath, (err, stats) => {
    // Se o arquivo não existir ou for diretório (como /goetia, /linkbio), entrega index.html para o SPA Router
    if (err || stats.isDirectory()) {
      filePath = path.join(__dirname, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Erro ao carregar arquivo.');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  ✦ SERVIDOR LOCAL ATIVO COM SUCESSO! ✦ `);
  console.log(`========================================`);
  console.log(`\nAbra seu navegador em:`);
  console.log(`👉 http://localhost:${PORT}/goetia`);
  console.log(`👉 http://localhost:${PORT}/linkbio`);
  console.log(`👉 http://localhost:${PORT}/ebooks`);
  console.log(`👉 http://localhost:${PORT}/\n`);
  console.log(`Pressione Ctrl+C para encerrar.`);
});
