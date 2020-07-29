const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let creds = req.body;

  const rounds = process.env.HASH_ROUNDS || 4;

  const hash = bcrypt.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
    .then((saved) => {
      res.status(201).json({ data: saved });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((users) => {
      const user = users[0];

      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;

        res.status(200).json({ message: 'You have logged in!' });
      } else {
        res.status(401).json({ message: 'Invalid entry' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.get('/logout', (req, res) => {
  //
});

module.exports = router;
