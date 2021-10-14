const io = require('socket.io-client');
const { ipcRenderer } = require('electron');
const $ = require('jquery');
var socket = io('/');
console.log('socket', socket);
addSocketCallbacks(socket);

ipcRenderer.on('shepherdScoreboardServerIpAddress', (e, ipAddress) => {
  socket.disconnect();
  socket = io.connect(`${ipAddress}`);
  console.log('new socket', socket);
  addSocketCallbacks(socket);
})

function addSocketCallbacks(socket) {
  socket.on('connect', (data) => {
    console.log('connected to scoreboard server');
    socket.emit('join', 'scoreboard');
  });
  
  socket.on('team', (match_info) => {
    console.log(`received team header with info ${match_info}`);
    match_info = JSON.parse(match_info)
    const team_name = match_info.team_name
    const team_num = match_info.team_num
    updateTeam(team_name, team_num)
    setImageVisible('#total', false);
    setImageVisible('.totalinfo', false);
  })
  
  socket.on('stage_timer_start', (secondsInStage) => {
    const time = JSON.parse(secondsInStage).time
    stageTimerStart(time)
  })
  
  // STAGE{stage, start_time}
  socket.on('stage', (stage_details) => {
    const stage = JSON.parse(stage_details).stage
    const start_time = JSON.parse(stage_details).start_time
    console.log("got stage header")
    console.log(stage_details)
    if (stage === "setup") {
      setTime(0);
      setStamp(0);
      setPenalty(0);
    } else if (stage === "end") {
      stageTimer = false;
    } else {
      setStageName(stage);
      setStartTime(start_time);
    }
  })
  
  socket.on("reset_timers", () => {
    resetTimers();
  })
  
  
  // SCORES{time, penalty, stamp_time, score, start_time}
  socket.on("score", (scores) => {
    console.log("receiving score");
    scores = JSON.parse(scores);
    console.log(`scores are ${JSON.stringify(scores)}`);
    const { time, penalty, stamp_time } = scores;
  
    console.log("THIS SHOULD PRINT")
    console.log(time)
    if (time) {
      console.log("Setting time")
      setTime(time);
      setTotal(time + stamp_time + penalty)
    }
    setStamp(stamp_time);
    setPenalty(penalty);
    console.log(time)
    // if (time) {
    //   console.log("Setting total")
    //   setTotal(time - stamp_time + penalty)
    // }
  })
  
  socket.on("sandstorm", (sandstorm) => {
    const on = JSON.parse(sandstorm).on;
    if (on) {
      console.log("Setting sandstorm");
      setSandstorm();
    } else {
      console.log("Removing sandstorm");
      removeSandstorm();
    }
  })
}

var stageTimer = true;
var timerA = true;
var globaltime = 0;
var startTime = 0;

function setSandstorm() {
  $('body').css('background-image', 'url(../../static/video-feed/sandstorm.png)');
}

function removeSandstorm() {
  $('body').css('background-image', 'url()');
}

function setTime(time) {
  stageTimer = false;
  globaltime = time;
  $('#stage-timer').html(secondsToTimeString(time));
}

function setStamp(stamp_time) {
  $('#stamp_time').html("-" + secondsToTimeString(-1 * stamp_time));
}

function setPenalty(penalty) {
  $('#penalty').html("+" + secondsToTimeString(penalty));
}

function setTotal(total) {
  // Hypothetically make it visible here
  console.log("Inside setTotal")
  $('#total').html(secondsToTimeString(total));
  setImageVisible('#total', true);
  setImageVisible('.totalinfo', true);
}

function testScore(score) {
  $('#score').html(score);
}

function resetTimers() {
  stageTimer = false;
  timerA = false;
}

const SETUP = "setup"
const AUTO_WAIT = "auto_wait"
const AUTO = "auto"
const WAIT = "wait"
const TELEOP = "teleop"
const END = "end"

const stage_names = {
  "setup": "Setup",
  "auto_wait": "Autonomous Wait", "auto": "Autonomous Period",
  "teleop": "Teleop Period", "end": "Post-Match"
}

function setStageName(stage) {
  $('#stage').html(stage_names[stage])
}

function updateTeam(team_name, team_num) {
  //set the name and numbers of the school and the match number jk
  $('#team-name').html(team_name)
  $('#team-num').html("Team " + team_num)
}

function stageTimerStart(startTime) {
  stageTimer = true;
  runStageTimer(startTime);
}

