'use strict';

var db = require('./db');

module.exports = function (req, res) {
	var secret = req.params.secret,
		html = '<html><body>' +
			'<p>Secret: ' + secret + '</p>' +
			'<p>Number of matches for @igor: ' + db.stats.getNumberOfMatches(23) + '</p>' +
			'</body></html>';


	return res.status(200).text('');
};
