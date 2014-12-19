'use strict';

var //config = require('./config.json'),
	db = require('./db');

module.exports = function (statsMatches, userId, res) {
	if (typeof statsMatches[1] !== 'undefined') {
		userId = statsMatches[1];
	}

	db.getNumberOfMatches(userId)
		.then(function (numberOfMatches) {
			var payload = {
				text: 'Stats for ' + userId,
				attachments: [{
					fields: [{
						title: 'Number of matches',
						value: numberOfMatches,
						short: true
					}]
				}]
			};
			res.status(200).json(payload);
		});
};
