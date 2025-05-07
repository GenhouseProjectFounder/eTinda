const dbPath = 'eTinda/db/etinda.sqlite';
export default dbPath;

// Table: user
// Columns: id (PK), username, email, created_at

// Table: site
// Columns: id (PK), name, location, created_at

// Table: service
// Columns: id (PK), name, duration, price, created_at

// Table: service_provider
// Columns: id (PK), name, created_at

// Table: booking
// Columns: id (PK), user_id (FK), site_id (FK), service_id (FK), service_provider_id (FK), date, created_at

// Table: login (to be implemented in Module 4)
// Columns: id (PK), user_id (FK), token, created_at
