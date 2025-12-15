<template>
  <div class="message-container">
    <div class="message-content">
      <div
        style="animation: header-effect 2s; top: 0"
        :style="{ background: `${changeBgState}` }"
        class="background-image background-image-changeBg"
      ></div>
      <!-- 输入框 -->
      <div class="message-in">
        <h2 class="message-title">树洞</h2>
        <h4 class="message-title">想说的·想问的·吐槽·交流</h4>
        <div>
          <input
            ref="focus"
            class="message-input"
            type="text"
            placeholder="留下点什么啦~"
            v-model="messageContent"
            @click="show = true"
            maxlength="60"
          />
          <button
            v-show="show"
            @click="submitMessage"
            class="message-input message-input-button"
          >
            发射
          </button>
        </div>
      </div>
      <!-- 弹幕 -->
      <div class="barrage-container">
        <vue-danmaku
          :danmus="barrageList"
          :loop="true"
          :isSuspend="true"
          :top="20"
          :speeds="100"
          useSlot
          style="height: 100%; width: 100%"
        >
          <template v-slot:dm="{ danmu }">
            <div class="danmaku-name">
              <span class="bullet-item" :style="{ color: getRandomColor() }">
                <img :src="danmu.avatar" alt="" />
                {{ danmu.msg }}</span
              >
            </div>
          </template>
        </vue-danmaku>
      </div>
    </div>
    <div class="comment-wrap">
      <div class="comment-content">
        <comment
          :source="0"
          :type="'message'"
          @getProhibitedWordsList="getProhibitedWordsList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, computed } from "vue";
import vueDanmaku from "vue3-danmaku";
vueDanmaku;
import { defineAsyncComponent } from "vue";
import { useStore } from "@/stores";
import { useGlobalProperties } from "@/composables/useGlobalProperties";
import { useFormValidation } from "@/composables/useFormValidation";

const store = useStore();
const { $common } = useGlobalProperties();
const { validateRequiredWarn, validateLogin } = useFormValidation();

const changeBgState = computed(() => store.changeBg);
const currentUser = computed(() => store.currentUser);

const comment = defineAsyncComponent(() => import("./common/comment.vue"));

const show = ref(false);
const messageContent = ref("");
const barrageList = ref([]);
const prohibitedWordsList = ref([]);

const colorList = [
  "rgb(204,255,255)",
  "white",
  "rgb(204,255,204)",
  "white",
  "rgb(0,255,255)",
  "white",
  "rgb(255,204,255)",
  "pink",
];

const focus = ref(null);

onMounted(() => {
  getTreeHole();
  focus.value?.focus();
});

const getRandomColor = () => {
  const color = colorList[Math.floor(Math.random() * 8)];
  return color;
};

const getProhibitedWordsList = (prohibitedWordsListData) => {
  prohibitedWordsList.value = prohibitedWordsListData;
};

const getTreeHole = async () => {
  try {
    const res = await api.getBossTreeHoleList({
      size: 0,
      current: 1,
    });
    if (!$common.isEmpty(res.result[0])) {
      res.result[0].records.forEach((m) => {
        barrageList.value.push({
          id: m.id,
          avatar: m.avatar,
          msg: m.message,
          time: Math.floor(Math.random() * 10 + 5),
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submitMessage = async () => {
  if (!validateRequiredWarn({ [messageContent.value]: "写" })) return;

  const treeHole = {
    message: messageContent.value.trim(),
  };
  const newArr = [];
  const list = [];
  const word = treeHole.message.split("");
  prohibitedWordsList.value.forEach((e) => list.push(e.message));
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < word.length; j++) {
      if (word[j] === list[i]) {
        newArr.push(word[j]);
      }
    }
  }
  if (newArr.length > 0) {
    notifyError("你发的留言带有违禁词！请发一条友好的留言~~~");
    return;
  }
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;
  treeHole.avatar =
    currentUser.value.avatar || "https://your-qiniu-domain/userAvatar/avatar";
  treeHole.username = currentUser.value.username;

  try {
    const res = await api.saveTreeHole(treeHole);
    if (!$common.isEmpty(res.result[0])) {
      try {
        await api.sendCodeComment({
          email: "1816298537@qq.com",
          comment: treeHole.message,
          name: currentUser.value.username,
          type: "",
        });
        notifySuccess("发射成功！同时也给博主发送了一封邮件~");
      } catch (error) {
        console.log(error);
      }
      barrageList.value.push({
        id: res.result[0].records[0].id,
        avatar: res.result[0].records[0].avatar,
        msg: res.result[0].records[0].message,
        time: Math.floor(Math.random() * 10 + 5),
      });
    }
  } catch (error) {
    console.log(error);
  }
  messageContent.value = "";
  show.value = false;
};
</script>

<style lang="scss" scoped>
.message-container {
  .message-content {
    .message-in {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      color: var(--green2);
      animation: hideToShow 2.5s;
      width: 360px;
      z-index: 10;
      text-align: center;

      .message-title {
        user-select: none;
        text-align: center;
        font-size: 24px;
        font-weight: 400;
      }

      .message-input {
        border-radius: 1.2rem;
        border: var(--lightRed) 1px solid;
        color: var(--lightRed);
        background: var(--transparent);
        padding: 10px 10px;
        outline: none;
        width: 70%;

        &::-webkit-input-placeholder {
          color: var(--lightRed);
        }

        &.message-input-button {
          margin-left: 12px;
          width: 20%;
        }
      }
    }

    .barrage-container {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
      height: calc(100% - 50px);
      width: 100%;
      user-select: none;
      overflow: hidden;

      .danmaku-name {
        .bullet-item {
          white-space: nowrap;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 30px;
          height: 30px;
          font-size: 16px;
          color: #ffffff;
          line-height: 30px;
          padding-right: 20px;
          display: flex;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      }
    }
  }

  .comment-wrap {
    margin-top: 100vh;
    background: var(--background);
    width: 100%;

    .comment-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
  }
}
</style>
