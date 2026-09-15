const audio = new Audio();
const playButton = document.querySelector("#play");

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.src = "pause.svg";
  } else {
    audio.pause();
    playButton.src = "play.png";
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
function playMusic(track, songName) {
  audio.src = track;
  audio.load();
  audio.play();
  if (playButton) {
    playButton.src = "pause.svg";
  }


  document.querySelector(".songName").innerHTML = songName;

}
async function getSongs() {
  const response = await fetch("http://127.0.0.1:5501/songs");
  
  console.log(response)
  const songData = await response.json();
  console.log(songData)
  const songs = songData.songs;
  for (const item of songs) {
    const playlist = document.querySelector(".listOfSongs");
    playlist.innerHTML += `
      <li class="songsList">
        <div class="musicContainer">
          <img src="music.png" alt="music" class="music">
          </div>
        <div class="tittle">${item.title}</div>
        <div class="palybutton">
        <img src="play.png" alt="paly" class="musicPlayerBtn">
        </div>
        </li>
        `;
  }

  document.querySelector(".listOfSongs").addEventListener("click", (event) => {
    const item = event.target.closest(".songsList");
    let songIndex = [...document.querySelectorAll(".songsList")].indexOf(item);
    const song = songs[songIndex].src;
    const songName = songs[songIndex].title;
    document.querySelector(".volumeContainer").innerHTML = `
    <img src="volume.svg" alt=""class="volume">
    <img src="stopVolume.svg" alt=""class="stopVolume">
    <input type="range" name="range" id="range">
    <span class = "volumeValue"></span>
    `

    range.addEventListener("change", (e) => {

      audio.volume = parseInt(e.target.value) / 100;
      document.querySelector(".volumeValue").innerHTML = Math.floor(audio.volume * 100)
    }
    )
    let previousVolume = audio.volume;

    document.querySelector(".volume").addEventListener("click", () => {
      // Save current volume before muting
      previousVolume = audio.volume;

      document.querySelector(".volume").style.display = "none";
      document.querySelector(".stopVolume").style.display = "block";

      // Mute audio
      audio.volume = 0;
    });

    document.querySelector(".stopVolume").addEventListener("click", () => {
      document.querySelector(".stopVolume").style.display = "none";
      document.querySelector(".volume").style.display = "block";

      // Turn volume back on
      audio.volume = previousVolume;
    });
    previousBtn.addEventListener("click", () => {
      if (songIndex > 0) {
        playMusic(songs[songIndex - 1].src, songs[songIndex - 1].title)
        songIndex = songIndex - 1

      }
    }
    )
    nextBtn.addEventListener("click", () => {
      if (songIndex < songs.length - 1) {
        playMusic(songs[songIndex + 1].src, songs[songIndex + 1].title)
        songIndex = songIndex + 1

      }
    }
    )
    playMusic(song, songName);
  });


  audio.addEventListener("timeupdate", () => {
    document.querySelector(".timeOfSong").innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`;
    document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
  })

  // seekbar styling
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percentage + "%";
    audio.currentTime = (audio.duration * percentage) / 100


  }
  )
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
  document.querySelector(".hamburger1").addEventListener("click", () => {
    document.querySelector(".navList").style.display = "block";
  }
  )
  document.querySelector(".cross1").addEventListener("click", () => {
    document.querySelector(".navList").style.display = "none";


  }
  )

}

getSongs();






// const audio = new Audio();
// const playButton = document.querySelector("#play");
// let songs = [];

// function secondsToMinutesSeconds(seconds) {
//   if (isNaN(seconds) || seconds < 0) {
//     return "Invalid input";
//   }

//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);

//   const formattedMinutes = String(minutes).padStart(2, "0");
//   const formattedSeconds = String(remainingSeconds).padStart(2, "0");

//   return `${formattedMinutes}:${formattedSeconds}`;
// }

// function playMusic(track, songName) {
//   if (!track) {
//     return;
//   }

//   audio.src = track;
//   audio.load();

//   audio.play().catch((err) => {
//     console.log("Playback blocked:", err.name, err.message);
//   });

//   if (playButton) {
//     playButton.src = "pause.svg";
//   }

//   const songNameElement = document.querySelector(".songName");
//   if (songNameElement) {
//     songNameElement.innerHTML = songName || "";
//   }
// }

// async function getSongs() {
//   const response = await fetch("http://127.0.0.1:5501/songs/songs.json");
//   const songData = await response.json();
//   songs = songData.songs;

//   for (const item of songs) {
//     const playlist = document.querySelector(".listOfSongs");
//     playlist.innerHTML += `
//       <li class="songsList">
//         <div class="musicContainer">
//           <img src="music.png" alt="music" class="music">
//         </div>
//         <div class="tittle">${item.title}</div>
//         <div class="palybutton">
//           <img src="play.png" alt="paly" class="musicPlayerBtn">
//         </div>
//       </li>
//     `;
//   }

//   document.querySelector(".listOfSongs").addEventListener("click", (event) => {
//     const item = event.target.closest(".songsList");

//     if (!item) {
//       return;
//     }

//     const songIndex = [...document.querySelectorAll(".songsList")].indexOf(item);
//     const selectedSong = songs[songIndex];

//     if (!selectedSong) {
//       return;
//     }

//     playMusic(selectedSong.src, selectedSong.title);
//   });

//   if (playButton) {
//     playButton.addEventListener("click", () => {
//       const firstSong = songs[0];

//       if (!audio.src && firstSong) {
//         playMusic(firstSong.src, firstSong.title);
//         return;
//       }

//       if (audio.paused) {
//         audio.play().catch((err) => {
//           console.log("Playback blocked:", err.name, err.message);
//         });
//         playButton.src = "pause.svg";
//       } else {
//         audio.pause();
//         playButton.src = "play.png";
//       }
//     });
//   }

//   audio.addEventListener("timeupdate", () => {
//     const timeElement = document.querySelector(".timeOfSong");

//     if (timeElement) {
//       timeElement.innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`;
//     }
//   });
// }

// getSongs();