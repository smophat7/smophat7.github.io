//Piano files found at http://theremin.music.uiowa.edu/MISpiano.html
var keyMapping = {
  "q": "C4",
  "2": "Db4",
  "w": "D4",
  "3": "Eb4",
  "e": "E4",
  "r": "F4",
  "5": "Gb4",
  "t": "G4",
  "6": "Ab4",
  "y": "A4",
  "7": "Bb4",
  "u": "B4",
  "i": "C5",
  "9": "Db5",
  "o": "D5",
  "0": "Eb5",
  "p": "E5",
}

for (var i = 0; i < document.querySelectorAll(".key").length; i++) {
  document.querySelectorAll(".key")[i].addEventListener("click", function() {
    makeSound(this.innerHTML);
  });
}

for (var i = 0; i < document.querySelectorAll(".key").length; i++) {
  var currentKey = document.querySelectorAll(".key")[i].innerHTML;
  var audioString = "audioFiles/Piano.mf." + currentKey + ".mp3";
  window[currentKey + "Audio"] = new Audio(audioString);
}

document.addEventListener("keydown", function(event) {
  makeSound(keyMapping[event.key]);
  keyAnimation(keyMapping[event.key]);
});

function makeSound(playedKey) {
  // var pianoAudio = new Audio("audioFiles/Piano.mf." + playedKey + ".mp3");
  // pianoAudio.play();
  eval(playedKey + "Audio.play();");
}

function keyAnimation(input) {
  var selectedKey = document.querySelector("." + input);
  selectedKey.classList.add("pressed");
  setTimeout(function () {
    selectedKey.classList.remove("pressed");
  }, 100);
}
