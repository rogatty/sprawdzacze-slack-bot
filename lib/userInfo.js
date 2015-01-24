'use strict';

var Promise = require('bluebird'),
	db = require('./db'),
	slack = require('./slack');

function getUserInfo(secret) {
	return new Promise(function (resolve, reject) {
		db.utils.getSlackIdBySecret(secret)
			.then(slack.getUserInfo)
			.then(function (userInfoRaw) {
				var userInfo = {
					name: userInfoRaw.user.real_name,
					image: userInfoRaw.user.profile.image_72
				};
				resolve(userInfo);
			})
			.catch(reject);
	});
}

module.exports = function (req, res) {
	var secret = req.params.secret;

	return res.status(200).json(getUserInfo(secret));
};
