const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const userController = {
  async register(req, res) {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.createUser(username, hashedPassword);
      res.status(201).send("Usuario registrado");
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findUserByUsername(username);
      if (!user) return res.status(404).send("Usuario no encontrado");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send("Contraseña incorrecta");

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },

  async getUserProfile(req, res) {
    const userId = req.user.id; // Suponiendo que tienes un middleware de autenticación que agrega req.user

    try {
      const userProfile = await User.getUserProfile(userId);
      if (!userProfile) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      res.json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  },
};

module.exports = userController;
