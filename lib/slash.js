'use strict';

var db = require('./db'),
	httpHost;

function dashboardLink(slackId, res) {
	db.utils.getSecretBySlackId(slackId)
		.then(function (secret) {
			return res.send('http://' + httpHost + '/dashboard/' + secret);
		})
		.catch(function () {
			return res.send('I couldn\'t generate link for you. Did you play already?');
		});
}

module.exports = function (req, res) {
	var slackId = '<@' + req.query.user_id + '>';
	httpHost = req.headers.host;

	// avoid infinite loop
	if (req.query.command === '/stats') {
		return dashboardLink(slackId, res);
	} else {
		return res.status(200).end();
	}
};
