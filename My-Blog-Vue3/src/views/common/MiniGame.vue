<template>
  <!-- 小游戏 -->
  <el-dialog
    class="mini-game-dialog"
    title="随机小游戏"
    v-model="dialogVisible"
    :modal-append-to-body="false"
    width="auto"
    align="center"
  >
    <div class="mini-game-dialog-content">
      <iframe :src="game" style="width: 100%; height: 900px"></iframe>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  gameUrl: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const game = computed(() => {
  return props.gameUrl || "http://game.eean.cn/pc/game";
});
</script>

<style lang="scss">
// 随机小游戏对话框
.mini-game-dialog {
  .mini-game-dialog-content {
    text-align: center;
  }
}
</style>
