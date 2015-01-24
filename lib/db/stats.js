'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	utils = require('./utils');

function matches(secret) {
	return new Promise(function (resolve, reject) {
		utils.getUserIdBySecret(secret)
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
		utils.getUserIdBySecret(secret)
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

function hours(secret) {
	return new Promise(function (resolve, reject) {
		utils.getUserIdBySecret(secret)
			.then(function (userId) {
				var extractHour = 'extract(hour from ' + utils.table.match + '.date_time::timestamp)';

				db(utils.table.player)
					.select(db.raw(extractHour + ' AS hour'))
					.count(utils.table.player + '.match_id as matches')
					.join(utils.table.match, utils.table.match + '.id', '=', utils.table.player + '.match_id')
					.where({
						user_id: userId
					})
					.groupBy('hour')
					.orderBy('hour')
					.then(function (rows) {
						resolve(rows);
					})
					.catch(reject);
			})
			.catch(reject);
	});
}

module.exports = {
	matches: matches,
	weekdays: weekdays,
	hours: hours
};
