'use strict';

var Promise = require('bluebird'),
	db = require('./connection');

function createTableUser() {
	return db.schema.createTable('user', function (table) {
		table.increments();
		table.string('secret');
		table.string('slack_id');
	});
}

function createTableMatch() {
	return db.schema.createTable('match', function (table) {
		table.increments();
		table.dateTime('date_time');
	});
}

function createTablePlayer() {
	return db.schema.createTable('player', function (table) {
		table.increments();
		table.integer('user_id')
			.unsigned()
			.references('id')
			.inTable('user')
			.onDelete('CASCADE');
		table.integer('match_id')
			.unsigned()
			.references('id')
			.inTable('match')
			.onDelete('CASCADE');
	});
}

function createTables() {
	return createTableUser()
		.then(createTableMatch)
		.then(createTablePlayer);
}

function createUserSecrets() {
	return new Promise(function (resolve, reject) {
		db('public.user')
			.column('id')
			.whereNull('secret')
			.then(function (rows) {
				var userIds = [];

				if (rows.length) {
					rows.forEach(function (row) {
						userIds.push(row.id);
					});

					Promise.all(userIds)
						.then(function () {
							resolve('Missing user secrets have been created');
						})
						.catch(reject);
				} else {
					resolve('All users already have secrets');
				}
			})
			.catch(reject);
	});
}

function setup() {
	return new Promise(function (resolve, reject) {
		db.schema.hasTable('user').then(function (exists) {
			if (exists) {
				createUserSecrets()
					.then(resolve)
					.catch(reject);
			} else {
				createTables()
					.then(function () {
						resolve('Database was set up');
					})
					.catch(function (error) {
						reject('There was error when trying to set up database: ' + error);
					});
			}
		});
	});
}

module.exports = setup;
