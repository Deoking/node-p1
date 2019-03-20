var createError = require('http-errors');
//express 서버 세팅
var express = require('express');

//path모듈 -> 현재 파일 위치나 각종 path관련 함수모듈
var path = require('path');
var cookieParser = require('cookie-parser');
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
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//_dirname은 현재 파일(app.js)의 위치를 의미. 뷰 폴더를 views로 세팅한다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
