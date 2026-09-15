let audio = new Audio();
let currFolder;
const playButton = document.querySelector("#play");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");
let songs;
let currentSongIndex = 0;

// Toggle playback and keep the main play button icon in sync with the audio state.
playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.src = "images/pause.svg";
  } else {
    audio.pause();
    playButton.src = "images/play.png";
  }
});
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Load MP3 files from the selected folder and rebuild the playlist.
async function getSongs(folder) {
  currFolder = folder;
  let response = await fetch(`http://127.0.0.1:5501/${currFolder}/`);
  let songData = await response.text();
  let div = document.createElement("div");
  div.innerHTML = songData;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href.split(`/${currFolder}/`)[1])

  }
  let playlist = document.querySelector(".listOfSongs");
  playlist.innerHTML = ""
  for (const item of songs) {
    playlist.innerHTML += `
      <li class="songsList">
        <div class="musicContainer">
          <img src="images/music.png" alt="music" class="music">
          </div>
        <div class="tittle">${item.replaceAll("%20", " ")}</div>
        <div class="palybutton">
        <img src="images/play.png" alt="paly" class="musicPlayerBtn">
        </div>
        </li>
        `;
  }
  Array.from(document.querySelector(".listOfSongs").getElementsByTagName("li")).forEach(element => {
    element.addEventListener("click", () => {
      currentSongIndex = Array.from(document.querySelector(".listOfSongs").children).indexOf(element);
      playMusic(songs[currentSongIndex]);

    }
    )

  });
}

// Set the selected track and optionally load it without starting playback.
function playMusic(track, pause = false) {
  audio.src = `${currFolder}/` + track
  playButton.src = "images/play.png";
  if (!pause) {
    audio.play();
    playButton.src = "images/pause.svg";


  }

  document.querySelector(".songName").innerHTML = decodeURI(track.split("(")[0]);

}
async function displayAlbum() {
  let response = await fetch(`http://127.0.0.1:5501/songs/`);
  let songData = await response.text();
  let div = document.createElement("div");
  div.innerHTML = songData;

  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
 
    if (element.href.includes("/songs/")) {
      let folder = element.href.split("/").slice(-2)[1];
      let cards = document.querySelector(".cards")
      let response = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
      let songData = await response.json();
      cards.innerHTML = cards.innerHTML + `
         <div data-folder="${songData.tittle}" class="card">
                    <div>
                        <img src=${songData.imageSrc} alt="">
                        <div class="play">
                            <img src="images/play.png" alt="play" class="playbtn">
                        </div>

                    </div>
                    <h2>${songData.tittle}</h2>
                    <span>${songData.description}</span>
                </div>
      `
    }
  };
  // Load a category playlist when its card is selected.
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (iteam) => {
      await getSongs(`songs/${iteam.currentTarget.dataset.folder}`);
      currentSongIndex = 0;
      playMusic(songs[0], true);
    })
  }
  )
}

async function main() {
  // Start with the CS playlist and preload its first track.
  await getSongs("songs/cs");
  playMusic(songs[0], true)
  //  Display album on page
  displayAlbum();

  // Update the elapsed time and progress indicator while the track plays.
  audio.addEventListener("timeupdate", () => {
    document.querySelector(".timeOfSong").innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`;
    document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
  })
  // Create the volume controls with a percentage range from 0 to 100.
  document.querySelector(".volumeContainer").innerHTML = `
    <img src="images/volume.svg" alt=""class="volume">
    <img src="images/stopVolume.svg" alt=""class="stopVolume">
    <input type="range" name="range" id="range" min="0" max="100" step="1" value="100">
    <span class="volumeValue">100</span>
    `
  const range = document.querySelector("#range");
  let previousVolume = audio.volume;
  // Update volume and icon state immediately while the range is dragged.
  range.addEventListener("input", (e) => {
    const volumeValue = parseInt(e.target.value);

    if (volumeValue === 0) {
      if (audio.volume > 0) {
        previousVolume = audio.volume;
      }
      audio.volume = 0;
      document.querySelector(".volume").style.display = "none";
      document.querySelector(".stopVolume").style.display = "block";
    } else {
      audio.volume = volumeValue / 100;
      previousVolume = audio.volume;
      document.querySelector(".volume").style.display = "block";
      document.querySelector(".stopVolume").style.display = "none";
    }
    document.querySelector(".volumeValue").innerHTML = volumeValue;
  }
  )

  // Mute while remembering the last non-zero volume for restoration.
  document.querySelector(".volume").addEventListener("click", () => {
    previousVolume = audio.volume;

    document.querySelector(".volume").style.display = "none";
    document.querySelector(".stopVolume").style.display = "block";

    audio.volume = 0;
    range.value = 0;
    document.querySelector(".volumeValue").innerHTML = 0;

  });

  // Restore the saved volume and move the range back to that position.
  document.querySelector(".stopVolume").addEventListener("click", () => {
    document.querySelector(".stopVolume").style.display = "none";
    document.querySelector(".volume").style.display = "block";

    audio.volume = previousVolume;
    range.value = Math.floor(previousVolume * 100);
    document.querySelector(".volumeValue").innerHTML = range.value;
  });
  // Seek to the clicked position in the track.
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percentage + "%";
    audio.currentTime = (audio.duration * percentage) / 100
  }
  )

  // Open and close the responsive sidebar.
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
    document.querySelector(".left").style.width = "75vw"
    document.querySelector(".right").style.opacity = "0.5"
  }
  )
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-85%";
    document.querySelector(".right").style.opacity = "1"

  }
  )
  // Open and close the responsive navigation menu.
  document.querySelector(".hamburger1").addEventListener("click", () => {
    document.querySelector(".navList").style.display = "block";
  }
  )
  document.querySelector(".cross1").addEventListener("click", () => {
    document.querySelector(".navList").style.display = "none";

  }
  )

  // Move through tracks in the current playlist.
  previousBtn.addEventListener("click", () => {
    if (currentSongIndex > 0) {
      currentSongIndex -= 1;
      playMusic(songs[currentSongIndex]);
    }
  }
  )
  nextBtn.addEventListener("click", () => {
    if (currentSongIndex < songs.length - 1) {
      currentSongIndex += 1;
      playMusic(songs[currentSongIndex]);
    }
  }
  )
}
main()