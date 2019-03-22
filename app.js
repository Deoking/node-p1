//HTTP 에러 모듈
var createError = require('http-errors');
//express 서버 세팅
var express = require('express');

//path모듈 -> 현재 파일 위치나 각종 path관련 함수모듈
var path = require('path');

//쿠키사용 모듈
var cookieParser = require('cookie-parser');

//logger 모듈
var logger = require('morgan');

/**
 *  require 메서드 사용시 모듈의 경로를 적는다.
 *  이때 해당 경로에 파일이 존재하지 않을경우 파라미터로 들어온 경로를 디렉터리로 인식하고
 *  그 디렉터리 하위의 index.js를 가져온다.
 *
 *  ex ) 현재 폴더구조에서 (./routes/index.js)
 *  var indexRouter = require('./routes/index'); 이 구문은
 *  var indexRouter = require('./routes/'); 와 동일하게 동작한다.
 */
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// 뷰 엔진 설정
//_dirname은 현재 파일(app.js)의 위치를 의미. 뷰 폴더를 views로 세팅한다.
app.set('views', path.join(__dirname, 'views'));

//view 엔진은 pug로 설정. (pug 문법 매우 간결하고 쉽다!!!!)
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//URL 매핑
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// 404에러 핸들러
app.use(function (req, res, next) {
    next(createError(404));
});

// 에러 핸들러
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
