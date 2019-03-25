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
        var account = data.account;
        var name = data.name;
        var id = data.id;

        debug('socketID : ' + socketId + ', account : '+ account +', name : ' + name + ', id : ' + id);
        
        //로그인한 사용자의 데이터를 소켓에 저장
        socket.account = account;
        socket.name = name;
        socket.userId = id;
        data.socketId = socketId;

        socket.emit('notifyClientLoginList', getClientList());
        socket.broadcast.emit('notifyClientLogin', data);

        //관리자일 경우 관리자 오브젝트에 정보 저장.
        /*
        if('administrator' == role){
            admin.name = name;
            admin.role = role;
            admin.socketId = socketId;
            
            //관리자에게만 현재 사용자 리스트 알림이벤트를 전송
            io.to(admin.socketId).emit('notifyClientLoginListToAdmin', getClientList());
            //관리자를 제외한 모든 클라이언트에게 관리자 로그인이벤트를 전송
            socket.broadcast.emit('notifyAdministratorLogin');

            debug('save admin data : ');
            debug(admin);
        }else{
            //관리자가 아닐경우
            //접속자의 socketId를 세팅
            data.socketId = socketId;
            //관리자에게 접속정보 전달
            io.to(admin.socketId).emit('notifyClientLoginToAdmin', data);
        }
        */
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
        socket.broadcast.emit('notifyClientLogout', socket.userId);
        //로그아웃한 클라이언트가 관리자일경우 관리자객체 비움
       /* if(socket.role == 'administrator'){
            //관리자를 제외한 모든 클라이언트에게 관리자 로그아웃 이벤트 전송
            socket.broadcast.emit('notifyAdministratorLogout');
            debug('administrator logged out.');
            admin = {};
        }else{
            //관리자에게 클라이언트 로그아웃 알림이벤트 전송

        }*/

    })

    /*********************
     ** 관리자이벤트 정의 **
     ********************/

    //사용자 -> 사용자(단일) 메시지
    socket.on('sendMessageToClient', function (data, fn) {
        var target = data.client;

        data.client = socket.id;
        data.name = socket.name;
        data.sender = socket.id;
        data.recieve = target;
        //타겟 클라이언트의 채팅창 오픈 이벤트부터 실행

        console.log(data);

        if(data.mode == 'single'){
            io.to(target).emit('openChatDialog', data);

            //메시지 전송 이벤트 실행
            io.to(target).emit('recieveMessageFromClient', data);
        }else{
            socket.broadcast.emit('openChatDialog', data);
            socket.broadcast.emit('recieveMessageFromClient', data);
        }

        fn(data.msg);
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

    if (ns) {
        for(var id in ns.connected){

            var socket = ns.connected[id];

            if(roomId) {
                var index = socket.rooms.indexOf(roomId);
                if(index !== -1) {
                    res.push(createClientInfo(socket));
                }
            } else {
                res.push(createClientInfo(socket));
            }
        }
    }
    return res;
}

//클라이언트 정보 생성
function createClientInfo(socket) {
    var data = {};
    data.name = socket.name;
    data.id = socket.userId;
    data.account = socket.account;
    data.socketId = socket.id;

    return data;
}

module.exports = io;