'use strict';

var db = require('./db'),
	httpHost;

function dashboardLink(slackId, res) {
	db.utils.getSecretBySlackId(slackId)
		.then(function (secret) {
			return res.status(200).json({
				text: 'Link for your dashboard that only you can see: http://' + httpHost + '/dashboard/' + secret
			});
		})
		.catch(function () {
			return res.status(200).json({
				text: 'I couldn\'t generate link for you. Did you play already?'
			});
		});
}

module.exports = function (req, res) {
	var slackId = '<@' + req.params.user_id + '>';

	httpHost = req.headers.host;

	// avoid infinite loop
	if (req.params.command === '/stats') {
		return dashboardLink(slackId, res);
	} else {
		return res.status(200).end();
	}
};
