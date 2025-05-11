// database.ts
import { Database } from 'bun:sqlite';

const db = new Database('tasks.db', { create: true });
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL
  )
`);

export default db;
