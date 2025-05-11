import { Database } from "bun:sqlite";

const db = new Database("test.db");

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
db.run("INSERT INTO users (name) VALUES (?)", ["Alice"]);
db.run("INSERT INTO users (name) VALUES (?)", ["Bob"]);

console.log("Database initialized with sample users.");
