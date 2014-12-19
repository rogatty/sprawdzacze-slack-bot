'use strict';

var knex = require('knex')({
		client: 'pg',
		connection: process.env.DATABASE_URL
	}),
	Promise = require('bluebird');

function saveMatch(ids) {
	knex('match')
		.returning('id')
		.insert({
			date_time: new Date()
		})
		.then(function (matchRows) {
			savePlayers(matchRows, ids);
		});
}

function savePlayers(matchRows, ids) {
	var players = [],
		matchId = matchRows[0];

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
				//console.log('#### playerId', id);
			});
		});
}

function getNumberOfMatches(userId) {
	return new Promise(function (resolve) {
		knex('player')
			.where({
				user_id: userId
			})
			.count('match_id as CNT')
			.then(function (rows) {
				resolve(rows[0].CNT);
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

module.exports = {
	getNumberOfMatches: getNumberOfMatches,
	saveMatch: saveMatch,
	setUp: setUp
};
