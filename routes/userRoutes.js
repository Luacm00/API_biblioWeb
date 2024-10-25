const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getUserProfile);

//Ejemplo ruta protegida
router.get("/protected", authMiddleware, (req, res) => {
  res.send(`Hola ${req.user.username}, tienes acceso a esta ruta protegida.`);
});

//Obtener perfil de usuario

module.exports = router;
