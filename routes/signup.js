var express = require('express');
var router = express.Router();
//서비스 모듈
var userService = require('../services/user');
//debug 모듈
var debug = require('debug')('node:signup-router');

/* GET users listing. */
router.route('/').get(function (req, res, next) {
    res.render('signup', {title: 'Sign up'});
});

//회원가입
router.route('/').post( function (req, res, next) {
    //res.render('join', {title: 'Join'});
    debug(req.body);
    debug('/add -> call userService.addUser');

    var params = req.body;
    // nodejs는 이벤트 기반 플랫폼으로 모든 요청 및 응답이 비동기로 이루어진다.
    // 무조건적으로 쿼리 수행 후에 로직이 이루어져야 하므로 콜백함수로 처리한다.
    var callback = function(err, result){
        if(result){
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    };
    userService.addUser(params, callback);
});

module.exports = router;
