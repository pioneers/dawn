/* Janus initialization. Taken from Janus documentation.
*For information on JS-Janus, refer to : https://janus.conf.meetecho.com/docs/JS.html
*/
import { Janus } from 'janus-gateway';

Janus.init({
    debug: true,
    dependencies: Janus.useDefaultDependencies(), // or: Janus.useOldDependencies() to get the behaviour of previous Janus versions
    callback: function() {
            console.log("Server Connected");
    }
});

//Initializing session
var janus = new Janus(
    {
    server: 'http://yourserver:8088/janus',//need to replace with actual host number
    success: function(){
            console.log("Session created");
    },
    error: function(cause: string){
            console.log("Error initialization: " + cause);
    },
    destroyed: function(){
            console.log("Session Destroyed");
    }
});

//Initializing video-room plugin
janus.attach(
    {
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle){
                // Negotiate WebRTC
                var videoRoom = pluginHandle;
                var body = { "audio": true, "video": true };
                videoRoom.send({"message": body});
                videoRoom.createOffer(
                        {
                                media: {
                                        audioSend: true,
                                        videoSend: true,
                                        audioRecv: false,
                                        videoRecv: false,
                                },
                                success: function(jsep) {
                                        // Got our SDP! Send our OFFER to the plugin
                                        videoRoom.send({"message": body, "jsep": jsep});
                                },
                                error: function(error) {
                                        console.log(error);
                                },
                        });
        },
        onlocalstream: function(stream) {
                // Invoked after createOffer
                // This is our video
        },
/*         onremotestream: function(stream) {
                // Invoked after handleRemoteJsep has got us a PeerConnection
                // This is the remote video
        }, */
});

