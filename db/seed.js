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

  // Users
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
    },
    {
      username: 'marketing_lead',
      email: 'marketing@etinda.com',
      password: hashPassword('marketingpass'),
      full_name: 'Marketing Lead',
      location: 'Makati',
      phone_number: '+63933445566',
      role: 'marketing',
      digital_literacy_level: 'advanced',
      account_created: generateDate(50)
    },
    {
      username: 'guest_browser',
      email: 'guest@example.com',
      password: hashPassword('guestpass'),
      full_name: 'Guest User',
      location: 'Davao City',
      phone_number: '+63955667788',
      role: 'guest',
      digital_literacy_level: 'beginner',
      account_created: generateDate(10)
    }
  ];

  // Shops
  const shops = [
    {
      name: 'Sustainable Crafts PH',
      description: 'Handmade eco-friendly crafts from local artisans',
      ownerId: 2,
      location: 'Cebu City',
      category: 'Handmade Crafts',
      sustainability_score: 4.5,
      eco_certifications: 'Local Artisan, Eco-Friendly Materials',
      contact_email: 'crafts@sustainableph.com'
    },
    {
      name: 'Green Harvest Market',
      description: 'Organic produce and sustainable food products',
      ownerId: 3,
      location: 'Quezon City',
      category: 'Organic Food',
      sustainability_score: 4.8,
      eco_certifications: 'Organic Certified, Fair Trade',
      contact_email: 'info@greenharvestmarket.com'
    },
    {
      name: 'Eco Threads',
      description: 'Sustainable and ethical clothing',
      ownerId: 4,
      location: 'Manila',
      category: 'Clothing',
      sustainability_score: 4.3,
      eco_certifications: 'Recycled Materials, Ethical Production',
      contact_email: 'support@ecothreads.ph'
    },
    {
      name: 'Natural Home Decor',
      description: 'Eco-friendly home decoration items',
      ownerId: 2,
      location: 'Davao City',
      category: 'Home Decor',
      sustainability_score: 4.6,
      eco_certifications: 'Locally Sourced, Biodegradable',
      contact_email: 'decor@naturalhome.ph'
    },
    {
      name: 'Zero Waste Essentials',
      description: 'Sustainable lifestyle products',
      ownerId: 3,
      location: 'Makati',
      category: 'Lifestyle',
      sustainability_score: 4.7,
      eco_certifications: 'Plastic-Free, Carbon Neutral',
      contact_email: 'info@zerowasteessentials.com'
    }
  ];

  // Products
  const products = [
    {
      title: 'Bamboo Weave Basket',
      description: 'Handwoven bamboo basket made by local artisans',
      price: 350.00,
      sellerId: 2,
      shopId: 1,
      stock: 50,
      category: 'Home Decor',
      sustainability_tags: 'Handmade, Natural Materials',
      origin_location: 'Cebu',
      materials: 'Bamboo',
      date_added: generateDate(20)
    },
    {
      title: 'Organic Coffee Beans',
      description: 'Locally grown, organic coffee beans',
      price: 250.00,
      sellerId: 3,
      shopId: 2,
      stock: 100,
      category: 'Food',
      sustainability_tags: 'Organic, Fair Trade',
      origin_location: 'Benguet',
      materials: 'Coffee Beans',
      date_added: generateDate(15)
    },
    {
      title: 'Recycled Cotton T-Shirt',
      description: 'Eco-friendly t-shirt made from recycled cotton',
      price: 500.00,
      sellerId: 4,
      shopId: 3,
      stock: 75,
      category: 'Clothing',
      sustainability_tags: 'Recycled Materials, Ethical Production',
      origin_location: 'Manila',
      materials: 'Recycled Cotton',
      date_added: generateDate(25)
    },
    {
      title: 'Coconut Shell Candle Holder',
      description: 'Decorative candle holder made from upcycled coconut shells',
      price: 200.00,
      sellerId: 2,
      shopId: 4,
      stock: 60,
      category: 'Home Decor',
      sustainability_tags: 'Upcycled, Natural Materials',
      origin_location: 'Davao',
      materials: 'Coconut Shell',
      date_added: generateDate(10)
    },
    {
      title: 'Reusable Bamboo Straw Set',
      description: 'Set of 5 reusable bamboo straws with cleaning brush',
      price: 150.00,
      sellerId: 3,
      shopId: 5,
      stock: 200,
      category: 'Lifestyle',
      sustainability_tags: 'Zero Waste, Plastic-Free',
      origin_location: 'Makati',
      materials: 'Bamboo',
      date_added: generateDate(5)
    }
  ];

  // Order Masters
  const orderMasters = [
    {
      userId: 1,
      orderDate: generateDate(5),
      total_price: 850.00,
      status: 'delivered',
      shipping_method: 'Standard Shipping',
      payment_method: 'Credit Card',
      payment_status: 'paid',
      delivery_location: 'Quezon City'
    },
    {
      userId: 1,
      orderDate: generateDate(15),
      total_price: 500.00,
      status: 'processing',
      shipping_method: 'Express Shipping',
      payment_method: 'PayPal',
      payment_status: 'paid',
      delivery_location: 'Quezon City'
    },
    {
      userId: 4,
      orderDate: generateDate(10),
      total_price: 650.00,
      status: 'shipped',
      shipping_method: 'Standard Shipping',
      payment_method: 'Debit Card',
      payment_status: 'paid',
      delivery_location: 'Makati'
    },
    {
      userId: 5,
      orderDate: generateDate(20),
      total_price: 350.00,
      status: 'pending',
      shipping_method: 'Standard Shipping',
      payment_method: 'Cash on Delivery',
      payment_status: 'unpaid',
      delivery_location: 'Davao City'
    },
    {
      userId: 3,
      orderDate: generateDate(25),
      total_price: 750.00,
      status: 'delivered',
      shipping_method: 'Express Shipping',
      payment_method: 'Bank Transfer',
      payment_status: 'paid',
      delivery_location: 'Manila'
    }
  ];

  // Order Details (3 per Order Master)
  const orderDetails = [];
  orderMasters.forEach((order, index) => {
    const products = [
      { productId: 1, quantity: 2, unit_price: 350.00 },
      { productId: 2, quantity: 1, unit_price: 250.00 },
      { productId: 3, quantity: 1, unit_price: 500.00 }
    ];

    products.forEach(product => {
      orderDetails.push({
        orderId: index + 1,
        productId: product.productId,
        quantity: product.quantity,
        unit_price: product.unit_price,
        subtotal: product.quantity * product.unit_price,
        status: 'pending'
      });
    });
  });

  // Notifications
  const notifications = [
    {
      userId: 1,
      message: 'Your order #1 has been delivered',
      timestamp: generateDate(5),
      type: 'order',
      orderId: 1,
      severity: 'low'
    },
    {
      userId: 2,
      message: 'Low stock alert for Bamboo Weave Basket',
      timestamp: generateDate(10),
      type: 'low_stock',
      productId: 1,
      severity: 'high'
    },
    {
      userId: 3,
      message: 'New promotional offer available',
      timestamp: generateDate(15),
      type: 'promo',
      severity: 'medium'
    },
    {
      userId: 4,
      message: 'Your order #3 is now shipped',
      timestamp: generateDate(10),
      type: 'order',
      orderId: 3,
      severity: 'low'
    },
    {
      userId: 5,
      message: 'Welcome to eTinda!',
      timestamp: generateDate(1),
      type: 'system',
      severity: 'low'
    }
  ];

  // Insert Users
  const userStmt = db.prepare(`
    INSERT INTO user (
      username, email, password, full_name, location, 
      phone_number, role, digital_literacy_level, account_created
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  users.forEach(user => {
    userStmt.run(
      user.username, user.email, user.password, user.full_name, 
      user.location, user.phone_number, user.role, 
      user.digital_literacy_level, user.account_created
    );
  });

  // Insert Shops
  const shopStmt = db.prepare(`
    INSERT INTO shop (
      name, description, ownerId, location, category, 
      sustainability_score, eco_certifications, contact_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  shops.forEach(shop => {
    shopStmt.run(
      shop.name, shop.description, shop.ownerId, shop.location, 
      shop.category, shop.sustainability_score, 
      shop.eco_certifications, shop.contact_email
    );
  });

  // Insert Products
  const productStmt = db.prepare(`
    INSERT INTO product (
      title, description, price, sellerId, shopId, stock, 
      category, sustainability_tags, origin_location, 
      materials, date_added
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  products.forEach(product => {
    productStmt.run(
      product.title, product.description, product.price, 
      product.sellerId, product.shopId, product.stock, 
      product.category, product.sustainability_tags, 
      product.origin_location, product.materials, 
      product.date_added
    );
  });

  // Insert Order Masters
  const orderMasterStmt = db.prepare(`
    INSERT INTO order_master (
      userId, orderDate, total_price, status, 
      shipping_method, payment_method, payment_status, 
      delivery_location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  orderMasters.forEach(order => {
    orderMasterStmt.run(
      order.userId, order.orderDate, order.total_price, 
      order.status, order.shipping_method, order.payment_method, 
      order.payment_status, order.delivery_location
    );
  });

  // Insert Order Details
  const orderDetailStmt = db.prepare(`
    INSERT INTO order_detail (
      orderId, productId, quantity, unit_price, 
      subtotal, status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  orderDetails.forEach(detail => {
    orderDetailStmt.run(
      detail.orderId, detail.productId, detail.quantity, 
      detail.unit_price, detail.subtotal, detail.status
    );
  });

  // Insert Notifications
  const notificationStmt = db.prepare(`
    INSERT INTO notification (
      userId, message, timestamp, type, 
      orderId, productId, severity
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  notifications.forEach(notification => {
    notificationStmt.run(
      notification.userId, notification.message, 
      notification.timestamp, notification.type, 
      notification.orderId || null, 
      notification.productId || null, 
      notification.severity
    );
  });

  console.log('Database seeded successfully');
  db.close();
}

// If this script is run directly
if (import.meta.main) {
  seedDatabase();
}

export default seedDatabase;
