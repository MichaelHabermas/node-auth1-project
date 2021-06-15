const path = require('path'); // whats all this about?
const express = require('express');
const helmet = require('helmet'); // whats all this about?
const cors = require('cors');
const session = require('express-session');

const server = express();
const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');
/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */
server.use(express.static(path.join(__dirname, '../client'))); // whats all this about?

server.use(
	session({
		name: 'chocolatechip',
		secret: 'keep it secret', // .env file
		cookie: {
			maxAge: 1000 * 120,
			secure: false, // if true, only works over TLS/https
			httpOnly: false // if true, cookie not in document
		},
		resave: false, // required by some session stores
		saveUninitialized: false // session not saved automatically
	})
);

server.use(helmet()); // whats all this about?
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

server.use((err, req, res, next) => {
	// eslint-disable-line
	res.status(err.status || 500).json({
		message: err.message,
		stack: err.stack
	});
});

module.exports = server;
