'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {};

function matches(slackId) {
	return new Promise(function (resolve) {
		getUserId(slackId)
			.then(function (userId) {
				db('player')
					.where({
						user_id: userId
					})
					.count('match_id as CNT')
					.then(function (rows) {
						resolve(rows[0].CNT);
					});
			});
	});
}

function getUserId(slackId) {
	return new Promise(function (resolve, reject) {
		if (userIds.hasOwnProperty(slackId)) {
			resolve(userIds[slackId]);
		} else {
			db('user')
				.where({
					slack_id: slackId
				})
				.then(function (rows) {
					if (rows.length) {
						resolve(rows[0].id)
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
