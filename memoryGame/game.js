// Still need to do:
// Do the layout and coloring entirely by yourself. Don't copy Udemy, because that's not cool.
// Make it compatible with mobile! This means sizing, but it also means that the game must be
  // able to be started with any sort of click, not just a keypress.
//Display the high score during the game
//Option to show Instructions
//Add sound effect for white box

// Make this accessible from the smophat.github.io resume homepage,
  // Then go ahead and implement some sort of carousel/gallery-type behavior.

var buttonColors = ["red", "blue", "green", "yellow", "white"];
var numOptions = 0;
var gamePattern = [];
var userClickedPattern = [];
var randomChosenColor = "";
var numLevel = 0;

$("button").click(function() {
  if (numLevel === 0) {
    var userClick = this.id;
    $("#" + userClick).addClass("pressed");
    $("h2").text("Difficulty:");
    setTimeout(function() {
      $("#" + userClick).removeClass("pressed");
    }, 100);
    if (userClick === "easy") {
      //settings for Easy mode
      buttonColors = ["red", "blue", "green"]
      $(".button-container").removeClass("larger-container");
      $(".button-container").addClass("narrow-container");
      $(".yellow").addClass("hidden");
      $(".white").addClass("hidden");
      numOptions = 3;
      $("#normal").addClass("hidden");
      $("#hard").addClass("hidden");
    }
    else if (userClick === "normal") {
      //settings for Normal mode
      buttonColors = ["red", "blue", "green", "yellow"]
      $(".button-container").removeClass("larger-container");
      $(".button-container").addClass("narrow-container");
      $(".yellow").removeClass("hidden");
      $(".white").addClass("hidden");
      numOptions = 4;
      $("#easy").addClass("hidden");
      $("#hard").addClass("hidden");
    }
    else if (userClick === "hard") {
      //settings for Hard mode
      buttonColors = ["red", "blue", "green", "yellow", "white"]
      $(".button-container").removeClass("narrow-container");
      $(".button-container").addClass("larger-container");
      $(".yellow").removeClass("hidden");
      $(".white").removeClass("hidden");
      numOptions = 5;
      $("#easy").addClass("hidden");
      $("#normal").addClass("hidden");
    }
    $(".btn:not(.hidden)").fadeTo("fast", 1.0)
    setTimeout(function() {
      nextSequence();
    }, 1000);
  }
});

$(".btn").click(function() {
  var userClick = this.id;
  if (numLevel != 0) {
    playSound(userClick);
    animatePress(userClick);
    userClickedPattern.push(userClick);
    checkAnswer(userClickedPattern.length - 1);
  }
});

function nextSequence() {
  $("h1").text("Level " + ++numLevel);
  var randomNumber = Math.floor(Math.random() * numOptions);
  randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  playSequence(randomChosenColor);
  userClickedPattern = [];
}

function playSequence(color) {
  playSound(color);
  $("#" + color).fadeOut(100);
  $("#" + color).fadeIn(100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (currentLevel + 1 === numLevel) {
      setTimeout(function(){ nextSequence()}, 350);
    }
  }
  else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {$("body").removeClass("game-over")}, 300);
    $("h1").text("Game Over!");
    setTimeout(function() {
      $(".btn:not(.hidden)").fadeTo("slow", 0.5);
      $("h1").text("Play Again?");
      $("h2").text("Select Difficulty:");
      $("#easy").removeClass("hidden");
      $("#normal").removeClass("hidden");
      $("#hard").removeClass("hidden");
    }, 1500)
    numLevel = 0;
    gamePattern = [];
  }
}

function playSound(color) {
  var squareSound = new Audio("sounds/" + color + ".mp3");
  squareSound.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
