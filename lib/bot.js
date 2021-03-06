'use strict';

var config = require('./../config.json'),
	db = require('./db'),
	patterns = {
		change: /^(\+|\-)([1-4])\s*((?:\s*<@U.+>)*)/
	},
	state = {
		numberOfPlayers: 0,
		ids: []
	},
	httpHost;

function changePlayers(matches, slackId, res) {
	var operator = matches[1],
		numberOfPlayers = parseInt(matches[2], 10),
		ids = [],
		numberOfIds = 0;

	if (matches[3]) {
		ids = matches[3].split(' ');
		numberOfIds = ids.length;

		if (ids.indexOf('<@USLACKBOT>') > -1) {
			return slap(res);
		}

		if (numberOfPlayers < numberOfIds) {
			ids = ids.slice(0, numberOfPlayers);
		}
	}

	if (numberOfPlayers > numberOfIds) {
		ids.push(slackId);
	}

	return (operator === '+') ?
		addPlayers(numberOfPlayers, ids, res) :
		removePlayers(numberOfPlayers, ids, res);
}

function addPlayers(numberOfPlayers, ids, res) {
	var playersAdded,
		players,
		idsAdded = [],
		numberOfPlayersAdded = 0,
		payload,
		i;

	if (numberOfPlayers > 4 - state.numberOfPlayers) {
		return tooManyPlayers(res);
	}

	for (i = 0; i < numberOfPlayers; i++) {
		if (typeof ids[i] !== 'undefined' && state.ids.indexOf(ids[i]) === -1) {
			//add player if it's not a duplicate
			state.ids.push(ids[i]);
			state.numberOfPlayers++;

			//track for the reply message
			idsAdded.push(ids[i]);
			numberOfPlayersAdded++;
		} else {
			//add Anon
			state.numberOfPlayers++;
			numberOfPlayersAdded++;
		}
	}

	playersAdded = getListOfPlayers(idsAdded, numberOfPlayersAdded);
	players = getListOfPlayers(state.ids, state.numberOfPlayers);

	if (state.numberOfPlayers >= 4) {
		return startMatch(res);
	} else {
		payload = {
			text: 'Added players ' + playersAdded,
			attachments: [{
				fallback: 'Current players: ' + players,
				fields: [{
					title: 'Current players',
					value: players,
					short: true
				}, {
					title: 'Number of players',
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
		playersRemoved,
		players,
		payload;

	if (state.numberOfPlayers > 0) {
		ids.forEach(function (id) {
			index = state.ids.indexOf(id);

			if (index > -1) {
				state.ids.splice(index, 1);
				state.numberOfPlayers--;
				idsRemoved.push(id);
			}
		});
	}

	if (idsRemoved.length) {
		playersRemoved = idsRemoved.join(' ');
		players = getListOfPlayers(state.ids, state.numberOfPlayers);

		payload = {
			text: 'Removed players ' + playersRemoved,
			attachments: [{
				color: 'warning',
				fields: [{
					title: 'Current players',
					value: players,
					short: true
				}, {
					title: 'Number of players',
					value: state.numberOfPlayers + '/4',
					short: true
				}]
			}]
		};
	} else {
		payload = {
			text: 'No players were removed, try `help` if you have problems'
		};
	}

	return res.status(200).json(payload);
}

function slap(res) {
	var payload = {
		text: 'No, you can\'t. Please take that as a warning ' + config.slapGif
	};

	return res.status(200).json(payload);
}

function startMatch(res) {
	var players = getListOfPlayers(state.ids, state.numberOfPlayers),
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

	db.save(state.ids);

	state.numberOfPlayers = 0;
	state.ids = [];

	return res.status(200).json(payload);
}

function currentStatus(res) {
	var players = getListOfPlayers(state.ids, state.numberOfPlayers),
		payload = {
			text: 'Current status',
			attachments: [{
				fallback: 'Players: ' + players,
				fields: [{
					title: 'Players',
					value: players,
					short: true
				}, {
					title: 'Number of players',
					value: state.numberOfPlayers + '/4',
					short: true
				}]
			}]
		};

	return res.status(200).json(payload);
}

function reset(res) {
	var payload = {
		text: 'Status restarted, let\'s start from scratch',
		attachments: [{
			color: 'good',
			fallback: 'Number of players: 0/0',
			fields: [{
				title: 'Number of players',
				value: '0/0'
			}]
		}]
	};

	state.numberOfPlayers = 0;
	state.ids = [];

	return res.status(200).json(payload);
}

function tooManyPlayers(res) {
	var players = getListOfPlayers(state.ids, state.numberOfPlayers),
		payload = {
			text: 'You tried to add too many players, try again',
			attachments: [{
				color: 'danger',
				fallback: 'Current players: ' + players,
				fields: [{
					title: 'Current players',
					value: players,
					short: true
				}, {
					title: 'Number of players',
					value: state.numberOfPlayers + '/4',
					short: true
				}]
			}]
		};

	return res.status(200).json(payload);
}

function emptyResponse(res) {
	return res.status(200).end();
}

function getListOfPlayers(ids, numberOfPlayers) {
	var players = ids.join(' '),
		i;

	if (numberOfPlayers > ids.length) {
		for (i = 0; i < numberOfPlayers - ids.length; i++) {
			players += ' :bandit:non';
		}
	}

	if (players.length === 0) {
		return 'No players';
	}

	return players;
}

function help(res) {
	var payload = {
		text: config.helpMessage.join('\n')
	};

	return res.status(200).json(payload);
}

function stats(res) {
	var payload = {
		text: 'Take a look at public dashboard http://' + httpHost + '/dashboard or get a personalized one with `/stats`'
	};

	return res.status(200).json(payload);
}

function parse(body, res) {
	var slackId = '<@' + body.user_id + '>',
		changeMatches = body.text ? body.text.match(patterns.change) : false;

	if (body.text === 'status') {
		return currentStatus(res);
	} else if (body.text === 'reset') {
		return reset(res);
	} else if (body.text === 'help') {
		return help(res);
	} else if (body.text === 'stats') {
		return stats(res);
	} else if (changeMatches) {
		return changePlayers(changeMatches, slackId, res);
	} else {
		return emptyResponse(res);
	}
}

module.exports = function (req, res) {
	var userName = req.body.user_name;
	httpHost = req.headers.host;

	// avoid infinite loop
	if (userName !== 'slackbot') {
		return parse(req.body, res);
	} else {
		return res.status(200).end();
	}
};
