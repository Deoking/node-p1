var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res, next) {
    //세션이 없을경우 로그인페이지로.
    if(!req.session.user){
        res.redirect('/');
    }else{
        var user = req.session.user;

        res.render('main', { title: 'Main chat lobby', user : user });
    }
});

module.exports = router;