// NOTES TO SELF:
  // Reduce the initialization of "Timer Type Controls" buttons into one loop (like in the memory game)?
    // Not sure if that would work
  // Animate color transitions (could fade out whole page and make it come back a different color over like 1 second)
  // Alarm sound (change sounds in settings)
  // Add a reset to default setting
  // See the timer updating in the tab image or text as well
  // Saving settings resets the times, which is good except that it ruins your progress in a pomdoro. (currently doesn't stop the clock - good)
  // Retain number of pomodoros completed when you go to the about page and background
  // Send notifications from the browser, or at least an alert
  // Time lage issue (about 3 seconds every 5 minutes)
  // Eventually:
    // Keep timer going in the background or in a pop-up when it runs and you go to the about page (or just open new tab for now - quick fix)
    // Add note taking section where you can write and check off your to-do list

  //To-Do: refactor and organize all of this, there are definitely some new functions to be made



// Default timer settings than can be changed by the user
var timeTypes = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  numPomodorosPerLongBreak: 4
};

// Variable initialization
var currentTimerSetting = "pomodoro";     // Default Timer Type setting upon pageload
var timerMins = timeTypes[currentTimerSetting];
var timerSecs = timerMins * 60;
var timerRunning = {};    // will be held by setInterval("Decrement()", 1000) on $(#start-button).click()
var numPomodorosCompleted = 0;
var themeMode = "dark";

// ON PAGE LOAD
$(document).ready(function() {
  // Set Light Theme if that was stored in previous sessions
  if (localStorage.getItem("lightTheme")) {
    document.documentElement.setAttribute("theme", "light");
    themeMode = "light";
    // Check the correct radio option in settings
    $("#lightModeOption").prop("checked", true);
    // Change timer control button colors
    $("#start-button").attr("src", "images/play-dark-grey.svg");
    $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    $("#reset-button").attr("src", "images/reset-dark-grey.svg");

  }
  // Load timer types and values saved from previous sessions
  if (localStorage.getItem("pomodoro") != null) {
    timeTypes["pomodoro"] = localStorage.getItem("pomodoro");
    timeTypes["shortBreak"] = localStorage.getItem("shortBreak");
    timeTypes["longBreak"] = localStorage.getItem("longBreak");
    timeTypes["numPomodorosPerLongBreak"] = localStorage.getItem("numPomodoros");
    $("#pomodoroLength").attr("value", localStorage.getItem("pomodoro"));
    $("#shortBreakLength").attr("value", localStorage.getItem("shortBreak"));
    $("#longBreakLength").attr("value", localStorage.getItem("longBreak"));
    $("#numPomodoroSetting").attr("value", localStorage.getItem("numPomodoros"));
    updateTimeValues();
  }
});

// User Settings
$(".save-button").click(function() {
  event.preventDefault();           //Prevent page from reloading on "save"
  var userPomodoroLength = $("#pomodoroLength").val();
  timeTypes["pomodoro"] = userPomodoroLength;
  var userShortBreakLength = $("#shortBreakLength").val();
  timeTypes["shortBreak"] = userShortBreakLength;
  var userLongBreakLength = $("#longBreakLength").val();
  timeTypes["longBreak"] = userLongBreakLength;
  var userNumPomodoroSetting = $("#numPomodoroSetting").val();
  timeTypes["numPomodorosPerLongBreak"] = userNumPomodoroSetting;
  updateTimeValues();
  // Save settings to local storage
  localStorage.setItem("pomodoro", userPomodoroLength);
  localStorage.setItem("shortBreak", userShortBreakLength);
  localStorage.setItem("longBreak", userLongBreakLength);
  localStorage.setItem("numPomodoros", userNumPomodoroSetting);
  // Theming options
  if ($("input[name='theme']:checked").val() === "darkModeValue") {
    document.documentElement.removeAttribute("theme");
    localStorage.removeItem("lightTheme");
    themeMode = "dark";
    // Change timer control button colors
    $("#start-button").attr("src", "images/play-almost-white.svg");
    $("#stop-button").attr("src", "images/pause-almost-white.svg");
    $("#reset-button").attr("src", "images/reset-almost-white.svg");
  }
  else if ($("input[name='theme']:checked").val() === "lightModeValue") {
    document.documentElement.setAttribute("theme", "light");
    localStorage.setItem("lightTheme", "true");
    themeMode = "light";
    // Change timer control button colors
    $("#start-button").attr("src", "images/play-dark-grey.svg");
    $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    $("#reset-button").attr("src", "images/reset-dark-grey.svg");
  }
});


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
  // Ask for user's notification preferences if necessary
  // if (!window.Notification) {
  //       console.log("Browser does not support notifications.");
  //   }
  // else {
  //   if (Notification.permission === "default") {
  //     Notification.requestPermission().then(function(p) {
  //       if (p === "denied") {
  //         console.log("User blocked notifications.");
  //       }
  //     });
  //   }
  // }
  // Button functionality
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
    if (themeMode === "dark") {
      $("#start-button").attr("src", "images/play-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#start-button").attr("src", "images/play-dark-grey.svg");
    }
  }
);

$("#stop-button").hover(
  function() {
    $("#stop-button").attr("src", "images/pause-light-grey.svg")
  }, function() {
    if (themeMode === "dark") {
      $("#stop-button").attr("src", "images/pause-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    }
  }
);

$("#reset-button").hover(
  function() {
    $("#reset-button").attr("src", "images/reset-light-grey.svg")
  }, function() {
    if (themeMode === "dark") {
      $("#reset-button").attr("src", "images/reset-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#reset-button").attr("src", "images/reset-dark-grey.svg");
    }
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
  progressMessageText = (timeTypes["numPomodorosPerLongBreak"] - numPomodorosCompleted) + " pomodoros until long break."
  $("#progress-message").text(progressMessageText);
}


// Countdown Functionality
function Decrement() {
  timerSecs--;
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
  if (timerSecs === 0) {
    clearInterval(timerRunning);
    // console.log(Notification.permission)                      //delete me
    // if (Notification.permission === "granted") {
    //   console.log("Attempting to show notification.");
    //   var notify = new Notification('Hi there!', {
    //     body: 'How are you doing?',
    //     icon: 'https://bit.ly/2DYqRrh',
    //   });
    //
    //   // var notify = new Notification("Time's Up!", {
    //   //   body: "Keep up the great work!",
    //   //   icon: "images/time.png",
    //   // });
    // }
    $(".timer-type").text("Time's Up!")
    setTimeout(function() {
      if (currentTimerSetting === "pomodoro") {
        numPomodorosCompleted += 1;
        updateProgressMessage(numPomodorosCompleted);
        if (numPomodorosCompleted < timeTypes["numPomodorosPerLongBreak"]) {
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
