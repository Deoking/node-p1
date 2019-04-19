var pg = require("pg");
var connectionString = "pg://postgres:deoki@localhost:5432/deoki";
var client = new pg.Client(connectionString);

module.exports = client();