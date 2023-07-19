const { Router } = require('express');

const router = Router();

router.get("/", (req, res) => {
  res.json("Server socket listening...👀");
});

router.get('/register', (req, res) => {
  res.send('Estas en register');
});

module.exports = router;