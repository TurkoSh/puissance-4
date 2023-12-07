var audio = document.getElementById("myAudio");
var btn = document.getElementById("play-btn");

btn.addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    audio.pause();
    btn.innerHTML = '<i class="fa-regular fa-music"></i>';
  }
});