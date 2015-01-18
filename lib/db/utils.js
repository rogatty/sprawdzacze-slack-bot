'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {},
	table = {
		user: 'public.user',
		player: 'public.player',
		match: 'public.match'
	};

function getUserIdBySecret(secret) {
	return new Promise(function (resolve, reject) {
		if (userIds.hasOwnProperty(secret)) {
			resolve(userIds[secret]);
		} else {
			db(table.user)
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

function getSecretBySlackId(slackId) {
	return new Promise(function (resolve, reject) {
		db(table.user)
			.where({
				slack_id: slackId
			})
			.then(function (rows) {
				if (rows.length) {
					resolve(rows[0].secret);
				} else {
					reject();
				}
			})
			.catch(reject);
	});
}

module.exports = {
	table: table,
	getUserIdBySecret: getUserIdBySecret,
	getSecretBySlackId: getSecretBySlackId
};
