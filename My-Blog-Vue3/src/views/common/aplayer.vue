<template>
  <div class="aplayer" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <!-- 音乐播放器 -->
    <div id="aplayer" :class="{ 'un-show': $route?.meta?.requiresAuth }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const { $route } = useGlobalProperties();

const ap = ref(null);
const playIcon = ref("fa-solid fa-play");
// const aplayerWidth = ref(null);
const lyricsTimer = ref(null);
const keydownHandler = ref(null);

onMounted(() => {
  const server = "netease"; // netease: 网易云音乐; tencent: QQ音乐; kugou: 酷狗音乐; xiami: 虾米; kuwo: 酷我
  const type = "playlist"; // song: 单曲; playlist: 歌单; album: 唱片
  const id = "13875729534"; // 封面 ID / 单曲 ID / 歌单 ID
  const apiUrl = `https://api.i-meto.com/meting/api?server=${server}&type=${type}&id=${id}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      ap.value = new APlayer({
        container: document.getElementById("aplayer"),
        order: "random",
        preload: "none",
        listMaxHeight: "260px",
        fixed: "true",
        volume: 0.1,
        mutex: true,
        lrcType: 3,
        audio: data,
      });
      /* 底栏歌词 */
      lyricsTimer.value = setInterval(() => {
        $("#music-name").html($(".aplayer-lrc-current").text());
      }, 500);
      /* 音乐通知及控制 */
      ap.value.on("play", () => {
        const currentMusic = ap.value.list.current;
        playIcon.value = "fa-solid fa-pause";
      });
      ap.value.on("pause", () => {
        playIcon.value = "fa-solid fa-play";
      });
      keydownHandler.value = (e) => {
        if (e.keyCode === 32) {
          ap.value.toggle();
        }
      };
      window.addEventListener("keydown", keydownHandler.value);
      ap.value.list.show();
    })
    .catch((error) => {
      console.log(error);
    });
});

onBeforeUnmount(() => {
  if (lyricsTimer.value) {
    clearInterval(lyricsTimer.value);
    lyricsTimer.value = null;
  }
  if (keydownHandler.value) {
    window.removeEventListener("keydown", keydownHandler.value);
    keydownHandler.value = null;
  }
  if (ap.value) {
    ap.value.destroy();
    ap.value = null;
  }
});

const playLast = () => {
  ap.value.skipBack();
  ap.value.on("play", () => {
    const music = `${currentMusic.title} - ${currentMusic.author}`;
    iziToast.info({
      timeout: 4000,
      icon: "fa-solid fa-circle-play",
      displayMode: "replace",
      message: music,
    });
    $("#music-name").text(`${currentMusic.title} - ${currentMusic.author}`);
    playIcon.value = "fa-solid fa-pause";
  });
  ap.value.on("pause", () => {
    playIcon.value = "fa-solid fa-play";
  });
};

const handlePlay = () => {
  const aplayerEl = document.getElementById("aplayer");
  const music =
    aplayerEl.querySelector(".aplayer-title").textContent +
    aplayerEl.querySelector(".aplayer-author").textContent;
  iziToast.info({
    timeout: 4000,
    icon: "fa-solid fa-circle-play",
    displayMode: "replace",
    message: music,
  });
  playIcon.value = "fa-solid fa-pause";
  if (window.innerWidth >= 990) {
    // showPower = false;
    // showLrc = true;
  }
};

const togglePlay = () => {
  ap.value.toggle();
};

const playNext = () => {
  ap.value.skipForward();
};

const mouseenter = () => {
  // $(".aplayer-body").css({
  //   transition: "all 0.3s linear",
  //   transform: "translateX(68px)",
  // });
};

const mouseleave = () => {
  ap.value.list.hide();
  // aplayerWidth.value = $(".aplayer-body").width();
  // if (aplayerWidth.value < 400) {
  //   $(".aplayer-body").css({
  //     transition: "all 0.3s linear",
  //     transform: "translateX(0px)",
  //   });
  // }
};
</script>

<style lang="scss" scoped>
.aplayer {
  margin: 0;
}
:deep(#aplayer) {
  margin: 0;

  &.un-show {
    display: none;
  }

  &.aplayer-fixed {
    bottom: 330px;

    .aplayer-body {
      bottom: 330px;
      /* left: -68px; */
    }

    .aplayer-lrc {
      text-shadow: none;

      p {
        font-size: 16px;
        color: var(--bigRed);
      }
    }
  }

  .aplayer-miniswitcher {
    .aplayer-icon {
      path {
        fill: var(--darkBlue);
      }
    }
  }
}
</style>
