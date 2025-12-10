<template>
  <div class="myTag" :style="bg">
    <span class="name">🔖 {{ info }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  info: {
    type: String,
    default: "monkey-papa",
  },
  color: {
    type: String,
  },
});

const bg = computed(() => ({ background: props.color }));
</script>

<style lang="scss" scoped>
.myTag {
  color: var(--white);
  border-radius: 5px;
  padding: 8px;
  margin: 12px;

  &:hover {
    background: var(--gradualRed) !important;
  }
}
</style>
