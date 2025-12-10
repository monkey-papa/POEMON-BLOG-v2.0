<template>
  <div v-if="total > size" class="myCenter">
    <ul class="page-content">
      <li class="page-item" v-if="current !== 1" @click="toPage(-1)">👈</li>
      <template v-if="current === 1">
        <li
          class="page-item"
          :style="{
            background: index === 1 ? color : '',
            color: index === 1 ? 'var(--white)' : '',
          }"
          v-for="index of realButtonSize"
          :key="index"
          @click="toPage(index)"
        >
          {{ index }}
        </li>
      </template>
      <template v-else-if="current === totalSize">
        <li
          class="page-item"
          :style="{
            background: index === realButtonSize ? color : '',
            color: index === realButtonSize ? 'var(--white)' : '',
          }"
          v-for="index of realButtonSize"
          :key="index"
          @click="toPage(current - (realButtonSize - index))"
        >
          {{ current - (realButtonSize - index) }}
        </li>
      </template>
      <template v-else>
        <li
          class="page-item"
          :style="{
            background:
              Math.ceil(realButtonSize / 2) - index === 0 ? color : '',
            color:
              Math.ceil(realButtonSize / 2) - index === 0 ? 'var(--white)' : '',
          }"
          v-for="index of realButtonSize"
          :key="index"
          @click="toPage(current - (Math.ceil(realButtonSize / 2) - index))"
        >
          {{ current - (Math.ceil(realButtonSize / 2) - index) }}
        </li>
      </template>
      <li class="page-item" v-if="current !== totalSize" @click="toPage(-2)">
        👉
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  current: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  buttonSize: {
    type: Number,
    default: 3,
  },
  color: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["toPage"]);

const totalSize = ref(0);
const realButtonSize = ref(0);

watch(
  () => props.total,
  () => {
    updateSizes();
  }
);

onMounted(() => {
  updateSizes();
});

const updateSizes = () => {
  totalSize.value = Math.ceil(props.total / props.size);
  realButtonSize.value =
    props.buttonSize < totalSize.value ? props.buttonSize : totalSize.value;
};

const toPage = (flag) => {
  if (flag === -1) {
    emit("toPage", props.current - 1);
  } else if (flag === -2) {
    emit("toPage", props.current + 1);
  } else {
    emit("toPage", flag);
  }
};
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  padding: 0;
  margin: 30px 0;

  .page-item {
    margin: 0 10px;
    list-style: none;
    border: 1px solid var(--gray15);
    width: 40px;
    height: 40px;
    line-height: 38px;
    text-align: center;
    border-radius: 50%;
    color: var(--fontColor);
    font-size: 14px;

    &:hover {
      color: var(--red);
      border: 1px solid var(--red);
      box-shadow: 0 0 5px var(--red);
    }
  }
}
</style>
