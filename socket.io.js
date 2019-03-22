//http 서버
var http = require('http');

//socket io 모듈
var io = require('socket.io')(http);

//debug 모듈
var debug = require('debug')('node:socket.io');

//관리자 저장용.
var admin={};

/**
 * socket IO 이벤트 설정
 */
//유저가 접속했을때
io.on('connection', function (socket) {

    /********************
     *** 공통이벤트 정의 **
     ********************/
    debug('a user connected');
    debug('connected socket ID : ' + socket.conn.id);
    
    //로그인이벤트
    socket.on('login', function (data) {
        debug('Client Login. logged in Client data : ');


        var socketId = socket.conn.id;
        var name = data.name;
        var role = data.role;

        debug('socketID : ' + socketId + ', name : ' + name + ', role : ' + role);
        
        //로그인한 사용자의 데이터를 소켓에 저장
        socket.name = name;
        socket.role = role;

        //관리자일 경우 관리자 오브젝트에 정보 저장.
        if('administrator' == role){
            admin.name = name;
            admin.role = role;
            admin.socketId = socketId;

            io.to(admin.socketId).emit('notifyClientLoginListToAdmin', getClientList());

            debug('save admin data : ');
            debug(admin);
        }else{
            //관리자가 아닐경우
            //접속자의 socketId를 세팅
            data.socketId = socketId;
            //관리자에게 접속정보 전달
            io.to(admin.socketId).emit('notifyClientLoginToAdmin', data);
        }
    });
    
    /**
     * disconnection 발생 이유(cause)들
     *
     * transport error              -	Server Side	Transport error
     * server namespace disconnect	-   Server Side	Server performs a socket.disconnect()
     * client namespace disconnect	-   Client Side	Got disconnect packet from client
     * ping timeout	                -   Client Side	Client stopped responding to pings in the allowed amount of time (per the pingTimeout config setting)
     * transport close	            -   Client Side	Client stopped sending data
    */
    socket.on('disconnect', function (cause) {
        debug('user disconnect. ID : '+ socket.conn.id +' cause : ' + cause);
        io.to(admin.socketId).emit('notifyClientLogoutToAdmin', socket.conn.id);
    })

    /*********************
     ** 관리자이벤트 정의 **
     ********************/

    //관리자 -> 사용자(단일) 메시지
    socket.on('messageToUser', function (data) {

    });

    //관리자 -> 사용자(전체) 메시지
    socket.on('messageToUsers', function (data) {

    });

    /*********************
     ** 사용자이벤트 정의 **
     ********************/
});

//접속 클라이언트 가져오기
function getClientList (roomId, namespace){
    var res = []
        // 네임스페이스 기본값 = '/'
        , ns = io.of(namespace || '/');

    var isAdministrator;

    if (ns) {
        for(var id in ns.connected){

            var socket = ns.connected[id];

            isAdministrator = socket.role == 'administrator';

            if(roomId) {
                var index = socket.rooms.indexOf(roomId);
                if(index !== -1) {
                    if(!isAdministrator){
                        res.push(createClientInfo(socket));
                    }
                }
            } else {
                if(!isAdministrator){
                    res.push(createClientInfo(socket));
                }
            }
        }
    }
    return res;
}

//클라이언트 정보 생성
function createClientInfo(socket) {
    var data = {};
    data.name = socket.name || 'Anonymous';
    data.role = socket.role || 'anonymous';
    data.socketId = socket.id;

    return data;
}

module.exports = io;