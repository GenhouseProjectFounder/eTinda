const server = Bun.serve({
  port: 3001, // use port 3001 to avoid conflicts
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = './public' + url.pathname;

    // Serve index.html for the root path
    if (url.pathname === '/' || url.pathname === '') {
      filePath = './public/index.html';
    }

    try {
      const file = Bun.file(filePath);
      const contentType = getContentType(filePath);
      return new Response(file, {
        headers: { 'Content-Type': contentType }
      });
    } catch (e) {
      return new Response('File not found', { status: 404 });
    }
  },
});

function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.js')) return 'text/javascript';
  return 'text/plain';
}

console.log(`eTinda server running at http://localhost:${server.port}`);
