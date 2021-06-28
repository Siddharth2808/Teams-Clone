const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const screenVideo = document.createElement('video');
myVideo.muted = true;
const myScreen = document.getElementById('screen-video');
const myPeer = new Peer();
const peers = {};
const screenpeers ={};
let myStream;

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        })
        call.on('close', () => {
            video.remove();
        })
    })
    socket.on('screen-share', (Id) => {
        const c = myPeer.call(Id, stream);
        const v = document.createElement('video');
        c.on('stream', (s) => {
            addVideoStream(v, s);
        })
        c.on('close', () => {
            v.remove();
        })
    })    
})


socket.on('user-connected', userId => {
    console.log('User connected', userId);
    connectToNewUser(userId, myStream);
})


socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close();
    console.log('User disconnected', userId);
})



const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
    peers[userId] = call;
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}

const addVideoStreamScreen = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    myScreen.append(video);
}

const muteunmute = () => {
    if(myStream.getAudioTracks().length > 0){
        const enabled = myStream.getAudioTracks()[0].enabled;
        if(enabled){
            myStream.getAudioTracks()[0].enabled = false;
            setunmute();
        }else{
            myStream.getAudioTracks()[0].enabled = true;
            setmute();
        }
    }else{
        document.getElementById('mute').innerHTML = 'No audio source';
    }
}

const setmute = () => {
    const html = `
        <i class = "fas fa-microphone"></i>
        <span> Mute </span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setunmute = () => {
    const html = `
        <i class = "unmute fas fa-microphone-slash"></i>
        <span> Unmute </span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

let msg = $('input');
$('html').keydown((e) => {
    if(e.which == 13 && msg.val().length !== 0){
        //console.log(msg.val());
        socket.emit('message', msg.val());
        msg.val('');
    }
})

socket.on('createMessage', message => {
    $('ul').append(`<li class = "message"><b>user</b></br>${message}</li>`)
    scrollToBottom();
})

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

const playStop = () => {
     if(myStream.getVideoTracks().length > 0){
        let enabled = myStream.getVideoTracks()[0].enabled;
        if(enabled){
            myStream.getVideoTracks()[0].enabled = false;
            setVideo();
        }
        else{
            myStream.getVideoTracks()[0].enabled = true;
            setVideoSlash();
        } 
     }
     else{
         document.getElementById('setvideo').innerHTML = 'No Video Source';
     }
}

const setVideo = () => {
    const html = `
        <i class = " stop fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setVideoSlash = () => {
    const html = `
        <i class = " fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}



let screenshare;
let display = 0;

const screen = () => {
    
    if(display == 0){
        peer = new Peer();

        // peer.on('open', Id => {
            
        // })
    
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        }).then(stream => {
            addVideoStreamScreen(screenVideo, stream);
            console.log(peer.id)
            socket.emit('screen-share', peer.id);
            screenshare = stream;
            peer.on('call', call => {
                call.answer(stream);
                const video = document.createElement('video');
                
                call.on('close', () => {
                    screenVideo.remove();
                })
            })
            
            stream.oninactive = () => {
                peer.destroy();
                display = 0;
            }

        })

        display = 1;

        setStopScreenShare();

        
    }
    else
    {
        display = 0;
        setScreenShare();
        let allTracks = screenshare.getTracks();
        allTracks.forEach(track => {
            track.stop();
        });
    }
}

const setStopScreenShare = () => {
    const html = `
        <i class = " fas fa-video"></i>
        <span>Stop Screen Share</span>
    `
    document.querySelector('.main__ss__button').innerHTML = html;
}

const setScreenShare = () => {
    const html = `
        <i class = " fas fa-video-slash "></i>
        <span>Screen Share</span>
    `
    document.querySelector('.main__ss__button').innerHTML = html;
}

const timer = () => {
    const timevariable = document.getElementById('timer');
    let time = 0;
    setInterval(() => {
        timevariable.innerText = "Active Time: " + String(time) + "s";
        time++;
    }, 1000)
}

const copier = () => {
    navigator.clipboard.writeText(window.location.href);
        document.getElementById("copyme").innerHTML = "Link Copied!";
        setTimeout( () => {
            document.getElementById("copyme").innerHTML = "Meet Link";
            }, 1500);
}

const getChatop = () => {
    gchat = 1;
}

const participants = () => {
    gchat = 0; 
}