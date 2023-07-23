const express = require('express');
const usersRouter = require('./usersRouter');

function routerApi(server) {
  const router = express.Router();
  //Ruta padre con versión
  server.use("/api/v1", router);
  router.use("/users", usersRouter);
};

module.exports = routerApi;