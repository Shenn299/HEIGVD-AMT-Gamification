var env = require('../../env.local.json');
const DATABASE_IP = process.env.DATABASE_IP || env.default.DATABASE_IP;
const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME || env.default.DATABASE_USER_NAME;
const DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD || env.default.DATABASE_USER_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME || env.default.DATABASE_NAME;

// Get the client
var mysql = require('mysql2');

// Empty the MySQL database tables
function emptyTables() {

    // create the connection to database
    var connection = mysql.createConnection(
        {
            host: DATABASE_IP,
            user: DATABASE_USER_NAME,
            password: DATABASE_USER_PASSWORD,
            database: DATABASE_NAME
        }
    );

    // Tables to empty
    var tablesToEmpty = [
        "application",
        "award",
        "badge",
        "event",
        "point_scale",
        "rule",
        "user"
    ]

    // Info
    console.log("Database cleaning...");

    // Empty tables
    for (var i = 0; i < tablesToEmpty.length; ++i) {
        connection.query("DELETE FROM " + tablesToEmpty[i], function (err, results, fields) { });
    }

    console.log("done");
}

module.exports = {
    emptyTables: emptyTables
};