const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "bibliotecaweb",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 5,
  bigIntAsNumber: true,
});

module.exports = pool;
