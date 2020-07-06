// NOTE TO SELF:
  //Reduce the "Timer Type Controls" buttons into one loop (like in the memory game)? Not sure if that would work
  // Make it so that the stop and reset buttons do something, style them later.
  // Have some larger counts going to display overall session progress (how many pomodoros until
    // the big break, for example) and to be able to shift between the three different timer types



// Default timer settings than can be changed by the user

// Variable initialization
var timeTypes = {
  pomodoro: 25,           // Default should be 25 minutes
  shortBreak: 5,
  longBreak: 15
};
var currentTimerSetting = "pomodoro";     // Default Timer Type setting upon pageload
var timerMins = timeTypes[currentTimerSetting];
var timerSecs = timerMins * 60;
var timerRunning = {};    // will be held by setInterval("Decrement()", 1000) on $(#start-button).click()


// Timer Type Controls
$("#pomodoro-button").click(function() {
  updateTimerType("pomodoro");
});

$("#short-break-button").click(function() {
  updateTimerType("shortBreak");
});

$("#long-break-button").click(function() {
  updateTimerType("longBreak");
});


// Timer Playing Controls
$("#start-button").click(function() {
  timerRunning = setInterval("Decrement()", 1000);
});

$("#stop-button").click(function() {
  clearInterval(timerRunning);
});

$("#reset-button").click(function() {
  updateTimeValues();
});


// Changing Timer Types and Resetting Clocks
function updateTimerType(newType) {
  currentTimerSetting = newType;
  updateTimeValues();
  if (newType === "pomodoro") {
    $(".timer-type").text("Pomodoro");
  }
  else if (newType === "shortBreak") {
    $(".timer-type").text("Short Break");
  }
  else if (newType === "longBreak") {
    $(".timer-type").text("Long Break");
  }
}

function updateTimeValues() {
  timerMins = timeTypes[currentTimerSetting];
  timerSecs = timerMins * 60;
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
}

// Countdown Functionality
function Decrement() {
  timerSecs--;
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
  if (timerSecs === 0) {
    clearInterval(timerRunning);
    $(".timer-type").text("Time's Up!")
  }
}

function getMinutes() {
  timerMins = Math.floor(timerSecs / 60);
  return timerMins;
}

function getSeconds() {
  // Function returns info based on the value of timerSecs but does not change it
  // It is changed in Decrement()
  var displaySeconds = timerSecs - Math.round(timerMins * 60);
  if (displaySeconds < 10) {
    return "0" + displaySeconds;
  }
  else {
    return displaySeconds;
  }
}
