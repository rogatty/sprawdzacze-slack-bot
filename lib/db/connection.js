'use strict';

module.exports = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.OPENSHIFT_POSTGRESQL_DB_HOST,
        port: process.env.OPENSHIFT_POSTGRESQL_DB_PORT,
        user: process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME,
        password: process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD,
        database: process.env.OPENSHIFT_APP_NAME
    }
});
