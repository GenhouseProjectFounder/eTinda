const initSqlJs = require('sql.js');

async function loadDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  const db = new SQL.Database();
  console.log('Connected to the eTinda database.');
  return db;
}

let db;
loadDatabase().then(database => {
  db = database;
});

module.exports = {
  getDb: () => db,
  loadDatabase
};
