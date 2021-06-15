const Users = require('../users/users-model.js');
/*
  If the user does not have a session saved in the server
  status 401{"message": "You shall not pass!"}
*/
function restricted(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		next({ status: 401, message: 'You shall not pass!' });
	}
}

/*
  If the username in req.body already exists in the database
  status 422 { "message": "Username taken" }
*/
function checkUsernameFree(req, res, next) {
	const { username } = req.body;
	Users.findBy({ username })
		.then(users => {
			if (users[0]) {
				next({ status: 422, message: 'Username taken!' });
			} else {
				next();
			}
		})
		.catch(next);
}

/*
  If the username in req.body does NOT exist in the database
  status 401 {"message": "Invalid credentials" }
*/
function checkUsernameExists(req, res, next) {
	const { username } = req.body;
	Users.findBy({ username })
		.then(users => {
			if (users[0]) {
				next();
			} else {
				next({ status: 401, message: 'Invalid credentials!' });
			}
		})
		.catch(next);
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter  status 422
  { "message": "Password must be longer than 3 chars" }
*/
function checkPasswordLength(req, res, next) {
	const { password } = req.body;
	if (!password || password.trim().length < 4) {
		next({ status: 422, message: 'Password must be longer than 3 chars!' });
	} else {
		next();
	}
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
	restricted,
	checkUsernameFree,
	checkUsernameExists,
	checkPasswordLength
};
