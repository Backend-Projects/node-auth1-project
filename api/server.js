const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const dbConnection = require('../database/dbConfig.js');

const server = express();

const sessionConfiguration = {
  name: 'dessert',
  secret: process.env.SESSION_SECRET || 'Dont tell anyone!',
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfilename: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(session(sessionConfiguration));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
  res.json({ api: 'Up & Running!' });
});

function hashString(str) {
  const rounds = process.env.HASH_ROUNDS || 4;
  const hash = bcrypt.hashSync(str, rounds);

  return hash;
}
module.exports = server;
