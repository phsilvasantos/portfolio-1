// Play audio
//
var isMediaTurnOn = false;
function playAudio(src) {
  // Create Media object from src
  isMediaTurnOn = true;
  my_media = new Media(src, onSuccess, onError);

  // Play audio
  my_media.play();
}

// Pause audio
//
function pauseAudio() {
  if (my_media) {
    my_media.pause();
  }
}

// Stop audio
//
function stopAudio() {
  isMediaTurnOn = false;
  if (my_media) {
    my_media.stop();
  }
}

// onSuccess Callback
//
function onSuccess() {
  isMediaTurnOn = false;
  console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {

}

// Set audio position
//
function setAudioPosition(position) {
  document.getElementById('audio_position').innerHTML = position;
}


