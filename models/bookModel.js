const pool = require("../config/database");

const Book = {
  async getAllBooks() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT books.id, books.title, books.author, genres.name AS genre FROM books JOIN genres ON books.genre_id = genres.id"
      );
      return rows;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  async getBooksByGenre(genreName) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT books.id, books.title, books.author FROM books JOIN genres ON books.genre_id = genres.id WHERE genres.name = ?",
        [genreName]
      );
      return rows;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  addNewBook: async (title, author, genreId) => {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO books (title, author, genre_id) VALUES (?, ?, ?)",
      [title, author, genreId]
    );
    conn.release();
    return { id: result.insertId }; // Retorna el ID del libro recién agregado
  },

  checkIfBookIsSaved: async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM user_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      return rows; // Regresa las filas encontradas
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      throw new Error("Error al verificar si el libro está guardado.");
    } finally {
      conn.release();
    }
  },

  saveBookLikeStatus: async (userId, bookId, liked) => {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO user_books (user_id, book_id, liked) VALUES (?, ?, ?)",
      [userId, bookId, liked]
    );
    conn.release();
  },

  saveBooksForUser: async (userId, bookId) => {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        "INSERT INTO users_books (user_id, book_id) VALUES (?, ?)",
        [userId, bookId]
      );
    } catch (error) {
      console.error("Error al guardar el libro en la base de datos:", error);
      throw error; // Propagar el error
    } finally {
      conn.release(); // Asegúrate de liberar la conexión
    }
  },

  async getSaveBooksForUser(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT books.id, books.title, books.author, genres.name AS genre FROM books JOIN users_books ON books.id = users_books.book_id JOIN genres ON books.genre_id = genres.id WHERE users_books.user_id = ?",
        [userId]
      );
      conn.release();
      return rows;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },
};

module.exports = Book;
