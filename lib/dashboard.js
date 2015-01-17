'use strict';

module.exports = function (req, res) {
	return res.status(200).send('This will fetch data from /stats and display it in a fancy way');
};
