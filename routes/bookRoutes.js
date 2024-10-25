const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const bookController = require("../controllers/bookController");

//Lista todos los libros
router.get("/books", bookController.listBooks);

//Lista libros por género
router.get("/books/genre/:genre", bookController.listBooksByGenre);

//Guardar un nuevo libro (ruta protegida)
router.post('/books/new', authMiddleware, bookController.saveNewBook);

//Guardar un libro en el perfil del usuario (ruta protegida)
router.post("/books/save", authMiddleware, bookController.saveBook);

//Registro de likes y dislikes del usuario (ruta protegida)
router.post("/books/like", authMiddleware, bookController.likeBook);

//Ver libros guardados por el usuario (ruta protegida)
router.get("/books/user", authMiddleware, bookController.getUserBooks);

module.exports = router;
