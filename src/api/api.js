import io from 'socket.io-client';
// import request from 'superagent';
import {eventListenerSetup} from '../util/util';

const serverUrl = "http://localhost:3001"
class Connection {
    constructor(room, token) {
        this.socket = io.connect(`${serverUrl}/${room}`);
        this.token = token;
    }
    // Adding event listeners
    onConnect = cb => {
        this.socket.on("connect", cb);
        // Authenticate
        this.socket.emit("auth", this.token);
    };
    onDisconnect = cb => {
        this.socket.on("disconnect", cb);
    };
    onAuthenticate = cb => {
        this.socket.on("auth", authResponse => {
            if (authResponse.error)
                cb("Failed to authenticate: " + authResponse.error, null);
            else
                cb(null, authResponse);
        });
    };

    // Sets of functions to add and remove event listeners
    onReceiveMessageSetup = cb => eventListenerSetup(this.socket, ["message", cb]);
    onCanvasSetup = cb => eventListenerSetup(this.socket, ["canvas", cb]);
    
    // Event emitters
    postMessage = text => {
        this.socket.emit("message", text);
    };
    sendCanvas = data => this.socket.emit("canvas", data);
}

const requestJoinRoom = (name, color, room) => {
    fetch(`${serverUrl}/join/${room}`,{
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name, color
        }),
      })
    .then(res=>res.json())
    .then(console.log)
    .catch(console.error);
}
const requestCreateRoom = (name, color) => {
    return fetch(`${serverUrl}/create`,{
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name, color
        }),
      })
    .then(res=>res.json())
    .catch(console.error);
}
export {
    Connection,
    requestJoinRoom,
    requestCreateRoom,
};