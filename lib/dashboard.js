'use strict';

module.exports = function (req, res) {
	var secret = req.params.secret;

	res.locals = {
		secret: secret,
		matches: 10
	};

	return res.render('dashboard');
};
