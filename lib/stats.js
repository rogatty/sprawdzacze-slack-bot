'use strict';

var Promise = require('bluebird'),
	db = require('./db');

function getWeekdays(secret) {
	return new Promise(function (resolve, reject) {
		db.stats.weekdays(secret)
			.then(function (rawData) {
				var chartData = {
						labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
						series: []
					},
					matchesPerDay = [0, 0, 0, 0, 0];

				rawData.forEach(function (weekdayData) {
					// TODO think if weekends should be included
					if (weekdayData.weekday > 0 && weekdayData.weekday <= 5) {
						// normalize it, Monday is the first day of week
						matchesPerDay[weekdayData.weekday - 1] = parseInt(weekdayData.matches);
					}
				});

				chartData.series.push(matchesPerDay);

				resolve(chartData);
			})
			.catch(reject);
	});
}

module.exports = function (req, res) {
	var secret = req.params.secret;

	return res.status(200).json({
		matches: db.stats.matches(secret),
		weekdays: getWeekdays(secret)
	});
};
