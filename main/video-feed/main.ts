/*
*Script for WebRTC handling in client side.
*Initialize the socket and handle video/audio incoming. 
*/

//Might need to change to websocket because Janus uses websocket plugin

class vidConnection {
  Socket: WebSocket;
  sessionID : number
  pluginID: number
  janus;

  constructor() {

    //WebSocket will be used as signaling channel. 
    const Socket = new WebSocket('ws://localhost:8080', 'janus-protocol')

    Socket.onopen = () => {
      console.log('Connected to the signaling channel')
    }

    Socket.onerror = err => {
      console.error(err)
    }

    Socket.onmessage = function(event) {
      var msg = JSON.parse(event.data);
      var type = msg.janus;
    
      switch(type) {
        case "error":
          console.log(msg.error.reason)
          break;
        case "success":
          var trans = msg.transaction;
          switch(trans) {
            case "create":
              var sessionID = msg.data.id
              break;
            case "attach":
              var pluginID = msg.data.id
          }
      }
    }
  }

  setUpJanus(){
    this.janus
    this.Socket.send(JSON.stringify({
      "janus" : "create",
      "transaction" : "create"
    }))
  }

  setUpPlugin(){
    this.Socket.send(JSON.stringify({"janus": "attach", "plugin": "janus.plugin.videoroom", "transaction": "attach"}));
  }




  var peerConnection = new RTCPeerConnection();

  var promise = peerConnection.createAnswer();

  // async function start(){
  //     try {
  //         localStream.getTracks().forEach((track: MediaStreamTrack) => {
  //         peerConnection.addTrack(track, localStream)});
  //     } catch (err) {
  //         console.log(err);
  //     };
  // }

  // peerConnection.ontrack = (event) => {
  //     // don't set srcObject again if it is already set.
  //     if (remoteView.srcObject) return;
  //     remoteView.srcObject = event.streams[0];
  // };
}
