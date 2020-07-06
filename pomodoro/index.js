// NOTE TO SELF:
  // Make it so that the stop and reset buttons do something, style them later.
  // Have some larger counts going to display overall session progress (how many pomodoros until the big break, for example) and to be able
    // to shift between the three different timer types


var timerMins = 25;
var timerSecs = timerMins * 60;


// Button Controls
$("#start-button").click(function() {
  setInterval("Decrement()", 1000);
});

$("#stop-button").click(function() {
  // stop the timer
});

$("#reset-button").click(function() {
  // reset the timer
});


// Countdown Functionality
function Decrement() {
  minutes = $(".minutes");
  seconds = $(".seconds");
  minutes.text(getMinutes());
  seconds.text(getSeconds());
  timerSecs--;
  //setInterval(Decrement(), 1000);
}

function getMinutes() {
  timerMins = Math.floor(timerSecs / 60);
  return timerMins;
}

function getSeconds() {
  return timerSecs - Math.round(timerMins * 60);
}
