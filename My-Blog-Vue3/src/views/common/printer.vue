<template>
  <div>
    <slot name="paper" :content="content"></slot>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  // 内容
  printerInfo: {
    type: String,
    default: "",
  },
  // 速度
  duration: {
    type: Number,
    default: 100,
  },
  // 延迟
  delay: {
    type: Number,
    default: 3000,
  },
  working: {
    type: Boolean,
    default: true,
  },
  once: {
    type: Boolean,
    default: false,
  },
});

const content = ref("");
const cursor = ref(0);
const timer = ref(null);
const timeout = ref(null);
const print = ref(true);

/**
 * 逻辑
 */
const work = () => {
  let currentCursor = cursor.value;
  currentCursor += print.value ? 1 : -1;
  if (print.value) {
    if (currentCursor === props.printerInfo.length + 1) {
      currentCursor -= 2;
      print.value = !print.value;
    }
  } else {
    if (currentCursor === -1) {
      currentCursor += 2;
      print.value = !print.value;
    }
  }
  cursor.value = currentCursor;
};

/**
 * 定时
 */
const start = (workFn) => {
  // 延迟
  timeout.value = setTimeout(() => {
    // 速度
    timer.value = setInterval(() => {
      workFn();
      if (
        cursor.value === 0 ||
        (cursor.value === props.printerInfo.length && !props.once)
      ) {
        // 此处为了延迟
        clearInterval(timer.value);
        start(work);
      } else if (cursor.value === props.printerInfo.length && props.once) {
        clearInterval(timer.value);
      }
    }, props.duration);
  }, props.delay);
};

const toBegin = () => {
  cursor.value = 0;
  if (timeout.value !== null) {
    clearTimeout(timeout.value);
    if (timer.value !== null) {
      clearInterval(timer.value);
    }
  }
  if (props.working) {
    start(work);
  } else {
    content.value = props.printerInfo;
  }
};

watch(
  () => props.working,
  (newVal) => {
    if (newVal) {
      toBegin();
    } else {
      if (timeout.value !== null) {
        clearTimeout(timeout.value);
        if (timer.value !== null) {
          clearInterval(timer.value);
        }
      }
      content.value = props.printerInfo;
    }
  },
  { immediate: true }
);

watch(
  () => props.printerInfo,
  () => {
    toBegin();
  }
);

watch(
  () => props.delay,
  () => {
    toBegin();
  }
);

watch(
  () => props.duration,
  () => {
    toBegin();
  }
);

onMounted(() => {
  toBegin();
});

onBeforeUnmount(() => {
  if (timeout.value !== null) {
    clearTimeout(timeout.value);
  }
  if (timer.value !== null) {
    clearInterval(timer.value);
  }
});

watch(
  () => cursor.value,
  (cursorVal) => {
    // slice(start,end)：不包含end
    content.value = props.printerInfo.slice(0, cursorVal);
  }
);
</script>
