// NOTES TO SELF:
  // Animate color transitions (could fade out whole page and make it come back a different color over like 1 second)
  // Add a reset to default setting
  // Saving settings resets the times, which is good except that it ruins your progress in a pomdoro. (currently doesn't stop the clock - good)
  // Retain number of pomodoros completed when you go to the about page and background
  // Send notifications from the browser, or at least an alert
  // Time lage issue (about 3 seconds every 5 minutes)
  // Eventually:
    // Keep timer going in the background or in a pop-up when it runs and you go to the about page (or just open new tab for now - quick fix)
    // Add note taking section where you can write and check off your to-do list


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



////////// Theme Settings and Stylization//////////

// On page load - Set page settings if user has saved those in previous sessions
$(document).ready(function() {
  // Set Light Theme if that was stored in previous sessions
  if (localStorage.getItem("lightTheme")) {
    document.documentElement.setAttribute("theme", "light");
    themeMode = "light";
    // Fill the correct radio option in settings menu (default is Dark Mode)
    $("#lightModeOption").prop("checked", true);
    // Change timer control button colors for light theme
    $("#start-button").attr("src", "images/play-dark-grey.svg");
    $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    $("#reset-button").attr("src", "images/reset-dark-grey.svg");
  }
  // Load timer types and values saved from previous sessions
  if (localStorage.getItem("pomodoro") != null) {
    // Change values in timeTypes object
    timeTypes["pomodoro"] = localStorage.getItem("pomodoro");
    timeTypes["shortBreak"] = localStorage.getItem("shortBreak");
    timeTypes["longBreak"] = localStorage.getItem("longBreak");
    timeTypes["numPomodorosPerLongBreak"] = localStorage.getItem("numPomodoros");
    // Change values displayed in settings menu
    $("#pomodoroLength").attr("value", localStorage.getItem("pomodoro"));
    $("#shortBreakLength").attr("value", localStorage.getItem("shortBreak"));
    $("#longBreakLength").attr("value", localStorage.getItem("longBreak"));
    $("#numPomodoroSetting").attr("value", localStorage.getItem("numPomodoros"));
    // Show correct times on clocks
    updateTimeValues();
  }
});

// User Settings Menu
$(".save-button").click(function() {
  event.preventDefault();           //Prevent page from reloading on "save" click
  // Set timeTypes values based on user setting selection
  var userPomodoroLength = $("#pomodoroLength").val();
  timeTypes["pomodoro"] = userPomodoroLength;
  var userShortBreakLength = $("#shortBreakLength").val();
  timeTypes["shortBreak"] = userShortBreakLength;
  var userLongBreakLength = $("#longBreakLength").val();
  timeTypes["longBreak"] = userLongBreakLength;
  var userNumPomodoroSetting = $("#numPomodoroSetting").val();
  timeTypes["numPomodorosPerLongBreak"] = userNumPomodoroSetting;
  // Display correc times
  updateTimeValues();
  // Save settings to local storage
  localStorage.setItem("pomodoro", userPomodoroLength);
  localStorage.setItem("shortBreak", userShortBreakLength);
  localStorage.setItem("longBreak", userLongBreakLength);
  localStorage.setItem("numPomodoros", userNumPomodoroSetting);
  // Theming options
  if ($("input[name='theme']:checked").val() === "darkModeValue") {
    // Remove theme (automatically dark) attribute from :root
    document.documentElement.removeAttribute("theme");
    localStorage.removeItem("lightTheme");
    themeMode = "dark";
    // Change timer control button colors
    $("#start-button").attr("src", "images/play-almost-white.svg");
    $("#stop-button").attr("src", "images/pause-almost-white.svg");
    $("#reset-button").attr("src", "images/reset-almost-white.svg");
  }
  else if ($("input[name='theme']:checked").val() === "lightModeValue") {
    // Add :root attribute to shift color scheme to light theme
    document.documentElement.setAttribute("theme", "light");
    localStorage.setItem("lightTheme", "true");
    themeMode = "light";
    // Change timer control button colors
    $("#start-button").attr("src", "images/play-dark-grey.svg");
    $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    $("#reset-button").attr("src", "images/reset-dark-grey.svg");
  }
});

// Timer Controls Coloring - Theme Based
$("#start-button").hover(
  // Mouse on
  function() {
    if (themeMode === "dark") {
      $("#start-button").attr("src", "images/play-light-grey.svg")
    }
    else if (themeMode === "light") {
      $("#start-button").attr("src", "images/play-light-teal.svg")
    }
  },
  // Mouse off
  function() {
    if (themeMode === "dark") {
      $("#start-button").attr("src", "images/play-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#start-button").attr("src", "images/play-dark-grey.svg");
    }
  }
);
$("#stop-button").hover(
  // Mouse on
  function() {
    if (themeMode === "dark") {
      $("#stop-button").attr("src", "images/pause-light-grey.svg")
    }
    else if (themeMode === "light") {
      $("#stop-button").attr("src", "images/pause-light-teal.svg")
    }
  },
  // Mouse off
  function() {
    if (themeMode === "dark") {
      $("#stop-button").attr("src", "images/pause-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#stop-button").attr("src", "images/pause-dark-grey.svg");
    }
  }
);
$("#reset-button").hover(
  // Mouse on
  function() {
    if (themeMode === "dark") {
      $("#reset-button").attr("src", "images/reset-light-grey.svg")
    }
    else if (themeMode === "light") {
      $("#reset-button").attr("src", "images/reset-light-teal.svg")
    }
  },
  // Mouse off
  function() {
    if (themeMode === "dark") {
      $("#reset-button").attr("src", "images/reset-almost-white.svg");
    }
    else if (themeMode === "light") {
      $("#reset-button").attr("src", "images/reset-dark-grey.svg");
    }
  }
);



