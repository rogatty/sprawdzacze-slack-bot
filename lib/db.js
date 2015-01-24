'use strict';

var save = require('./db/save'),
	setup = require('./db/setup'),
	stats = require('./db/stats'),
	statsAll = require('./db/statsAll'),
	utils = require('./db/utils');

module.exports = {
	save: save,
	setup: setup,
	stats: stats,
	statsAll: statsAll,
	utils: utils
};
