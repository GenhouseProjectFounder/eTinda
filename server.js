import { serve } from 'bun';

serve({
  port: 3002,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    if (path === '/') {
      path = '/index.html';
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
      return new Response(content, {
        headers: { 'Content-Type': contentType },
      });
    } catch (e) {
      return new Response('File not found', { status: 404 });
    }
  },
});
