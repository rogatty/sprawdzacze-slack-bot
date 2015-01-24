'use strict';

var Promise = require('bluebird'),
	db = require('./db');

function getWeekdays(secret) {
	return new Promise(function (resolve, reject) {
		db.stats.weekdays(secret)
			.then(function (rawData) {
				var matchesPerDay = [0, 0, 0, 0, 0];

				if (rawData.length) {
					rawData.forEach(function (weekdayData) {
						// TODO think if weekends should be included
						if (weekdayData.weekday > 0 && weekdayData.weekday <= 5) {
							// normalize it, Monday is the first day of week
							matchesPerDay[weekdayData.weekday - 1] = parseInt(weekdayData.matches);
						}
					});
				}

				resolve(matchesPerDay);
			})
			.catch(reject);
	});
}

function getHours(secret) {
	return new Promise(function (resolve, reject) {
		db.stats.hours(secret)
			.then(function (rawData) {
				var chartData = [];

				if (rawData.length) {
					rawData.forEach(function (hourData) {
						chartData.push([hourData.hour, parseInt(hourData.matches)]);
					});
				}

				// we want to start chart from minimum 9
				if (!chartData.length || chartData[0][0] > 9) {
					chartData.unshift([9, 0]);
				}

				// we want to end chart at minimum 17
				if (chartData.length === 1 || chartData.slice(-1)[0][0] < 17) {
					chartData.push([17, 0]);
				}

				resolve(chartData);
			})
			.catch(reject);
	});
}

function getPercentage(item, total) {
	return +(parseInt(item) / total * 100).toFixed(2);
}

function getWeekdaysAll(total) {
	return new Promise(function (resolve, reject) {
		db.statsAll.weekdays()
			.then(function (rawData) {
				var matchesPerDay = [
					['Monday', 0],
					['Tuesday', 0],
					['Wednesday', 0],
					['Thursday', 0],
					['Friday', 0]
				];

				if (total > 0 && rawData.length) {
					rawData.forEach(function (weekdayData) {
						// TODO think if weekends should be included
						if (weekdayData.weekday > 0 && weekdayData.weekday <= 5) {
							// normalize it, Monday is the first day of week
							matchesPerDay[weekdayData.weekday - 1][1] = getPercentage(weekdayData.matches, total);
						}
					});
				}

				resolve(matchesPerDay);
			})
			.catch(reject);
	});
}

function getHoursAll(total) {
	return new Promise(function (resolve, reject) {
		db.statsAll.hours()
			.then(function (rawData) {
				var chartData = [];

				if (rawData.length) {
					rawData.forEach(function (hourData) {
						chartData.push([hourData.hour, getPercentage(hourData.matches, total)]);
					});
				}

				resolve(chartData);
			})
			.catch(reject);
	});
}

module.exports = function (req, res) {
	var secret = req.params.secret;

	if (secret) {
		return res.status(200).json({
			matches: db.stats.matches(secret),
			weekdays: getWeekdays(secret),
			hours: getHours(secret)
		});
	} else {
		db.statsAll.matches()
			.then(function (total) {
				return res.status(200).json({
					weekdays: getWeekdaysAll(total),
					hours: getHoursAll(total)
				});
			});
	}
};
