'use strict';

var config = require('./config.json'),
	db = require('./db');

function invalidUser(res) {
	res.status(200).send('Invalid username, try again.');
}

module.exports = function (body, res) {
	var userId = '<@' + body.user_id + '>',
		statsFor = body.text;

	if (!statsFor) {
		statsFor = userId;
	}

	if (!/<@U.+>/.test(statsFor)) {
		return invalidUser(res);
	}

	var payload = {
		text: 'Stats for ' + statsFor,
		attachments: [{
			color: 'good',
			fields: [{
				title: 'Test',
				value: '1500 100 900'
			}]
		}]
	};
	res.status(200).json(payload);
};
