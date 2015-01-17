'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {};

function matches(secret) {
	return new Promise(function (resolve, reject) {
		getUserId(secret)
			.then(function (userId) {
				db('public.player')
					.where({
						user_id: userId
					})
					.count('match_id as CNT')
					.then(function (rows) {
						resolve(rows[0].CNT);
					})
					.catch(reject);
			})
			.catch(reject);
	});
}

function weekdays(secret) {
	return new Promise(function (resolve, reject) {
		getUserId(secret)
			.then(function (userId) {
				db('public.player')
					.column('')
					.where({
						user_id: userId
					})
					.then(function (rows) {
						resolve(rows[0].CNT);
					})
					.catch(reject);
			})
			.catch(reject);
	});
}

function getUserId(secret) {
	return new Promise(function (resolve, reject) {
		if (userIds.hasOwnProperty(secret)) {
			resolve(userIds[secret]);
		} else {
			db('public.user')
				.where({
					secret: secret
				})
				.then(function (rows) {
					var userId;

					if (rows.length) {
						userId = rows[0].id;
						userIds[secret] = userId;
						resolve(userId);
					} else {
						reject();
					}
				})
				.catch(reject);
		}
	});
}

module.exports = {
	matches: matches
};
