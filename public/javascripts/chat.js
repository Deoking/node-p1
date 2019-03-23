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

function createChatDialog(targetId) {
    var chatDialog = $('#chatDialog'),
        chatArea = $('#chatArea');

    chatDialog.find('#clientId').val(targetId);
    if(!chatDialog.hasClass('ui-dialog-content')){
        chatDialog.dialog({
            autoOpen: false,
            modal: true,
            height: 400,
            width: 500,
            title: 'Talk with " Administrator "'
        });
    }

    if (!chatDialog.dialog('isOpen')) {
        chatDialog.dialog('open');

        //기존 대화 지우기
        chatArea.empty();
        chatArea.animate({
            scrollTop: chatArea.scrollTop() + chatArea.height()
        });

        $('#chatInput').val('');
    }
}