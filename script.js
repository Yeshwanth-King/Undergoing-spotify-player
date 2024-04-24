let playBut = document.querySelector(".playbut");
let currentSong = new Audio();
let songs;
let currFolder = "RepeatSongs";
function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const playAudio = (track, pause = false) => {
  currentSong.src = `/Songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    playBut.src = "Svgs/pause.svg";
  }
  document.querySelector(".song-info").innerHTML = track.split(".mp3")[0];
  document.querySelector(".act-time").innerHTML = "00:00/00:00";
};
let getSong = async (folder) => {
  currFolder = folder;
  document.querySelector(".songul").innerHTML = "";
  let a = await fetch(`/Songs/${currFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let ac = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < ac.length; index++) {
    const element = ac[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  let songli = document.querySelector(".songul");
  for (let key in songs) {
    songli.innerHTML += `
    <li>
    <img class="invert" src="Svgs/music.svg" alt="" />
    <div class = "info">
    <div>
      ${
        songs[key]
          .split(`/Songs/${currFolder}/`)[1]
          .replaceAll("%20", " ")
          .split(".mp3")[0]
      }
      </div>
      </div>
      <img
        class="invert"
        src="Svgs/play.svg"
        style="cursor: pointer"
        alt=""
        />
        </li>
        `;
  }

  let songList = Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  );

  songList.forEach((element) => {
    element.addEventListener("click", () => {
      let adu = element
        .querySelector(".info")
        .firstElementChild.innerHTML.trim();
      adu += ".mp3";
      playAudio(adu);
    });
  });

  return songs;
};

async function main() {
  songs = await getSong(`${currFolder}`);
  playAudio(
    songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " "),
    true
  );

  playBut.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBut.src = "Svgs/pause.svg";
    } else {
      currentSong.pause();
      playBut.src = "Svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".act-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    let circle = document.querySelector(".circle");
    circle.style.left =
      (currentSong.currentTime / currentSong.duration) * 99 + "%";
  });

  let seek = document.querySelector(".song-time");
  seek.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  let humbuger = document.querySelector(".hamburger");
  humbuger.addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.transition = "all 0.7s";
  });

  previous.addEventListener("click", () => {
    let inde = songs.indexOf(currentSong.src);
    if (inde > 0) {
      playAudio(
        songs[inde - 1].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    } else if (inde == 0) {
      playAudio(
        songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let inde = songs.indexOf(currentSong.src);
    if (inde < songs.length - 1) {
      playAudio(
        songs[inde + 1].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    } else if (inde == songs.length - 1) {
      playAudio(
        songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    }
  });

  document.querySelector(".range").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (event) => {
      songs = await getSong(event.currentTarget.dataset.folder);
    });
  });
}
main();
