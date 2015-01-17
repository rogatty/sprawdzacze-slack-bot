'use strict';

var Promise = require('bluebird'),
	db = require('./dbConnection'),
	dbCreate = require('./dbCreate');

function save(slackIds) {
	console.log('######## BEGINNING #######', slackIds);
	saveMatch(slackIds)
		.spread(getUserIds)
		.spread(savePlayers)
		.catch(function (error) {
			console.log(error);
		});
}

function saveMatch(slackIds) {
	return new Promise(function (resolve) {
		db('match')
			.returning('id')
			.insert({
				date_time: new Date()
			})
			.then(function (rows) {
				console.log('####### SAVE MATCH RESULT ######', rows[0], slackIds);
				//rows[0] is match_id
				resolve([rows[0], slackIds]);
			});
	});
}

function getUserIds(matchId, slackIds) {
	console.log('###### GET USER IDS BEGINNING #######', matchId, slackIds);
	return new Promise(function (resolve) {
		var userIds = [];

		slackIds.forEach(function (slackId) {
			userIds.push(getUserId(slackId));
		});
		console.log('###### ARRAY OF getUserId PROMISES #######', userIds);

		resolve([matchId, Promise.all(userIds)]);
	});
}

function savePlayers(matchId, userIds) {
	var players = [];

	userIds.forEach(function (userId) {
		players.push({
			match_id: matchId,
			user_id: userId
		});
	});

	db('player')
		.insert(players)
		.then(function (ids) {
			ids.forEach(function (id) {
				console.log('#### SAVED PLAYER ####', id);
			});
		});
}

function getUserId(slackId) {
	console.log('##### GET USER ID #####', slackId);
	return new Promise(function (resolve) {
		db('user')
			.where({
				slack_id: slackId
			})
			.then(function (rows) {
				if (rows.length) {
					resolve(rows[0].id)
				} else {
					resolve(saveUser(slackId));
				}
			});
	});
}

function saveUser(slackId) {
	return new Promise(function (resolve) {
		return db('user')
			.returning('id')
			.insert({
				slack_id: slackId
			})
			.then(function (rows) {
				//return user_id
				resolve(rows[0]);
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
					.createTables()
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
	save: save,
	setUp: setUp
};
