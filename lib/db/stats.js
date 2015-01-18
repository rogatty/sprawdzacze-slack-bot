'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	utils = require('./utils'),
	// let's cache it
	userIds = {};

function matches(secret) {
	return new Promise(function (resolve, reject) {
		getUserId(secret)
			.then(function (userId) {
				db(utils.table.player)
					.count('match_id as matches')
					.where({
						user_id: userId
					})
					.then(function (rows) {
						resolve(rows[0].matches);
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
				var extractWeekday = 'extract(dow from ' + utils.table.match + '.date_time::timestamp)';

				db(utils.table.player)
					.select(db.raw(extractWeekday + ' AS weekday'))
					.count(utils.table.player + '.match_id as matches')
					.join(utils.table.match, utils.table.match + '.id', '=', utils.table.player + '.match_id')
					.where({
						user_id: userId
					})
					.groupBy('weekday')
					.orderBy('weekday')
					.then(function (rows) {
						resolve(rows);
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
			db(utils.table.user)
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
	matches: matches,
	weekdays: weekdays
};
