'use strict';

var db = require('knex')({
		client: 'pg',
		connection: process.env.DATABASE_URL
	}),
	dbCreate = require('./dbCreate'),
	Promise = require('bluebird');

function saveMatch(ids) {
	db('match')
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

	db('player')
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
		db('player')
			.where({
				user_id: userId
			})
			.count('match_id as CNT')
			.then(function (rows) {
				resolve(rows[0].CNT);
			});
	});
}

function setUp() {
	return new Promise(function (resolve, reject) {
		db.schema.hasTable('user').then(function (exists) {
			if (exists) {
				reject('Database is already set up');
			} else {
				dbCreate
					.createTables(db)
					.then(function () {
						resolve('Database was set up');
					})
					.catch(function (error) {
						reject('There was error when trying to set up database: ' + error);
					});
			}
		});
	});
}

module.exports = {
	getNumberOfMatches: getNumberOfMatches,
	saveMatch: saveMatch,
	setUp: setUp
};
