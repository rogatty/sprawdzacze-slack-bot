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
		.then(function (matchRows) {
			var players = [],
				matchId = matchRows[0];

			console.log('#### matchId', matchId);

			ids.forEach(function (id) {
				players.push({
					match_id: matchId,
					user_id: id
				});
			});

			knex('player')
				.returning('id')
				.insert(players)
				.then(function (ids) {
					ids.forEach(function (id) {
						console.log('#### playerId', id);
					});
				});
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

function test(res) {
	knex('match')
		.returning('id')
		.insert({
			date_time: new Date()
		})
		.then(function (matchRows) {
			var players = [{
				match_id: matchRows[0],
				user_id: 'terefere'
			}];

			console.log('matchId', matchRows[0]);

			knex('player')
				.returning('id')
				.insert(players)
				.then(function (ids) {
					ids.forEach(function (id) {
						console.log('playerId', id);
					});
					res.status(200).send('ok');
				});
		});
}

module.exports = {
	saveMatch: saveMatch,
	setUp: setUp,
	test: test
};
