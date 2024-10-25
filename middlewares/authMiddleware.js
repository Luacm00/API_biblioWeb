const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log("Token recibido:", token);

  if (!token) {
    return res.status(403).json({ message: "No se proporciona un token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido" });
    }

    // Almacena todo el objeto del usuario en req.user
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;