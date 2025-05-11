// index.ts
import { serve } from 'bun';
import db from './database';
import { readdir, readFile } from 'node:fs/promises';

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (method === 'GET' && url.pathname === '/tasks') {
      const tasks = db.query('SELECT * FROM tasks').all();
      return new Response(JSON.stringify(tasks), { headers });
    }

    if (method === 'POST' && url.pathname === '/tasks') {
      const body = await req.json();
      const { task } = body;
      if (!task) {
        return new Response(JSON.stringify({ error: 'Task is required' }), { status: 400, headers });
      }
      db.run('INSERT INTO tasks (task) VALUES (?)', [task]);
      return new Response(JSON.stringify({ message: 'Task added' }), { status: 201, headers });
    }

    if (method === 'PUT' && url.pathname.startsWith('/tasks/')) {
      const id = url.pathname.split('/')[2];
      const body = await req.json();
      const { task } = body;
      if (!task) {
        return new Response(JSON.stringify({ error: 'Task is required' }), { status: 400, headers });
      }
      const result = db.run('UPDATE tasks SET task = ? WHERE id = ?', [task, id]);
      if (result.changes === 0) {
        return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers });
      }
      return new Response(JSON.stringify({ message: 'Task updated' }), { headers });
    }

    if (method === 'DELETE' && url.pathname.startsWith('/tasks/')) {
      const id = url.pathname.split('/')[2];
      const result = db.run('DELETE FROM tasks WHERE id = ?', [id]);
      if (result.changes === 0) {
        return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers });
      }
      return new Response(JSON.stringify({ message: 'Task deleted' }), { headers });
    }

    // New endpoint for processing tasks from a folder
    if (method === 'POST' && url.pathname === '/tasks/from-folder') {
      const folderPath = './tasks'; // Specify the folder path
      try {
        const files = await readdir(folderPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
          return new Response(JSON.stringify({ error: 'No JSON files found in the folder' }), { status: 404, headers });
        }

        for (const file of jsonFiles) {
          const filePath = `${folderPath}/${file}`;
          const fileContent = await readFile(filePath, 'utf8');
          try {
            const taskData = JSON.parse(fileContent);
            if (taskData && taskData.task) {
              db.run('INSERT INTO tasks (task) VALUES (?)', [taskData.task]);
            } else {
              console.error(`Invalid task data in ${file}`);
            }
          } catch (parseError) {
            console.error(`Error parsing JSON from ${file}:`, parseError);
          }
        }

        return new Response(JSON.stringify({ message: 'Tasks added from folder' }), { headers });
      } catch (error) {
        console.error('Error reading folder:', error);
        return new Response(JSON.stringify({ error: 'Failed to read folder' }), { status: 500, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  },
});
