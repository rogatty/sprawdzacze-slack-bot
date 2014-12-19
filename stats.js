'use strict';

var //config = require('./config.json'),
	db = require('./db');

module.exports = function (statsMatches, userId, res) {
	if (typeof statsMatches[1] !== 'undefined') {
		userId = statsMatches[1];
	}

	db.getNumberOfMatches(userId)
		.then(function (numberOfMatches) {
			res.status(200).send('Stats for *' + userId + '*\n' + 'Matches played: ' + numberOfMatches);
		});
};
