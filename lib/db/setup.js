'use strict';

var Promise = require('bluebird'),
	sha1 = require('sha1'),
	db = require('./connection'),
	utils = require('./utils');

function createTableUser() {
	return db.schema.createTable(utils.table.user, function (table) {
		table.increments();
		table.string('secret').unique();
		table.string('slack_id');
	});
}

function createTableMatch() {
	return db.schema.createTable(utils.table.match, function (table) {
		table.increments();
		table.dateTime('date_time');
	});
}

function createTablePlayer() {
	return db.schema.createTable(utils.table.player, function (table) {
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
		db(utils.table.user)
			.column('id')
			.whereNull('secret')
			.then(function (rows) {
				var userIds = [];

				if (rows.length) {
					rows.forEach(function (row) {
						userIds.push(updateUserSecret(row.id));
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

function updateUserSecret(userId) {
	//TODO check if it's not a duplicate (low chance, low priority)
	var secret = sha1(Math.random().toString(36) + userId);

	return db(utils.table.user)
		.returning('id')
		.where({
			id: userId
		})
		.update({
			secret: secret
		});
}

function setup() {
	return new Promise(function (resolve, reject) {
		db.schema.hasTable(utils.table.user).then(function (exists) {
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
