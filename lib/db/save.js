'use strict';

var Promise = require('bluebird'),
	db = require('./connection');

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
		db('public.match')
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

	return db('public.player').insert(players);
}

function getUserId(slackId) {
	return new Promise(function (resolve) {
		db('public.user')
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
		return db('public.user')
			.returning('id')
			.insert({
				slack_id: slackId
			})
			.then(function (rows) {
				//rows[0] is user_id
				resolve(rows[0]);
			});
	});
}

module.exports = save;
