import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';

function wipeDatabase() {
  // Path to the SQLite database file
  const dbPath = path.join(__dirname, 'eTinda.sqlite');

  try {
    // Check if the database file exists
    if (fs.existsSync(dbPath)) {
      // Delete the existing database file
      fs.unlinkSync(dbPath);
      console.log('Database file deleted successfully.');
    }

    // Create a new database connection
    const db = new Database('eTinda.sqlite', { create: true });

    // List of tables to drop (in case the file wasn't completely deleted)
    const tables = [
      'user', 
      'shop', 
      'product', 
      'order_master', 
      'order_detail', 
      'notification'
    ];

    // Drop all tables if they exist
    tables.forEach(table => {
      db.exec(`DROP TABLE IF EXISTS ${table};`);
    });

    console.log('All tables have been dropped.');

    // Close the database connection
    db.close();

    return true;
  } catch (error) {
    console.error('Error wiping database:', error);
    return false;
  }
}

// If this script is run directly
if (import.meta.main) {
  wipeDatabase();
}

export default wipeDatabase;
