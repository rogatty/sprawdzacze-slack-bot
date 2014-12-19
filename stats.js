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

	console.log('####', statsFor);

	if (!/<@U.+>/.test(statsFor)) {
		return invalidUser(res);
	}

	db.getNumberOfMatches(statsFor)
		.then(function (numberOfMatches) {
			res.status(200).send('Stats for *' + statsFor + '*\n' + 'Matches played: ' + numberOfMatches);
		});
};
