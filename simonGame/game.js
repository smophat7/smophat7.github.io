var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var randomChosenColor = "";
var numLevel = 0;

$("body").keypress(function() {
  if (numLevel === 0) {
    nextSequence();
  }
});

$(".btn").click(function() {
  var userClick = this.id;
  playSound(userClick);
  animatePress(userClick);
  userClickedPattern.push(userClick);
  checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
  $("h1").text("Level " + ++numLevel);
  var randomNumber = Math.floor(Math.random() * 4);
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
      setTimeout(function(){ nextSequence()}, 750);
    }
  }
  else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {$("body").removeClass("game-over")}, 300);
    $("h1").text("Game Over! Press Any Key to Restart");
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
