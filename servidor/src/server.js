const express = require('express');
const morgan = require('morgan');

const server = express();
server.use(express.json());
server.use(morgan('dev'));
server.use(require('./routes'))

// Servidor Socket.io
// ---------------------------------------------------
const { createServer } = require('http');
const serverChat = require('./serverChat');
const serverSocket = createServer(server);

serverChat(serverSocket)

module.exports = serverSocket;


