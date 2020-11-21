/*
*Script for WebRTC handling in client side.
*Initialize the socket and handle video/audio incoming. 
*/

//Might need to change to websocket because Janus uses websocket plugin

const ws = new WebSocket('ws://localhost:8080', 'janus-protocol')

ws.onopen = () => {
  console.log('Connected to the signaling server')
}

ws.onerror = err => {
  console.error(err)
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
