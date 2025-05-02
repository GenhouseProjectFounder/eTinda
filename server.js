import { serve } from 'bun';

// Sample data (replace with database in production)
const products = [
  { id: 1, name: 'Organic Handwoven Basket', price: 500, image: '/images/sample-product.jpg' },
];

const users = [
  { id: 1, name: 'Maria Cruz', role: 'Buyer', status: 'Active' },
  { id: 2, name: 'Carlo Reyes', role: 'Seller', status: 'Pending' },
];

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Serve static files from public
    if (path === '/' || path.startsWith('/public') || path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js')) {
      let filePath = path === '/' ? 'public/index.html' : path.slice(1);
      try {
        const file = await Bun.file(filePath).text();
        const contentType = filePath.endsWith('.html') ? 'text/html' :
                           filePath.endsWith('.css') ? 'text/css' :
                           filePath.endsWith('.js') ? 'application/javascript' : 'text/plain';
        return new Response(file, { headers: { 'Content-Type': contentType } });
      } catch (e) {
        return new Response('File not found', { status: 404 });
      }
    }

    // API endpoints
    if (path === '/api/products') {
      return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/api/users' && req.method === 'GET') {
      return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path.startsWith('/api/users/') && req.method === 'POST') {
      const id = parseInt(path.split('/')[3]);
      const body = await req.json();
      const user = users.find(u => u.id === id);
      if (user) {
        user.status = body.status; // e.g., 'Active', 'Deactivated'
        return new Response(JSON.stringify(user), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('User not found', { status: 404 });
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log('Server running at http://localhost:3000');