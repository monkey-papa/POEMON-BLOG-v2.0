<template>
  <div
    style="animation: header-effect 2s"
    :style="{
      background: `${
        changeBgState && [''].includes($route.path) ? changeBgState : ''
      }`,
    }"
    class="poem-container myCenter my-animation-hideToShow background-image background-image-changeBg"
    v-if="!$common.isEmpty(guShi.origin) || !$common.isEmpty(hitokoto.hitokoto)"
  >
    <div class="poem-wrap">
      <div v-if="isShehui">
        <span>{{ webInfo.webName }}</span>
      </div>
      <div v-else>
        <span>{{ props.isHitokoto ? hitokoto.from : guShi.origin }}</span>
      </div>
      <p class="poem">
        {{ props.isHitokoto ? hitokoto.hitokoto : guShi.content }}
      </p>
      <p
        class="info"
        v-if="
          !props.isShehui &&
          (!props.isHitokoto ||
            (props.isHitokoto && !$common.isEmpty(hitokoto.from_who)))
        "
      >
        {{ props.isHitokoto ? hitokoto.from_who : guShi.author }}
      </p>
    </div>
    <slot></slot>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const store = useStore();
const { $route, $common, $constant } = useGlobalProperties();

const changeBgState = computed(() => store.changeBg);
const webInfo = computed(() => store.webInfo);

const props = defineProps({
  isHitokoto: {
    type: Boolean,
    default: true,
  },
  isShehui: {
    type: Boolean,
    default: false,
  },
});

const guShi = ref({
  content: "...",
  origin: "...",
  author: "...",
  category: "...",
});

const hitokoto = ref({
  hitokoto: "...",
  from: "...",
  from_who: "...",
});

onMounted(() => {
  if (!props.isShehui) {
    if (props.isHitokoto) {
      getHitokoto();
    } else {
      getGuShi();
    }
  } else {
    hitokoto.value.from = "";
    hitokoto.value.from_who = "";
    sendShehui();
  }
});

const sendShehui = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", $constant.shehui);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const shehui = xhr.responseText;
      hitokoto.value.hitokoto = shehui.substring(1, shehui.length - 1);
    }
  };
  xhr.send();
};

const getGuShi = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", $constant.jinrishici);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      guShi.value = JSON.parse(xhr.responseText);
    }
  };
  xhr.send();
};

const getHitokoto = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", $constant.hitokoto);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      hitokoto.value = JSON.parse(xhr.responseText);
    }
  };
  xhr.send();
};
</script>
<style lang="scss" scoped>
.poem-container {
  padding: 90px 0 40px;
  position: relative;

  .poem-wrap {
    border-radius: 10px;
    z-index: 10;
    text-align: center;
    letter-spacing: 4px;
    font-weight: 300;
    width: 100%;
    max-width: 800px;

    div span {
      padding: 5px 10px;
      color: var(--red);
      font-size: 2em;
      border-radius: 5px;
    }

    p {
      width: 100%;
      max-width: 800px;
      color: var(--darkBlue1);

      &.poem {
        margin: 40px auto;
        font-size: 1.5em;
      }

      &.info {
        margin: 20px auto 40px;
        font-size: 1.1em;
      }
    }
  }

  &.background-image-changeBg {
    height: 100vh !important;
  }
}
</style>
