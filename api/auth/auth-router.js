// const { router } = require('../server');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const {
	checkUsernameFree,
	checkUsernameExists,
	checkPasswordLength
} = require('./auth-middleware');

router.post(
	'/register',
	checkUsernameFree,
	checkPasswordLength,
	async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const hash = bcrypt.hashSync(
				password, // plain text
				8 // number of rounds of hashing 2 ^ 8
			);
			const newUser = { username, password: hash };
			const createdUser = await Users.add(newUser);
			res.status(200).json(createdUser);
		} catch (err) {
			next(err);
		}
	}
);
/** 1 [POST] /api/auth/register { "username": "sue", "password": "1234" }
 response: status 200
 { "user_id": 2, "username": "sue" }
 
 response on username taken: status 422
 { "message": "Username taken" }
 
 response on password three chars or less: status 422
 { "message": "Password must be longer than 3 chars" }
 */

router.post('/login', checkUsernameExists, async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const [user] = await Users.findBy({ username });
		// does username correspond to an actual user?
		if (bcrypt.compareSync(password, user.password)) {
			req.session.user = user;
			// a cookie is set on client
			// a session is stored for that user
			res.status(200).json({ message: `Welcome ${user.username}!` });
		} else {
			next({ status: 401, message: 'Invalid credentials' });
		}
	} catch (err) {
		next(err);
	}
});

/** 2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
 
 response: status 200
 { "message": "Welcome sue!" }
 
 response on invalid credentials: status 401
 { "message": "Invalid credentials" }
 */
router.get('/logout', async (req, res, next) => {
	if (req.session.user) {
		req.session.destroy(err => {
			if (err) res.json({ message: 'you cannot leave' });
			else res.status(200).json({ message: 'logged out' });
		});
	} else {
		res.status(200).json({ message: 'no session' });
	}
});

/** 3 [GET] /api/auth/logout

  response for logged-in users: status 200
  { "message": "logged out" }

  response for not-logged-in users: status 200
  { "message": "no session" }
 */

module.exports = router;
