'use strict';

var db = require('./db');

module.exports = function (req, res) {
	return res.status(200).json({
		numberOfMatches: db.stats.getNumberOfMatches(23)
	});
};
