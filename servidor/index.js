require('dotenv').config();
const serverSocket = require('./src/server');
const PORT = process.env.PORT || 3000;



serverSocket.listen(PORT, () => {
  console.log(`Sever socket listening on ${PORT}`);
});