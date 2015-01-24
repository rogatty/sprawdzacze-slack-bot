'use strict';

var Promise = require('bluebird'),
	Wreck = require('wreck'),
	querystring = require('querystring');

function getUrl(method, params) {
	var api = 'https://slack.com/api/',
		params = params || {};

	params.token = process.env.SLACK_API_TOKEN;

	return api + method + '?' + querystring.stringify(params);
}

function getUserInfo(userId) {
	return new Promise(function (resolve, reject) {
		var url = getUrl('users.info', {
			user: userId
		});

		Wreck.get(url, { json: true }, function (err, res, payload) {
			if (err || !payload.ok) {
				reject(err || payload.error);
			} else {
				resolve(payload);
			}
		}).on('error', function (error) {
			reject(error);
		});
	});
}

module.exports = {
	getUserInfo: getUserInfo
};
