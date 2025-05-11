import { Database } from 'bun:sqlite';

const db = new Database('eTinda.sqlite', { create: true });

// User table with expanded roles and additional fields
db.exec('DROP TABLE IF EXISTS user;');
db.exec(`CREATE TABLE user (
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
);`);

// Shop table with additional details for sustainability and location
db.exec('DROP TABLE IF EXISTS shop;');
db.exec(`CREATE TABLE shop (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  ownerId INTEGER NOT NULL REFERENCES user(id),
  location TEXT,
  category TEXT,
  sustainability_score REAL DEFAULT 0,
  eco_certifications TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  social_media_links TEXT,
  banner_image TEXT,
  is_active BOOLEAN DEFAULT 1
);`);

// Product table with expanded sustainability and tracking features
db.exec('DROP TABLE IF EXISTS product;');
db.exec(`CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image TEXT,
  additional_images TEXT,
  sellerId INTEGER NOT NULL REFERENCES user(id),
  shopId INTEGER REFERENCES shop(id),
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  category TEXT,
  subcategory TEXT,
  sustainability_tags TEXT,
  eco_certification TEXT,
  carbon_footprint REAL,
  origin_location TEXT,
  manufacturing_process TEXT,
  materials TEXT,
  weight REAL,
  dimensions TEXT,
  is_active BOOLEAN DEFAULT 1,
  date_added TEXT NOT NULL,
  last_updated TEXT
);`);

// Order table - contains overall order information
db.exec('DROP TABLE IF EXISTS "order";');
db.exec(`CREATE TABLE "order" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES user(id),
  orderDate TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_method TEXT,
  shipping_cost REAL,
  payment_method TEXT,
  payment_status TEXT CHECK(payment_status IN ('unpaid', 'paid', 'refunded')),
  estimated_delivery_date TEXT,
  delivery_location TEXT,
  invoice_number TEXT,
  special_instructions TEXT,
  trackingNumber TEXT
);`);

// Order Detail table - contains individual products within an order
db.exec('DROP TABLE IF EXISTS order_detail;');
db.exec(`CREATE TABLE order_detail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER NOT NULL REFERENCES "order"(id),
  productId INTEGER NOT NULL REFERENCES product(id),
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  status TEXT CHECK(status IN ('pending', 'shipped', 'delivered', 'returned')),
  product_snapshot TEXT
);`);

// Notification table with more detailed categorization
db.exec('DROP TABLE IF EXISTS notification;');
db.exec(`CREATE TABLE notification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES user(id),
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('product', 'order', 'promo', 'system', 'low_stock', 'sale')),
  is_read BOOLEAN DEFAULT 0,
  action_url TEXT,
  orderId INTEGER REFERENCES "order"(id),
  productId INTEGER REFERENCES product(id),
  severity TEXT CHECK(severity IN ('low', 'medium', 'high'))
);`);

export default db;
