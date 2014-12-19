'use strict';

var knex = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL
});

function saveMatch(ids) {
	knex('match')
		.returning('id')
		.insert({
			date_time: new Date()
		})
		.then(function (matchId) {
			var players = [];

			ids.forEach(function (id) {
				players.push({
					match_id: matchId,
					user_id: id
				});
			});

			knex('player')
				.insert(players)
				.then(function () {});
		});
}

function setUp(res) {
	knex.schema.createTable('match', function (table) {
		table.increments();
		table.dateTime('date_time');
	}).then(function () {
		knex.schema.createTable('player', function (table) {
			table.increments();
			table.string('user_id');
			table.integer('match_id')
				.unsigned()
				.references('id')
				.inTable('match')
				.onDelete('CASCADE');
		}).then(function () {
			res.status(200).send('It\'s set up now.');
		});
	});
}

module.exports = {
	saveMatch: saveMatch,
	setUp: setUp
};
