const mysql = require('mysql2/promise');

// Configuration de la base de données
const cnx = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'c22851',
  database: 'gestion_commandes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = cnx;
