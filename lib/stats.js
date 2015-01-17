'use strict';

var db = require('./db');

module.exports = function (req, res) {
	var secret = req.params.secret;

	return res.status(200).json({
		matches: db.stats.matches(secret)
	});
};
