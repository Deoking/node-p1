//채팅 메시지 생성
function createMessage(isMyMsg, msg) {
    var chatItem = $('<div></div>'),
        myMessage = $('<div></div>'),
        chatArea = $('#chatArea');

    chatItem.addClass('chat-item');
    myMessage.addClass(isMyMsg ? 'my-message' : 'other-message');
    myMessage.html(msg);
    chatItem.append(myMessage);
    chatArea.append(chatItem);

    chatArea.animate({
        scrollTop : chatArea.scrollTop() + chatArea.height()
    });

    return chatArea;
}
function createRoomInfoEl(data) {
    var roomDataDiv = $('<div></div>');
    roomDataDiv.attr('id', data.id);
    roomDataDiv.html(data.name);

    return roomDataDiv;
}

//접속 클라이언트 정보생성
function createClientInfoEl(data) {
    //로그인한 사용자의 아이디를 리스트에 부여
    var clientDataDiv = $('<div></div>');
    clientDataDiv.attr('id', 'client-' + data.id);
    clientDataDiv.addClass('connect-clients-item');
    
    //사용자 데이터가 들어갈 폼
    var clientDataForm = $('<form></form>');

    //사용자를 표현할 div
    var client = $('<div></div>');
    client.attr('id', 'item-' + data.id);
    client.addClass('client-div');
    //표현될 사용자 정보
    client.html(data.isMe ? data.name + ' - me' : data.name);
    clientDataDiv.append(client);

    //채팅 및 쪽지 버튼
    var funcDiv = $('<div></div>');
    funcDiv.append(createFuncBtns());
    clientDataDiv.append(funcDiv);

    //클라이언트 데이터 폼 생성
    clientDataForm.attr('id', data.socketId);
    var keys = Object.keys(data);

    for (var i=0; i<keys.length; i++){
        var value = data[keys[i]];
        var clientData = $('<input>');
        clientData.attr('type', 'hidden');
        clientData.attr('name', keys[i]);
        clientData.attr('value', value);
        clientDataForm.append(clientData);
    }

    //이벤트 부여
    clientDataDiv.on('mouseover', function(){
        clientDataDiv.find('.btn-div').removeClass('display-none');
    });
    clientDataDiv.on('mouseout', function(){
        clientDataDiv.find('.btn-div').addClass('display-none');
    });

    clientDataDiv.append(clientDataForm);

    return clientDataDiv;
}

//기능버튼 생성
function createFuncBtns() {
    var btnDiv = $('<div></div>');
    var img = $('<img/>');
    img.attr('src', '/images/talk.png');
    btnDiv.addClass('btn-div');
    btnDiv.addClass('display-none');
    btnDiv.append(img);

    return btnDiv;
}

//클라이언트 socketId 변경
function updateClientInfo(data) {
    var clientDataDiv = $('#client-' + data.id);
    var div = clientDataDiv.find('#item-' +  data.id);
    div.html(data.name);
    clientDataDiv.find('form').attr('id', data.socketId);
    clientDataDiv.find('input[name=socketId]').val(data.socketId);
}

//채팅창 생성
function createChatDialog(data, mode) {
    var chatDialog = $('#chatDialog'),
        chatArea = $('#chatArea'),
        existSocketId = chatDialog.find('#targetClientSocketId').val();

    if(existSocketId && existSocketId != data.socketId){
        chatDialog.dialog('close');
    }

    chatDialog.find('#targetClientSocketId').val(data.socketId);
    chatDialog.find('#chatMode').val(mode);
    if(!chatDialog.hasClass('ui-dialog-content')){
        chatDialog.dialog({
            autoOpen: false,
            modal: true,
            height: 400,
            width: 500
        });
    }

    if (!chatDialog.dialog('isOpen')) {
        chatDialog.dialog('open');
        chatDialog.dialog('option', 'title', 'Talk with " '+ data.name +' "');
        //기존 대화 지우기
        chatArea.empty();
        chatArea.animate({
            scrollTop: chatArea.scrollTop() + chatArea.height()
        });

        $('#chatInput').val('');
    }
}

//클라이언트를 접속리스트에 추가
function addClientToList(data) {
    var connectClientListDiv = $('#clientList');
    var listedClient;
    var clientItem = createClientInfoEl(data);

    if (!data.isMe) {
        clientItem.find('img').on('click', function () {
            var clientFormData = arrayToObject($('#' + data.socketId).serializeArray());
            createChatDialog(clientFormData, 'single');
        });
    }
    //이미 접속된 클라이언트인지 확인
    listedClient = connectClientListDiv.find('#client-' + data.id);

    //접속되지않은 클라이언트면 리스트에 추가
    if (listedClient.length == 0) {
        connectClientListDiv.append(clientItem);
    } else {
        listedClient.remove();
        connectClientListDiv.append(clientItem);
    }
}

//방 리스트에 방에 추가
function addRoomToList(data) {
    var roomListDiv = $('#roomList');
    var roomItem = createRoomInfoEl(data);
    roomListDiv.append(roomItem);
}

function arrayToObject(array) {
    var object  = {};

    for (var i = 0; i < array.length; i++) {
        object[array[i].name] = array[i].value;
    }

    return object;
}