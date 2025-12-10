<template>
  <div>
    <Transition name="body">
      <div v-show="showEmoji">
        <span
          class="emoji-item"
          v-for="(value, key, index) in emojiListURL"
          :key="index"
          @click="addEmoji(key)"
        >
          <img class="emoji" :src="value" :title="key" />
        </span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const props = defineProps({
  showEmoji: {
    type: Boolean,
  },
});

const emit = defineEmits(["addEmoji"]);

const { $constant } = useGlobalProperties();

const emojiList = ref($constant.emojiList);
const emojiListURL = ref({});

onMounted(() => {
  emojiListURL.value = getEmojiList(emojiList.value);
});

const getEmojiList = (emojiListData) => {
  let emojiName;
  let url;
  const result = {};
  for (let i = 0; i < emojiListData.length; i++) {
    emojiName = "[" + emojiListData[i] + "]";
    const j = i + 1;
    url = $constant.qiniuUploadEntrance + "emoji/q" + j + ".gif";
    result[emojiName] = url;
  }
  return result;
};

const addEmoji = (key) => {
  emit("addEmoji", key);
};
</script>

<style lang="scss" scoped>
.emoji-item {
  display: inline-block;

  &:hover {
    transition: all 0.2s;
    border-radius: 0.25rem;
    background: var(--gray15);
  }

  .emoji {
    margin: 0.25rem;
    vertical-align: middle;
    height: 24px;
    width: 24px;
  }
}

.body-enter-active,
.body-leave-active {
  transition: all 0.3s;
}

.body-enter-form,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