function runStageTimer(startTime) {
  console.log("stage timer is ", stageTimer);
  if (stageTimer) {
    const currTime = new Date().getTime() / 1000;
    console.log(currTime);
    console.log(startTime);
    let time = (currTime - startTime);
    $('#stage-timer').html(secondsToTimeString(time));
    setTimeout(runStageTimer, 200, startTime);
  } else {
    // supposedly do nothing
    return
  }
}

function pad(number) {
  return (number < 10 ? '0' : '') + number
}

function secondsToTimeString(seconds) {
  if (seconds < 0) {
    const time = Math.floor(-1 * seconds * 100) / 100;
    return "-" + Math.floor(time / 60) + ":" + pad(Math.floor(time % 60));
  } else {
    const time = Math.floor(seconds * 100) / 100;
    return Math.floor(time / 60) + ":" + pad(Math.floor(time % 60));
  }
}

function setImageVisible(id, visible) {
  console.log("Set visible/invisible")
  $(id).css("visibility", (visible ? 'visible' : 'hidden'));
}

function progress(timeleft, timetotal, $element) {
  var progressBarWidth = timeleft * $element.width() / timetotal;
  if (timeleft == timetotal) {
    $element.find('div').animate({ width: progressBarWidth }, 0, 'linear').html(Math.floor(timeleft / 60) + ":" + pad(timeleft % 60));
  } else {
    $element.find('div').animate({ width: progressBarWidth }, 1000, 'linear').html(Math.floor(timeleft / 60) + ":" + pad(timeleft % 60));
  }
  if (timeleft > 0) {
    setTimeout(function () {
      if (overTimer) {
        progress(timeleft - 1, timetotal, $element);
      } else {
        progress(0, 0, $element)
      }
    }, 1000);
  } else {
    $element.find('div').animate({ width: 0 }, 1000, 'linear').html("")
    $('#overdriveText').css('color', 'white');
    // $('#overdriveText').html("OVERDRIVE!!! " + block + " size!!!");
  }
};

var a = 0
  , pi = Math.PI
  , t = 30

var counter = t;

console.log($("textbox").text() + "x")
console.log(t)

function draw() {
  // a should depend on the amount of time left
  a++;
  a %= 360;
  var r = (a * pi / 180)
    , x = Math.sin(r) * 15000
    , y = Math.cos(r) * - 15000
    , mid = (a > 180) ? 1 : 0
    , anim =
      'M 0 0 v -15000 A 15000 15000 1 '
      + mid + ' 1 '
      + x + ' '
      + y + ' z';
  //[x,y].forEach(function( d ){
  //  d = Math.round( d * 1e3 ) / 1e3;
  //});
  $("#loader").attr('d', anim);
  console.log(counter);

  // time left should be calculated using a timer that runs separately
  if (a % (360 / t) == 0) {
    counter -= 1;
    if (counter <= 9) {
      $("#textbox").css("left = '85px';")
    }
    $("#textbox").html(counter);
  }
  if (a == 0) {
    return;
  }
  setTimeout(draw, 20); // Redraw
};

function runTimer1() {
  timerA = true;
  console.log("timerA set to true")
  console.log(timerA)
  //setTimeout(timer1, 0)
  launchButtonTimer('.timer1', '.circle_animation1', timerA);
}

function timer1() {
  /* how long the timer will run (seconds) */

  var time = 30;
  var initialOffset = '440';
  var i = 1;

  /* Need initial run as interval hasn't yet occured... */
  $('.circle_animation1').css('stroke-dashoffset', initialOffset - (1 * (initialOffset / time)));

  var interval = setInterval(function () {
    $('.timer1').text(time - i);
    if (i == time || !timerA) {
      clearInterval(interval);
      $('.timer1').text(30);
      $('.circle_animation1').css('stroke-dashoffset', '0')
      return;
    }
    $('.circle_animation1').css('stroke-dashoffset', initialOffset - ((i + 1) * (initialOffset / time)));
    i++;
  }, 1000);

}

function setStartTime(start_time) {
  // A function that takes in the starting time of the stage as sent by Shepherd. We calculate
  // the difference between the current time and the sent timestamp, and set the starting time 
  // to be the amount of time given in the round minus the offset.
  //
  // Args:
  // start_time = timestamp sent by Shepherd of when the stage began in seconds
  start_time = start_time / 1000; // seconds

  stageTimerStart(start_time);
}


/* FOR TESTING: */
// var jq = document.createElement('script');
// jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
// document.getElementsByTagName('head')[0].appendChild(jq);
// // ... give time for script to load, then type (or see below for non wait option)
// jQuery.noConflict();
