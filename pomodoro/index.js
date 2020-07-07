// NOTE TO SELF:
  //Reduce the "Timer Type Controls" buttons into one loop (like in the memory game)? Not sure if that would work
  // Make it so that the stop and reset buttons do something, style them later.
  // Have some larger counts going to display overall session progress (how many pomodoros until
    // the big break, for example) and to be able to shift between the three different timer types
  // Use different images for the start and stop buttons and only have some visible when needed (animate in an out of frame)



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
  if (currentTimerSetting != "pomodoro") {
    updateTimerType("pomodoro");
    clearInterval(timerRunning);
  }
});

$("#short-break-button").click(function() {
  if (currentTimerSetting != "shortBreak") {
    updateTimerType("shortBreak");
    clearInterval(timerRunning);
  }
});

$("#long-break-button").click(function() {
  if (currentTimerSetting != "longBreak") {
    updateTimerType("longBreak");
    clearInterval(timerRunning);
  }
});


// Timer Playing Controls
$("#start-button").click(function() {
  timerRunning = setInterval("Decrement()", 1000);
  updateTimerType(currentTimerSetting);
  $("#start-button").hide();
  $("#stop-button").fadeIn();
  $("#reset-button").fadeIn();
});

$("#stop-button").click(function() {
  clearInterval(timerRunning);
  $("#stop-button").hide();
  $("#start-button").fadeIn();
});

$("#reset-button").click(function() {
  clearInterval(timerRunning);
  updateTimeValues();
  updateTimerType(currentTimerSetting);
  $("#stop-button").hide();
  $("#reset-button").hide();
  $("#start-button").fadeIn();
});

// Timer Controls Stylization
$("#start-button").hover(
  function() {
    $("#start-button").attr("src", "images/play-light-grey.svg")
  }, function() {
    $("#start-button").attr("src", "images/play-almost-white.svg");
  }
);

$("#stop-button").hover(
  function() {
    $("#stop-button").attr("src", "images/pause-light-grey.svg")
  }, function() {
    $("#stop-button").attr("src", "images/pause-almost-white.svg");
  }
);

$("#reset-button").hover(
  function() {
    $("#reset-button").attr("src", "images/reset-light-grey.svg")
  }, function() {
    $("#reset-button").attr("src", "images/reset-almost-white.svg");
  }
);


// Changing Timer Types and Resetting Clocks
function updateTimerType(newType) {
  if (currentTimerSetting != newType) {
    currentTimerSetting = newType;
    updateTimeValues();
  }
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
