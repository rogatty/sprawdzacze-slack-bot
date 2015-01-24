'use strict';

module.exports = require('knex')({
	client: 'pg',
	connection: {
		host: 'localhost',
		user: 'postgres',
		password: 'root',
		database: 'sprawdzacze-dev'
	}
});
