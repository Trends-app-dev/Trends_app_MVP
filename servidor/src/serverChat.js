module.exports = serverSocket => {
  const { Server } = require('socket.io');
  const io = new Server(serverSocket, {cors:{origin:'*'}});

  // ===========================================================
  let onLineUsers = [];
  const addNewUser = (userName, socketId) => {
    !onLineUsers.some(user =>
      user.userName === userName && onLineUsers.push({userName, socketId})
    );
  };
  const removeUser = (socketId) => {
    onLineUsers = onLineUsers.filter(user => user.socketId !== socketId);
  };
  const getUser = (userName) => {
    return onLineUsers.find(user => user.userName === userName);
  };
  // ===========================================================


  // Escuchando cuando se conecte un cliente
  // --------------------------------------------------
  io.on('connection', socket => {
    // ===================================
    socket.on("newUser", userName => {
      addNewUser(userName, socket.id);
    });
    socket.on("disconnect", () =>{
      removeUser(socket.id);
    });
    // ===================================

    // Ver en consola cuando se conecte un cliente
    console.log('Cliente conectado: ', socket.id);

    // Emitiendo saludo a cada cliente que se conecte
    io.emit('saludo server', '!Hola...te saludo desde el servidor socket.io 👀');

    // Escuchando evento del cliente y enviando a todos
    socket.on("message", ({ message, userName, fecha }) => {
      console.log("Evento recibido: ", message, userName, fecha);
      socket.broadcast.emit("message", {
        message,
        fecha,
        from: userName,
      });
    });
  });
}