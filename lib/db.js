'use strict';

var save = require('./db/save'),
	setup = require('./db/setup'),
	stats = require('./db/stats');

module.exports = {
	save: save,
	setup: setup,
	stats: stats
};
