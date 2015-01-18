'use strict';

var Promise = require('bluebird'),
	sha1 = require('sha1'),
	db = require('./connection'),
	utils = require('./utils');

function save(slackIds) {
	saveMatch(slackIds)
		.spread(getUserIds)
		.spread(savePlayers)
		.catch(function (error) {
			console.log(error);
		});
}

function saveMatch(slackIds) {
	return new Promise(function (resolve) {
		db(utils.table.match)
			.returning('id')
			.insert({
				date_time: new Date()
			})
			.then(function (rows) {
				//rows[0] is match_id
				resolve([rows[0], slackIds]);
			});
	});
}

function getUserIds(matchId, slackIds) {
	return new Promise(function (resolve) {
		var userIds = [];

		slackIds.forEach(function (slackId) {
			userIds.push(getUserId(slackId));
		});

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

	return db(utils.table.player).insert(players);
}

function getUserId(slackId) {
	return new Promise(function (resolve) {
		db(utils.table.user)
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
		//TODO check if it's not a duplicate (low chance, low priority)
		var secret = sha1(Math.random().toString(36) + slackId);

		return db(utils.table.user)
			.returning('id')
			.insert({
				slack_id: slackId,
				secret: secret
			})
			.then(function (rows) {
				//rows[0] is user_id
				resolve(rows[0]);
			});
	});
}

module.exports = save;
