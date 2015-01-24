'use strict';

module.exports = function (req, res) {
	var secret = req.params.secret;

	if (secret) {
		res.locals = {
			secret: secret
		};

		return res.render('dashboard');
	} else {
		return res.render('dashboardAll');
	}
};
