'use strict';

var db = require('./db');

module.exports = function (req, res) {
	var userHash = req.params.hash;

	return res.status(200).json({
		matches: db.stats.matches(userHash)
	});
};
