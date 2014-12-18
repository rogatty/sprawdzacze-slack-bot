'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	bot = require('./bot'),
	config = require('./config.json'),
	app = express(),
	port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({
	extended: true
}));

// test route
app.get('/', function (req, res) {
	res.status(200).send('Stop, you!')
});

// error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Slack bot listening on port ' + port);
});

app.post('/bot', bot);
