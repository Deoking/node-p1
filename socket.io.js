//http 서버
var http = require('http');

//socket io 모듈
var io = require('socket.io')(http);

//debug 모듈
var debug = require('debug')('node:socket.io');

//접속유저 socket ID 저장
var login = {};

/**
 * socket IO 이벤트 설정
 */
io.on('connection', function (socket) {
    debug('a user connected');
    debug('socket ID : ' + socket.conn.id);

    socket.on('chat message',function (msg) {
        io.emit('chat message', msg);
    });

    /**
     * disconnection cause>>
     *
     * transport error              -	Server Side	Transport error
     * server namespace disconnect	-   Server Side	Server performs a socket.disconnect()
     * client namespace disconnect	-   Client Side	Got disconnect packet from client
     * ping timeout	                -   Client Side	Client stopped responding to pings in the allowed amount of time (per the pingTimeout config setting)
     * transport close	            -   Client Side	Client stopped sending data
    */
    socket.on('disconnect', function (cause) {
        debug('user disconnect. cause : ' + cause);
    })
});

module.exports = io;