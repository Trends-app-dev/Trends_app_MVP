const { Message } = require('../../../db');

const getMessages = async () => {
  const messages = await Message.findAll();
  return messages;
};

module.exports = getMessages;