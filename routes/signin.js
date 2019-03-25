var express = require('express');
var router = express.Router();

//서비스 모듈
var userService = require('../services/user');

//debug 모듈
var debug = require('debug')('node:signup-router');

//로그인폼 && 세션 존재할경우 메인페이지
router.route('/').get(function(req, res, next) {
    debug('session check : ');
    debug(req.session.user);
    if(req.session.user){
        res.redirect('/main');
    }else{
        res.render('signin', { title: 'Sign in' });
    }

});

//로그인
router.route('/signin').post(function(req, res, next) {

    debug('Sign in data : ');
    debug(req.body);

    var callback = function(err, rows){
        res.redirect('/main');
    };

    var params = req.body;

    userService.getUser(req, params, callback);
});

//로그아웃
router.route('/logout').get(function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
