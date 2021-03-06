'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/PULSeBS_DB.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    /* istanbul ignore if */
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
