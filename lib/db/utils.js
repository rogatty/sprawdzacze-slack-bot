'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	// let's cache it
	userIds = {},
	slackIds = {},
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

function getSlackIdBySecret(secret) {
	return new Promise(function (resolve, reject) {
		if (slackIds.hasOwnProperty(secret)) {
			resolve(slackIds[secret]);
		} else {
			db(table.user)
				.where({
					secret: secret
				})
				.then(function (rows) {
					var slackId;

					if (rows.length) {
						slackId = rows[0].slack_id;

						// TODO this should be stored in DB this way and not be processed here
						slackId = slackId.replace('<@', '');
						slackId = slackId.replace('>', '');

						slackIds[secret] = slackId;
						resolve(slackId);
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
	getSlackIdBySecret: getSlackIdBySecret,
	getSecretBySlackId: getSecretBySlackId
};
