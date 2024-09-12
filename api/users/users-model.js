/** resolves to an ARRAY with all users, each user having { user_id, username } */
const db = require('../../data/db-config');
function find() {
	return db('users').select('user_id', 'username').orderBy('user_id');
}

/** resolves to an ARRAY with all users that match the filter condition */
function findBy(filter) {
	return db('users').where(filter).orderBy('user_id');
}

/** resolves to the user { user_id, username } with the given user_id */
function findById(user_id) {
	return db('users').select('user_id', 'username').where({ user_id }).first();
}

/**  resolves to the newly inserted user { user_id, username } */
async function add(user) {
	const [user_id] = await db('users').insert(user, 'user_id');
	return findById(user_id);
}

module.exports = { find, findBy, findById, add };
