import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from 'bun/sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize SQLite database
const db = new Database('db/database.sqlite');
db.run(`
  CREATE TABLE IF NOT EXISTS service (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_provider_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL
  )
`);

console.log('Starting server...');
try {
  const server = http.createServer((req, res) => {
    // Handle GET /user
    if (req.method === 'GET' && req.url === '/user') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User endpoint hit', user: { id: 1, username: 'testuser' } }));
      return;
    }

    // Handle /services endpoints
    if (req.url.startsWith('/services')) {
      const serviceId = req.url.split('/')[2];

      if (req.method === 'POST' && req.url === '/services') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { service_provider_id, name, description, price } = JSON.parse(body);
            db.run(
              `INSERT INTO service (service_provider_id, name, description, price) VALUES (?, ?, ?, ?)`,
              [service_provider_id, name, description, price],
              function (err) {
                if (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: err.message }));
                  return;
                }
                db.get(`SELECT * FROM service WHERE id = ?`, [this.lastID], (err, row) => {
                  if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: err.message }));
                    return;
                  }
                  res.writeHead(201, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(row));
                });
              }
            );
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
          }
        });
      } else if (req.method === 'GET' && serviceId) {
        db.get(`SELECT * FROM service WHERE id = ?`, [serviceId], (err, row) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
            return;
          }
          if (!row) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Service not found' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(row));
        });
      } else if (req.method === 'PUT' && serviceId) {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { service_provider_id, name, description, price } = JSON.parse(body);
            db.run(
              `UPDATE service SET service_provider_id = ?, name = ?, description = ?, price = ? WHERE id = ?`,
              [service_provider_id, name, description, price, serviceId],
              function (err) {
                if (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: err.message }));
                  return;
                }
                db.get(`SELECT * FROM service WHERE id = ?`, [serviceId], (err, row) => {
                  if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: err.message }));
                    return;
                  }
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(row));
                });
              }
            );
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
          }
        });
      } else if (req.method === 'DELETE' && serviceId) {
        db.run(`DELETE FROM service WHERE id = ?`, [serviceId], function (err) {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Service deleted' }));
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request' }));
      }
      return;
    }

    // Serve static files
    let filePath = path.join(__dirname, 'public', req.url);
    if (filePath === path.join(__dirname, 'public', '/')) {
      filePath = path.join(__dirname, 'public', 'index.html');
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
          fs.readFile(path.join(__dirname, '404.html'), (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
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