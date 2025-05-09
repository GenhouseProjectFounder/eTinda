import { Database } from 'bun:sqlite';

const db = new Database('eTinda.db', { create: true });

// Shop table with owner reference to User
db.exec('DROP TABLE IF EXISTS shop;');
db.exec(`CREATE TABLE shop (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  ownerId INTEGER NOT NULL REFERENCES user(id),
  location TEXT,
  category TEXT
);`);

// Product table with seller reference to User
db.exec('DROP TABLE IF EXISTS product;');
db.exec(`CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image TEXT,
  sellerId INTEGER NOT NULL REFERENCES user(id),
  stock INTEGER DEFAULT 0,
  category TEXT
);`);

// Order table with user and product references
db.exec('DROP TABLE IF EXISTS `order`;');
db.exec(`CREATE TABLE \`order\` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES user(id),
  productId INTEGER NOT NULL REFERENCES product(id),
  quantity INTEGER NOT NULL,
  orderDate TEXT NOT NULL,
  deliveryDate TEXT,
  status TEXT DEFAULT 'pending',
  trackingNumber TEXT
);`);

// User table with role enumeration
db.exec('DROP TABLE IF EXISTS user;');
db.exec(`CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  location TEXT,
  ePoints INTEGER DEFAULT 0,
  role TEXT CHECK(role IN ('buyer', 'seller', 'admin', 'marketing', 'guest')) NOT NULL
);`);

// Notification table with user reference
db.exec('DROP TABLE IF EXISTS notification;');
db.exec(`CREATE TABLE notification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES user(id),
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  orderId INTEGER REFERENCES \`order\`(id),
  productId INTEGER REFERENCES product(id)
);`);

export default db;
