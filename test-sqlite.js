const Database = require('better-sqlite3');

// Open a database file. If it doesn't exist, it will be created
const db = new Database('test.db');

// Create a test table and insert a row
db.exec('CREATE TABLE IF NOT EXISTS greetings (message TEXT)');
db.exec('INSERT INTO greetings (message) VALUES ("Hello, World!")');

// Retrieve the message
const row = db.prepare('SELECT message FROM greetings LIMIT 1').get();
console.log(row.message); // Should print "Hello, World!"
