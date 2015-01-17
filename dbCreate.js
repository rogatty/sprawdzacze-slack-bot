'use strict';

var db = null;

function createTableUser() {
	return db.schema.createTable('user', function (table) {
		table.increments();
		table.string('user_id');
		table.integer('match_id')
			.unsigned()
			.references('id')
			.inTable('match')
			.onDelete('CASCADE');
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
		table.string('user_id');
		table.integer('match_id')
			.unsigned()
			.references('id')
			.inTable('match')
			.onDelete('CASCADE');
	});
}

function createTables(dbConnection) {
	db = dbConnection;

	return createTableUser()
		.then(createTableMatch)
		.then(createTablePlayer);
}

module.exports = {
	createTables: createTables
};
