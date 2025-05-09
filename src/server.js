import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('Starting server...');
try {
  const server = http.createServer((req, res) => {
    // Handle GET /user
    if (req.method === 'GET' && req.url === '/user') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User endpoint hit', user: { id: 1, username: 'testuser' } }));
      return;
    }

    // Services endpoint not implemented
    if (req.url.startsWith('/services')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Services endpoint not implemented' }));
      return;
    }

    // Serve static files
    let filePath = path.join(__dirname, '..', 'public', req.url);
    if (filePath === path.join(__dirname, '..', 'public', '/')) {
      filePath = path.join(__dirname, '..', 'public', 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // Assuming 404.html would be in the public directory as well
          fs.readFile(path.join(__dirname, '..', 'public', '404.html'), (err, errorPageContent) => {
            if (err) { // If 404.html is also not found, send a generic 404
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(errorPageContent, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end(`Sorry, check with the site admin for error: ${error.code} ..`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} catch (error) {
  console.error('Server error:', error);
}
