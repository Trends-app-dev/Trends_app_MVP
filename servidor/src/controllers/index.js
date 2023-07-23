const postUser = require('./userControllers/postUser');
const getUsers = require('./userControllers/getUsers');
const loginUser = require('./userControllers/loginUser');
const getUserById = require('./userControllers/getUserById');
const updateUser = require('./userControllers/updateUser');


module.exports = {
  postUser,
  getUsers,
  loginUser,
  getUserById,
  updateUser,
}