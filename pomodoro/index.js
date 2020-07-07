// NOTE TO SELF:
  // Reduce the "Timer Type Controls" buttons into one loop (like in the memory game)? Not sure if that would work
  // Test if the numPomodorosCompleted variable is updating and displaying properly
  // Add settings page/drop-down




// Default timer settings than can be changed by the user
var timeTypes = {
  pomodoro: 25,           // Default should be 25 minutes
  shortBreak: 5,
  longBreak: 15
};

// Variable initialization
var currentTimerSetting = "pomodoro";     // Default Timer Type setting upon pageload
var timerMins = timeTypes[currentTimerSetting];
var timerSecs = timerMins * 60;
var timerRunning = {};    // will be held by setInterval("Decrement()", 1000) on $(#start-button).click()
var numPomodorosCompleted = 0;

// Timer Type Controls
$("#pomodoro-button").click(function() {
  if (currentTimerSetting != "pomodoro") {
    updateTimerType("pomodoro");
    clearInterval(timerRunning);
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});

$("#short-break-button").click(function() {
  if (currentTimerSetting != "shortBreak") {
    updateTimerType("shortBreak");
    clearInterval(timerRunning);
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});

$("#long-break-button").click(function() {
  if (currentTimerSetting != "longBreak") {
    updateTimerType("longBreak");
    clearInterval(timerRunning);
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});


// Timer Playing Controls
$("#start-button").click(function() {
  timerRunning = setInterval("Decrement()", 1000);
  updateTimerType(currentTimerSetting);
  updateProgressMessage(numPomodorosCompleted);
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

function updateProgressMessage() {
  progressMessageText = (4 - numPomodorosCompleted) + " pomodoros until long break."
  $("#progress-message").text(progressMessageText);
}


// Countdown Functionality
function Decrement() {
  timerSecs--;
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
  if (timerSecs === 0) {
    clearInterval(timerRunning);
    $(".timer-type").text("Time's Up!")
    setTimeout(function() {
      if (currentTimerSetting === "pomodoro") {
        numPomodorosCompleted += 1;
        if (numPomodorosCompleted < 4) {
          updateTimerType("shortBreak");
        }
        else {
          updateTimerType("longBreak");
          numPomodorosCompleted = 0;
        }
      }
      else {
        updateTimerType("pomodoro");
      }
    }, 2000);
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
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
