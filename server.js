import { serve } from 'bun';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

serve({
    async fetch(req) { // Added async
        const url = new URL(req.url);
        // Default to index.html if the path is '/'
        let filePath = url.pathname === '/' ? 'public/index.html' : `public${url.pathname}`;

        try {
            const file = Bun.file(filePath);
            // Check if the file exists using await file.exists()
            if (!(await file.exists())) { // Changed this line
                return new Response('Not Found', { status: 404 });
            }

            // Determine the MIME type based on file extension
            const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            return new Response(file, {
                headers: {
                    'Content-Type': contentType,
                },
            });
        } catch (e) {
            console.error(`Error serving file: ${filePath}`, e);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
    port: 3000,
    hostname: 'localhost',
    error(error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    },
});

console.log('Server running at http://localhost:3000');
