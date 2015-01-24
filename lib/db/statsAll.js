'use strict';

var Promise = require('bluebird'),
	db = require('./connection'),
	utils = require('./utils');

function matches() {
	return new Promise(function (resolve, reject) {
		db(utils.table.match)
			.count('id as matches')
			.then(function (rows) {
				resolve(rows[0].matches);
			})
			.catch(reject);
	});
}

function weekdays() {
	return new Promise(function (resolve, reject) {
		var extractWeekday = 'extract(dow from ' + utils.table.match + '.date_time::timestamp)';

		db(utils.table.match)
			.select(db.raw(extractWeekday + ' AS weekday'))
			.count(utils.table.match + '.id as matches')
			.groupBy('weekday')
			.orderBy('weekday')
			.then(function (rows) {
				resolve(rows);
			})
			.catch(reject);
	});
}

function hours() {
	return new Promise(function (resolve, reject) {
		var extractHour = 'extract(hour from ' + utils.table.match + '.date_time::timestamp)';

		db(utils.table.match)
			.select(db.raw(extractHour + ' AS hour'))
			.count(utils.table.match+ '.id as matches')
			.groupBy('hour')
			.orderBy('hour')
			.then(function (rows) {
				resolve(rows);
			})
			.catch(reject);
	});
}

module.exports = {
	matches: matches,
	weekdays: weekdays,
	hours: hours
};
