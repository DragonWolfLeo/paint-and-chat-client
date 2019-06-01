import io from 'socket.io-client';
function joinRoom(room){
    const socket = io(`http://localhost:3001/${room}`);
    function authenticate(login, room) {
        socket.emit("auth", JSON.stringify({
            login, room,
        }));
    }
    
    function postMessage(text) {
        socket.emit("sendMessage", text);
    }
    
    function onAuthenticate(cb) {
        socket.on("auth", authJsonResponseString => {
            var authResponse = JSON.parse(authJsonResponseString);
            if(authResponse.error)
                cb("Failed to authenticate: " + authResponse.error, null);
            else
                cb(null, authResponse);
        });
    }
    
    function onReceiveMessage(cb){
        socket.on("sendMessage", message => cb(null, message));
    }
    
    function sendCanvas(data){
        socket.emit("sendCanvas", data);
    }
    
    function onReceiveCanvas(cb){
        socket.on("sendCanvas", canvas => cb(null, canvas));
    } 
    return {
        authenticate,
        postMessage,
        onReceiveMessage,
        onAuthenticate,
        sendCanvas,
        onReceiveCanvas,
    };
}

export {
    joinRoom,
};