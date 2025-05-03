import { serve } from 'bun';
import { getDb } from './db/db.js';

serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    if (path === '/') {
      path = '/index.html';
    }

    if (path === '/api/data') {
      const db = getDb();
      // Example query (replace with your actual query)
      const query = "SELECT 'Hello from SQLite!' as message;";
      try {
        const result = await new Promise((resolve, reject) => {
          db.get(query, (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error("Failed to execute query:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    let filePath = path.startsWith('/public') ? path.slice(7) : path;
    filePath = `public${filePath}`;

    try {
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        return new Response('File not found', { status: 404 });
      }
      const content = await file.text();
      let contentType = 'text/html';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      if (filePath.endsWith('.js')) contentType = 'text/javascript';
      return new Response(content, {
        headers: { 'Content-Type': contentType },
      });
    } catch (e) {
      return new Response('File not found', { status: 404 });
    }
  },
});
