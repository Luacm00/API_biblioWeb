const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

//Middleware archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//Middleware
app.use(express.json());

//Rutas
//de usuarios
app.use("/api/users", userRoutes);

// de libros
app.use("/api/library", bookRoutes);

//Websocket handler
require("./sockets/socketHandler")(io);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//obtener nombre de usuario
app.get("/api/user/profile", (req, res) => {
  // Verifica el token y obtén la información del usuario
  const user = getUserFromToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({ name: user.name });
});

//Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
