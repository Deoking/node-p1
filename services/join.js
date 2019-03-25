var connPool = require('./../database/connection');
//debug 모듈
var debug = require('debug')('node:join-service');

var joinService = {
    
    //사용자 추가
    addUser : function (params, callback) {
        connPool.getConnection(function (err, conn) {
            if(err){
                if(conn){
                    conn.release();
                }
                callback(err, null);
                return false;

            }
            debug('Database connection thread ID : ' + conn.threadId);

            var queryData = {user_id : params.id, user_name : params.name, user_password : params.password1};
            var exec = conn.query('insert into users set ?', queryData, function (err, result) {
                conn.release();
                debug('execute query : ' + exec.sql);

                if(err){
                    console.log(err);
                    callback(err, null);
                    return false;
                }
                callback(null, result);
                return true;
            });
        });
    }
}

module.exports = joinService;