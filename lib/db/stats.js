'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {};

function matches(slackId) {
	console.log('#### matches', slackId);
	return new Promise(function (resolve) {
		getUserId(slackId)
			.then(function (userId) {
				console.log('#### we have user id for matches count', userId);
				db('player')
					.where({
						user_id: userId
					})
					.count('match_id as CNT')
					.then(function (rows) {
						console.log('#### resolving with number of matches', rows[0].CNT);
						resolve(rows[0].CNT);
					});
			});
	});
}

function getUserId(slackId) {
	console.log('#### getUserId', slackId);
	return new Promise(function (resolve, reject) {
		if (userIds.hasOwnProperty(slackId)) {
			console.log('#### hasOwnProperty', userIds[slackId]);
			resolve(userIds[slackId]);
		} else {
			db('user')
				.where({
					slack_id: slackId
				})
				.then(function (rows) {
					var userId = rows[0].id;

					console.log('#### we have userId', userId);
					if (rows.length) {
						userIds[slackId] = userId;
						resolve(userId);
					} else {
						reject();
					}
				});
		}
	});
}

module.exports = {
	matches: matches
};
