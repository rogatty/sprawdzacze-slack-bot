'use strict';

module.exports = function (req, res) {
	res.locals = {
		matches: 10
	};

	return res.render('index');
};
