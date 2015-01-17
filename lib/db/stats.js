'use strict';

var Promise = require('bluebird'),
	db = require('./connection');

function getNumberOfMatches(userId) {
	return new Promise(function (resolve) {
		db('player')
			.where({
				user_id: userId
			})
			.count('match_id as CNT')
			.then(function (rows) {
				resolve(rows[0].CNT);
			});
	});
}

module.exports = {
	getNumberOfMatches: getNumberOfMatches
};
