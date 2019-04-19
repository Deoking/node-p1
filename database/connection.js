var mysql = require('mysql');
var config = require('./config');

var getConnectionPool = function() {
    var pool = mysql.createPool({
        connectionLimit : 10,
        host : config.host,
        user : config.username,
        password : config.password,
        database : config.database,
        debug : false
    });
    return pool;
};

module.exports = getConnectionPool();