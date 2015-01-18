'use strict';

module.exports = function (req, res) {
	var secret = req.params.secret;

	res.locals = {
		secret: secret
	};

	return res.render('dashboard');
};
