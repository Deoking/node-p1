//http 서버
var http = require('http');

//socket io 모듈
var io = require('socket.io')(http);

//debug 모듈
var debug = require('debug')('node:socket.io');

/**
 * socket IO 이벤트 설정
 */
io.on('connection', function (socket) {
    debug('a user connected');

    socket.on('chat message',function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        debug('user disconnect');
    })
});

module.exports = io;