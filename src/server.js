import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from 'bun:sqlite';
import User from './resources/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT) || 3001;

console.log('Starting server using Bun.serve...');

// Initialize database
const db = new Database('eTinda.sqlite', { create: true });

// Initialize resources
const userResource = new User(db);

Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);
    const { method } = req;

    // Handle user routes
    if (url.pathname.startsWith('/user')) {
      const urlParts = url.pathname.split('/');
      const userId = urlParts.length > 2 ? urlParts[2] : null;

      try {
        if (method === 'GET') {
          const mockReq = { params: { id: userId } };
          const mockRes = {
            writeHead: (status, headers) => {
              this.status = status;
              this.headers = headers;
            },
            end: (body) => {
              this.body = body;
            }
          };

          await userResource.handleGet(mockReq, mockRes);
          
          return new Response(this.body, {
            status: this.status,
            headers: this.headers
          });
        }

        if (method === 'POST') {
          const body = await req.text();
          const mockReq = { method, url: url.pathname, body };
          const mockRes = {
            writeHead: (status, headers) => {
              this.status = status;
              this.headers = headers;
            },
            end: (body) => {
              this.body = body;
            }
          };

          await userResource.handlePost(mockReq, mockRes);
          
          return new Response(this.body, {
            status: this.status,
            headers: this.headers
          });
        }

        if (method === 'PATCH') {
          const body = await req.text();
          const mockReq = { method, url: url.pathname, body };
          const mockRes = {
            writeHead: (status, headers) => {
              this.status = status;
              this.headers = headers;
            },
            end: (body) => {
              this.body = body;
            }
          };

          await userResource.handlePatch(mockReq, mockRes);
          
          return new Response(this.body, {
            status: this.status,
            headers: this.headers
          });
        }

        if (method === 'DELETE') {
          const mockReq = { method, url: url.pathname };
          const mockRes = {
            writeHead: (status, headers) => {
              this.status = status;
              this.headers = headers;
            },
            end: (body) => {
              this.body = body;
            }
          };

          await userResource.handleDelete(mockReq, mockRes);
          
          return new Response(this.body, {
            status: this.status,
            headers: this.headers
          });
        }
      } catch (error) {
        console.error('User route error:', error);
        return new Response(JSON.stringify({ 
          error: 'Internal server error', 
          status: 500, 
          message: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve static files
    let filePath = path.join(__dirname, '..', 'public', url.pathname);
    if (url.pathname === '/') {
      filePath = path.join(__dirname, '..', 'public', 'html', 'index.html');
    }

    try {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    } catch (e) {
      console.error('File serving error:', e);
    }
    
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Bun.serve error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`Server running at http://localhost:${port} using Bun.serve`);
