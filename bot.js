'use strict';

var //request = require('request'),
	//config = require('./config.json'),
	patterns = {
		changeStatus: /^(\+|\-)([1-4])/
	},
	state = {
		numberOfPlayers: 0,
		players: []
	};

function addPlayers(userName, numberOfPlayers, res) {
	if (state.players.indexOf(userName) === -1) {
		state.players.push(userName);
	}
	state.numberOfPlayers += numberOfPlayers;

	console.log('####');
	console.log(state);

	if (state.numberOfPlayers === 4) {
		return startMatch(res);
	} else {
		return currentStatus(res);
	}
}

function removePlayers(userName, numberOfPlayers, res) {
	var index = state.players.indexOf(userName);
	if (index > -1) {
		state.players.slice(index, 1);
	}

	if (state.numberOfPlayers > 0) {
		state.numberOfPlayers -= numberOfPlayers;
	}

	console.log('####');
	console.log(state);

	return currentStatus(res);
}

function startMatch(res) {
	var players = state.players.join(' '),
		payload = {
			text: 'GO GO GO!',
			attachments: [{
				fallback: 'Players: ' + players,
				fields: [{
					title: 'Players',
					value: players
				}]
			}]
		};

	state.numberOfPlayers = 0;
	state.players = [];

	console.log('#### START MATCH');
	return res.status(200).json(payload);
}

function currentStatus(res) {
	var payload = {
		text: state.numberOfPlayers + '/4'
	};

	return res.status(200).json(payload);
}

function emptyResponse(res) {
	return res.status(200).end();
}

function parse(body, res) {
	var userName = '@' + body.user_name,
		matches = body.text.match(patterns.changeStatus),
		operator = '',
		numberOfPlayers = 0;

	console.log(matches);

	if (matches) {
		operator = matches[1];
		numberOfPlayers = parseInt(matches[2], 10);

		return (operator === '+') ?
			addPlayers(userName, numberOfPlayers, res) :
			removePlayers(userName, numberOfPlayers, res);
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
