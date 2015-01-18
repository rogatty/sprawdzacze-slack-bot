'use strict';

module.exports = require('knex')({
	client: 'pg',
	//connection: process.env.DATABASE_URL
	connection: {
		host: 'localhost',
		user: 'postgres',
		password: 'root',
		database: 'sprawdzacze-dev'
	}
});
