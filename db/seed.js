import { Database } from 'bun:sqlite';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function seedDatabase() {
  const db = new Database('eTinda.sqlite', { create: true });

  // Create tables if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      location TEXT,
      phone_number TEXT,
      profile_picture TEXT,
      ePoints INTEGER DEFAULT 0,
      total_purchases REAL DEFAULT 0,
      role TEXT CHECK(role IN ('buyer', 'seller', 'admin', 'marketing', 'guest')) NOT NULL,
      digital_literacy_level TEXT CHECK(digital_literacy_level IN ('beginner', 'intermediate', 'advanced')),
      accessibility_needs TEXT,
      last_login TEXT,
      account_created TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT 0,
      third_party_login TEXT
    )
  `);

  // Users data
  const users = [
    {
      username: 'eco_buyer1',
      email: 'maria.cruz@example.com',
      password: hashPassword('securepass123'),
      full_name: 'Maria Cruz',
      location: 'Quezon City',
      phone_number: '+63912345678',
      role: 'buyer',
      digital_literacy_level: 'beginner',
      account_created: generateDate(30)
    },
    {
      username: 'craft_seller1',
      email: 'carlo.reyes@example.com',
      password: hashPassword('artisan2023'),
      full_name: 'Carlo Reyes',
      location: 'Cebu City',
      phone_number: '+63987654321',
      role: 'seller',
      digital_literacy_level: 'intermediate',
      account_created: generateDate(45)
    },
    {
      username: 'admin_etinda',
      email: 'admin@etinda.com',
      password: hashPassword('adminpass'),
      full_name: 'eTinda Admin',
      location: 'Manila',
      phone_number: '+63911223344',
      role: 'admin',
      digital_literacy_level: 'advanced',
      account_created: generateDate(60)
    }
  ];

  // Prepare insert statement
  const insertUser = db.prepare(`
    INSERT INTO user (
      username, email, password, full_name, location, 
      phone_number, role, digital_literacy_level, account_created
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Begin a transaction
  const insertUsers = db.transaction((users) => {
    for (const user of users) {
      insertUser.run(
        user.username, 
        user.email, 
        user.password, 
        user.full_name, 
        user.location, 
        user.phone_number, 
        user.role, 
        user.digital_literacy_level, 
        user.account_created
      );
    }
  });

  // Execute the transaction
  insertUsers(users);

  console.log('Database seeded successfully');
  db.close();
}

// If this script is run directly
if (import.meta.main) {
  seedDatabase();
}

export default seedDatabase;
