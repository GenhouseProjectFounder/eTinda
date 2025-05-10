import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { Database } from 'bun:sqlite'; // Database is not used for in-memory
import User from './resources/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT) || 3001;
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Not used in this simplified version

console.log('Starting server using Bun.serve...');

// const userResource = new User(); // Use in-memory storage - This will be instantiated inside fetch for simplicity or globally if preferred
let userResource; // Declare globally, instantiate once

try {
  userResource = new User(); // Instantiate User resource for in-memory storage

  Bun.serve({
    port: port,
    async fetch(req) {
      const url = new URL(req.url);
      const { method } = req;

      // Handle user routes
      if (url.pathname.startsWith('/user')) {
        if (method === 'GET') {
          const urlParts = url.pathname.split('/');
          const userId = urlParts.length > 2 ? urlParts[2] : null;
          
          // Simulate req.params for handleGet
          const mockReq = { params: { id: userId } };
          
          // handleGet expects (req, res) and writes to res.
          // We need to adapt this to return a Response object for Bun.serve
          try {
            let users;
            if (userId) {
              users = await userResource.findUserById(userId);
              if (!users) {
                return new Response(JSON.stringify({ error: 'User not found', status: 404 }), {
                  status: 404,
                  headers: { 'Content-Type': 'application/json' },
                });
              }
            } else {
              users = await userResource.getAllUsers();
            }
            return new Response(JSON.stringify({ status: 'success', data: users }), {
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (error) {
            console.error('GET /user error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error', status: 500, message: error.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
        // Add POST, PATCH, DELETE handlers here if needed, adapting them similarly
      }

      // Handle flashpost routes
      if (url.pathname.startsWith('/flashpost')) {
        if (method === 'GET') {
          // Basic GET /flashpost handler
          try {
            // Placeholder data or logic for flashposts
            const flashposts = [{ id: 1, content: 'This is a flashpost!', timestamp: new Date().toISOString() }];
            return new Response(JSON.stringify({ status: 'success', data: flashposts }), {
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (error) {
            console.error('GET /flashpost error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error', status: 500, message: error.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
        // Add other methods (POST, etc.) for /flashpost here if needed later
      }

      // Serve static files (simplified example, can be expanded)
      // This part needs careful implementation if all previous static file logic is required.
      // For now, let's focus on the /user endpoint.
      let filePath = path.join(__dirname, '..', 'public', url.pathname);
      if (url.pathname === '/') {
        filePath = path.join(__dirname, '..', 'public', 'index.html');
      }

      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          return new Response(file);
        }
      } catch (e) {
        // File serving error
      }
      
      return new Response("Not Found", { status: 404 });
    },
    error(error) {
      console.error("Bun.serve error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });

  console.log(`Server running at http://localhost:${port} using Bun.serve`);

} catch (error) {
  console.error('Server startup error:', error);
}
