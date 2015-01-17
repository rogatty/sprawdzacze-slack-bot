'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {};

function matches(userHash) {
	return new Promise(function (resolve, reject) {
		getUserId(userHash)
			.then(function (userId) {
				db('player')
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

function getUserId(hash) {
	console.log('#### getUserId', hash);
	return new Promise(function (resolve, reject) {
		if (userIds.hasOwnProperty(hash)) {
			console.log('#### hasOwnProperty', userIds[hash]);
			resolve(userIds[hash]);
		} else {
			db('user')
				.where({
					hash: hash
				})
				.then(function (rows) {
					var userId;

					if (rows.length) {
						userId = rows[0].id;
						console.log('#### we have userId', userId);
						userIds[hash] = userId;
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
