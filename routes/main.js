var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res, next) {
    //세션이 없을경우 로그인페이지로.
    if(!req.session.user){
        res.redirect('/');
    }else{
        var user = req.session.user;
        //메인페이지로 이동, 'user' 란 이름으로 로그인정보 전달
        res.render('main', { title: 'Main chat lobby', user : user });
    }
});

module.exports = router;