'use strict';

var Promise = require('bluebird'),
	db = require('./db');

function getWeekdays(secret) {
	return new Promise(function (resolve, reject) {
		db.stats.weekdays(secret)
			.then(function (rawData) {
				var chartData = {
					labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
					series: [[]]
				};

				rawData.forEach(function (weekdayData) {
					// TODO think if weekends should be included
					if (weekdayData.weekday > 0 && weekdayData.weekday <= 5) {
						chartData.series[0].push(parseInt(weekdayData.matches));
					}
				});

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
