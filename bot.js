'use strict';

var //request = require('request'),
	//config = require('./config.json'),
	_ = require('underscore'),
	patterns = {
		change: /(\+|\-)([1-4])\s*((?:\s*<@U.+>)*)/
	},
	state = {
		numberOfPlayers: 0,
		ids: []
	};

function addPlayers(numberOfPlayers, ids, res) {
	var players,
		payload,
		i;

	state.ids = _.union(state.ids, ids);
	state.numberOfPlayers += numberOfPlayers;

	players = ids.join(' ');

	if (numberOfPlayers > ids.length) {
		for (i = 0; i < numberOfPlayers - ids.length; i++) {
			players += ' Anon :bandit:';
		}
	}

	//console.log('#### ADD PLAYERS STATE');
	//console.log(state);

	if (state.numberOfPlayers >= 4) {
		return startMatch(res);
	} else {
		payload = {
			text: 'Added players',
			attachments: [{
				fallback: 'Players added: ' + players,
				fields: [{
					title: 'Players added',
					value: players,
					short: true
				}, {
					title: 'Current status',
					value: state.numberOfPlayers + '/4',
					short: true
				}]
			}]
		};

		return res.status(200).json(payload);
	}
}

function removePlayers(numberOfPlayers, ids, res) {
	var index,
		idsRemoved = [],
		players,
		payload,
		payloadFields = [];

	if (state.numberOfPlayers > 0) {
		ids.forEach(function (id) {
			index = state.ids.indexOf(id);

			if (index > -1) {
				state.ids.slice(index, 1);
				state.numberOfPlayers--;
				idsRemoved.push(id);
			}
		});
	}

	players = idsRemoved.join(' ');

	payloadFields.push({
		title: 'Players removed',
		value: players,
		short: true
	});

	payloadFields.push({
		title: 'Current status',
		value: state.numberOfPlayers + '/4',
		short: true
	});

	if (numberOfPlayers > ids.length) {
		payloadFields.push({
			title: 'Warning',
			value: 'Please be more specific when removing players!'
		})
	}

	payload = {
		text: 'Removed players',
		attachments: [{
			fallback: 'Players removed: ' + players,
			fields: payloadFields
		}]
	};

	//console.log('#### REMOVE PLAYERS STATE');
	//console.log(state);

	return res.status(200).json(payload);
}

function startMatch(res) {
	var players = state.ids.join(' '),
		payload = {
			text: 'GO GO GO!',
			attachments: [{
				color: 'good',
				fallback: 'Players: ' + players,
				fields: [{
					title: 'Players',
					value: players
				}]
			}]
		};

	state.numberOfPlayers = 0;
	state.ids = [];

	console.log('#### START MATCH');
	return res.status(200).json(payload);
}

/*function currentStatus(res, messagePrefix) {
	var payload;

	if (messagePrefix) {
		messagePrefix = messagePrefix + '; ';
	} else {
		messagePrefix = '';
	}

	payload = {
		text: messagePrefix + 'Current status: ' + state.numberOfPlayers + '/4'
	};

	return res.status(200).json(payload);
}*/

function emptyResponse(res) {
	return res.status(200).end();
}

function parse(body, res) {
	var userId = '<@' + body.user_id + '>',
		matches = body.text.match(patterns.change),
		operator = '',
		numberOfPlayers = 0,
		ids = [],
		numberOfIds = 0;

	console.log('##### MATCHES', matches);

	if (matches) {
		operator = matches[1];
		numberOfPlayers = parseInt(matches[2], 10);

		//TODO if number of players is bigger than free slots

		if (matches[3]) {
			ids = matches[3].split(' ');
			numberOfIds = ids.length;

			if (numberOfPlayers < numberOfIds) {
				ids = ids.slice(0, numberOfPlayers);
			}
		}

		if (numberOfPlayers > numberOfIds) {
			ids.push(userId);
		}

		return (operator === '+') ?
			addPlayers(numberOfPlayers, ids, res) :
			removePlayers(numberOfPlayers, ids, res);
	} else {
		return emptyResponse(res);
	}
}

/*function send(payload) {
	request({
		uri: config.incomingWebHook.uri,
		method: 'POST',
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if (error) {
			throw new Error('We have an error: ' + error.message);
		} else if (response.statusCode !== 200) {
			throw new Error('We have an incorrect response (status code ' + response.statusCode + '): ' + body);
		}
		//console.log(error, response, body);
	});
}*/

module.exports = function (req, res, next) {
	var userName = req.body.user_name;

	console.log(req.body);

	// avoid infinite loop
	if (userName !== 'slackbot') {
		return parse(req.body, res);
	} else {
		return res.status(200).end();
	}
};
