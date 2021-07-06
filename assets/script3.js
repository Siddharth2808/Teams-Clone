const socket = io('/');
const myPeer = new Peer();
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id, userop);
})

socket.on('user-connected', (userId, userOp) => {
    console.log('User connected', userId, userOp);
    let msg = userOp+" just came online";
    socket.emit('message', msg,"Bot");
})

socket.on('user-disconnected', (userId, userOp) => {
    let msg = userOp+" just went offline";
    socket.emit('message', msg,"Bot");
})


let msg = $('#chat_message');
$('html').keydown((e) => {
    if(e.which == 13 && msg.val().length !== 0){
        
        socket.emit('message', msg.val(),userop);
        msg.val('');
    }
})


socket.on('createMessage', (message,userOp) => {
    $('.messages').append(`<li class = "message"><b>${userOp}</b></br>${message}</li>`)
    scrollToBottom();
})

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}




const getChatop = (now) => {
    chat = now;
    console.log(chat);
    
     if(chat==0)
     {
         document.getElementById("r1").style.display="flex";
         document.getElementById("r2").style.display="none";
     }
    else{
      document.getElementById("r1").style.display="none";
         document.getElementById("r2").style.display="flex";
    }
}