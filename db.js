'use strict';

var knex = require('knex')({
	client: 'pg',
	connection: process.env.HEROKU_POSTGRESQL_CHARCOAL_URL,
	ssl: true
});

function saveMatch(ids) {

}

function setUp() {
	knex.schema.createTable('match', function (table) {
		table.increments();
		table.dateTime('date_time');
	});

	knex.schema.createTable('player', function (table) {
		table.increments();
		table.string('user_id');
		table.integer('match_id')
			.unsigned()
			.references('id')
			.inTable('match')
			.onDelete('CASCADE');
	});
}

module.exports = {
	saveMatch: saveMatch,
	setUp: setUp
};
