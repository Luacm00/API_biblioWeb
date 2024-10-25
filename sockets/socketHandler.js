module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("message", (msg) => {
      console.log("Mensaje recibido:", msg);
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};
