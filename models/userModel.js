const pool = require("../config/database");

const User = {
  async createUser(username, password) {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password]
      );
      return result;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  async findUserByUsername(username) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      return rows[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  async getUserProfile(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, username AS name FROM users WHERE id = ?",
        [userId]
      ); // Asegúrate que 'username' sea el campo correcto
      return rows[0]; // Regresar el primer usuario encontrado
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = User;
