'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3000,

	bot = require('./lib/bot'),
	dashboard = require('./lib/dashboard'),
	db = require('./lib/db'),
	config = require('./config.json');

// body parser middleware
app.use(bodyParser.urlencoded({
	extended: true
}));

// index
app.route('/')
	.get(function (req, res) {
		res.status(200).send('<html><body><img src="' + config.slapGif + '"></body></html>');
	});

// error handler
app.use(function (req, res, next, err) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Slack bot listening on port ' + port);
});

app.route('/bot').post(bot);

app.route('/dashboard/:secret').get(dashboard);

app.route('/setdb')
	.get(function (req, res) {
		db.setup()
			.then(function (msg) {
				res.status(200).send(msg);
			})
			.catch(function (error) {
				res.status(500).send(error);
			});
	});