////////// Timer Type Controls (Pomodoro, Short Break, Long Break) //////////

$("#pomodoro-button").click(function() {
  if (currentTimerSetting != "pomodoro") {
    updateTimerType("pomodoro");
    clearInterval(timerRunning);
    // Show correct buttons
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});

$("#short-break-button").click(function() {
  if (currentTimerSetting != "shortBreak") {
    updateTimerType("shortBreak");
    clearInterval(timerRunning);
    // Show correct buttons
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});

$("#long-break-button").click(function() {
  if (currentTimerSetting != "longBreak") {
    updateTimerType("longBreak");
    clearInterval(timerRunning);
    // Show correct buttons
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
});



////////// Timer Button Controls //////////

$("#start-button").click(function() {
  // Button functionality
  timerRunning = setInterval("Decrement()", 1000);
  updateTimerType(currentTimerSetting);
  updateProgressMessage(numPomodorosCompleted);
  // Show correct buttons
  $("#start-button").hide();
  $("#stop-button").fadeIn();
  $("#reset-button").fadeIn();
});

$("#stop-button").click(function() {
  clearInterval(timerRunning);
  // Show correct buttons
  $("#stop-button").hide();
  $("#start-button").fadeIn();
});

$("#reset-button").click(function() {
  clearInterval(timerRunning);
  updateTimeValues();
  updateTimerType(currentTimerSetting);
  // Show correct buttons
  $("#stop-button").hide();
  $("#reset-button").hide();
  $("#start-button").fadeIn();
});



////////// Changing Timer Types and Resetting Clocks //////////

// Change timerType valuable and header text accordingly
function updateTimerType(newType) {
  // Only update things if user clicks on a different timer type
  if (currentTimerSetting != newType) {
    currentTimerSetting = newType;
    updateTimeValues();
  }
  // Change displayed text accordingly
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

// Change time variable values and change text accordingly
function updateTimeValues() {
  timerMins = timeTypes[currentTimerSetting];
  timerSecs = timerMins * 60;
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
}

// Change the progress message at the bottom
function updateProgressMessage() {
  progressMessageText = (timeTypes["numPomodorosPerLongBreak"] - numPomodorosCompleted) + " pomodoros until long break."
  $("#progress-message").text(progressMessageText);
}



////////// Countdown Functionality //////////

// Function is executed every 1 second when the timer is running
function Decrement() {
  timerSecs--;
  // Update minute/second values
  $(".minutes").text(getMinutes());
  $(".seconds").text(getSeconds());
  // Page title updates with time and correct timer types
  switch(currentTimerSetting) {
    case "pomodoro":
      document.title = getMinutes() + ":" + getSeconds() + " - Pomodoro";
      break;
    case "shortBreak":
      document.title = getMinutes() + ":" + getSeconds() + " - Short Break";
      break;
    case "longBreak":
      document.title = getMinutes() + ":" + getSeconds() + " - Long Break";
      break;
  }
  // When the timer reaches zero (0)
  if (timerSecs === 0) {
    clearInterval(timerRunning);
    // Change header text
    $(".timer-type").text("Time's Up!");
    // Timer Sound Effect
    var timerSound = new Audio("audio/one-step-forward-samsung.mp3");
    timerSound.play();
    // 2 second delay until page auto-shifts to next timer type
    setTimeout(function() {
      if (currentTimerSetting === "pomodoro") {
        numPomodorosCompleted += 1;
        updateProgressMessage(numPomodorosCompleted);
        if (numPomodorosCompleted < timeTypes["numPomodorosPerLongBreak"]) {
          updateTimerType("shortBreak");
          // Change page title
          document.title = "Begin Short Break?";
        }
        else {
          updateTimerType("longBreak");
          // Change page title
          document.title = "Begin Long Break?";
          numPomodorosCompleted = 0;
        }
      }
      else {
        updateTimerType("pomodoro");
        // Change page title
        document.title = "Begin Pomodoro?";
      }
    }, 2000);
    // Show correct buttons
    $("#stop-button").hide();
    $("#reset-button").hide();
    $("#start-button").fadeIn();
  }
}

// Changes and returns the new timerMins variable value
function getMinutes() {
  timerMins = Math.floor(timerSecs / 60);
  return timerMins;
}

// Returns info based on the value of timerSecs but does not change it [changed in Decrement()]
function getSeconds() {
  var displaySeconds = timerSecs - Math.round(timerMins * 60);
  if (displaySeconds < 10) {
    return "0" + displaySeconds;
  }
  else {
    return displaySeconds;
  }
}
