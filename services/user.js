var connPool = require('./../database/connection');
//debug 모듈
var debug = require('debug')('node:user-service');

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

            var queryData = {user_id : params.account, user_name : params.name, user_password : params.password1};
            var exec = conn.query('insert into users set ?', queryData, function (err, result) {
                var result = false;
                conn.release();
                debug('execute query : ' + exec.sql);

                if(err){
                    console.log(err);
                    callback(err, null);
                    return result;
                }
                callback(null, result);
                result = true;

                debug('addUser result : ' + result);

                return result;
            });
        });
    },
    
    //사용자 가져오기
    getUser : function (req, params, callback) {
        connPool.getConnection(function (err, conn) {
            if(err){
                if(conn){
                    conn.release();
                }
                callback(err, null);
                return false;

            }
            debug('Database connection thread ID : ' + conn.threadId);

            var columns = ['id', 'user_id', 'user_name'];

            var exec = conn.query('select ?? from users where user_id = ? and user_password  = ?',[columns, params.account, params.password] , function (err, rows) {
                var result = false;
                conn.release();
                debug('execute query : ' + exec.sql);

                if(err){
                    console.log(err);
                    callback(err, null);
                    return result;
                }

                if(rows.length > 0){
                    debug('User with matching account and password entered exists. - ' + params.account);
                    debug('Save user information to session.');
                    var user = rows[0];
                    req.session.user = {
                        id : user.id,
                        account : user.user_id,
                        name : user.user_name,
                        authorized : true
                    }
                }else{
                    debug('Failed to find user with entered account and password. - ' + params.account);
                    callback(null, null);
                    return result;
                }
                callback(null, rows);
            });
        });
    }
}

module.exports = joinService;