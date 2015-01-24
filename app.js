'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	port = process.env.PORT || 3000,

	bot = require('./lib/bot'),
	slash = require('./lib/slash'),
	dashboard = require('./lib/dashboard'),
	stats = require('./lib/stats'),
	userInfo = require('./lib/userInfo'),
	db = require('./lib/db'),
	config = require('./config.json');

// this file is not in the repo as it holds private keys
// on Heroku they live in environment variables already
try {
	require('./setEnv')();
} catch (e) {}

// body parser middleware
app.use(bodyParser.urlencoded({
	extended: true
}));

// middleware for easy rendering async query
app.use(require('express-promise')());

// static assets
app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

// error handler
app.use(function (req, res, next, err) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Slack bot listening on port ' + port);
});

// index
app.route('/')
	.get(function (req, res) {
		res.status(200).send('<html><body><img src="' + config.slapGif + '"></body></html>');
	});

app.route('/bot').post(bot);

app.route('/slash').get(slash);

app.route('/dashboard/:secret').get(dashboard);

app.route('/stats/:secret').get(stats);

app.route('/user-info/:secret').get(userInfo);

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
