import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3002;
const mime = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.mjs':'application/javascript', '.mov':'video/mp4', '.mp4':'video/mp4', '.xml':'application/xml', '.txt':'text/plain' };
http.createServer((req,res)=>{
  let url = req.url === '/' ? '/index.html' : req.url;
  const fp = path.join(__dirname, url);
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[ext]||'application/octet-stream'});
    res.end(data);
  });
}).listen(PORT, () => console.log(`Summit Concrete site at http://localhost:${PORT}`));
