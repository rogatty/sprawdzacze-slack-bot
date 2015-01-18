'use strict';

var save = require('./db/save'),
	setup = require('./db/setup'),
	stats = require('./db/stats'),
	utils = require('./db/utils');

module.exports = {
	save: save,
	setup: setup,
	stats: stats,
	utils: utils
};
