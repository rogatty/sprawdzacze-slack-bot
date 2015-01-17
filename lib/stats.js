'use strict';

var db = require('./db');

module.exports = function (req, res) {
	var userId = req.params.userId;

	return res.status(200).json({
		matches: db.stats.matches(userId)
	});
};
