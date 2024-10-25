const Book = require("../models/bookModel");
const db = require("../config/database");

const bookController = {
  async listBooks(req, res) {
    try {
      const books = await Book.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },

  async listBooksByGenre(req, res) {
    const { genre } = req.params;
    try {
      const books = await Book.getBooksByGenre(genre);
      res.json(books);
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },

  async saveNewBook(req, res) {
    console.log("Datos recibidos:", req.body);
    const { title, author, genre } = req.body;

    // Validar datos requeridos
    if (!title || !author || !genre) {
      return res
        .status(400)
        .json({ message: "Faltan datos necesarios: title, author, genre" });
    }

    try {
      const genreQuery = "SELECT id FROM genres WHERE name = ?";
      const genreResult = await db.query(genreQuery, [genre]);

      if (genreResult.length === 0) {
        return res.status(400).json({ message: "Género no encontrado" });
      }

      const genreId = genreResult[0].id;

      const newBook = await Book.addNewBook(title, author, genreId);

      res
        .status(201)
        .json({
          message: "Libro agregado exitosamente",
          bookId: newBook.id.toString(),
        });
      console.log("Nuevo libro agregado:", newBook);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error en el servidor");
    }
  },

  async saveBook(req, res) {
    const { bookId } = req.body; // ID del libro que se va a guardar
    const userId = req.user.id; // ID del usuario autenticado (proporcionado por el middleware de autenticación)

    try {
      // Verificar si ya está guardado
      const alreadySaved = await Book.checkIfBookIsSaved(userId, bookId);
      if (alreadySaved) {
        return res
          .status(400)
          .json({ message: "Este libro ya está en tu perfil" });
      }

      // Guardar libro en el perfil del usuario
      await Book.saveBooksForUser(userId, bookId);
      res
        .status(200)
        .json({ message: "Libro guardado con éxito en tu perfil" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  async getUserBooks(req, res) {
    const userId = req.user.id;
    try {
      const books = await Book.getSaveBooksForUser(userId);
      res.json(books);
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },

  async likeBook(req, res) {
    const { bookId, liked } = req.body;
    const userId = req.user.id;

    if (!userId || !bookId || liked === undefined) {
      return res.status(400).json({ message: "Datos faltantes." });
    }

    try {
      const isSaved = await checkIfBookIsSaved(userId, bookId);

      if (!isSaved || isSaved.length === 0) {
        return res
          .status(404)
          .json({ message: "Libro no guardado en el perfil." });
      }

      //actualizar el estado de "liked"
      await updateBookLikeStatus(userId, bookId, liked);
      res
        .status(200)
        .json({ message: liked ? "Libro gustado" : "Libro no gustado" });
    } catch (error) {
      console.error("Error al registrar la preferencia:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  },
};

module.exports = bookController;
