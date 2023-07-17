const express = require('express');
const morgan = require('morgan');

const server = express();
server.use(express.json());
server.use(morgan('dev'));

server.get("/", (req, res) => {
  res.json("Server socket listening...👀");
});

// Servidor Socket.io
// ---------------------------------------------------
const { createServer } = require('http');
const { Server } = require('socket.io');
const serverSocket = createServer(server);
const io = new Server(serverSocket, { cors:{ origin: '*' } });

// Escuchando cuando se conecte un cliente
// --------------------------------------------------
io.on('connection', socket => {
  // Ver en consola cuando se conecte un cliente
  console.log('Cliente conectado: ', socket.id);

  // Emitiendo saludo a cada cliente que se conecte
  io.emit('saludo server', '!Hola...te saludo desde el servidor socket.io 👀');

  // Escuchando evento del cliente y enviando a todos
  socket.on("message", message => {
    console.log("Evento recibido: ", message);
    socket.broadcast.emit("message", {
      message,
      from: socket.id.slice(12)
    });
  });

});

module.exports = serverSocket;


