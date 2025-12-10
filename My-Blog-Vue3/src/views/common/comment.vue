<template>
  <div class="comment-container">
    <!-- 评论框 -->
    <div class="comment-head-box">
      <div class="comment-head">
        <el-icon size="22" color="var(--red)"><Edit /></el-icon>
        留言
      </div>
      <div>
        <!-- 文字评论 -->
        <div>
          <commentBox @submitComment="submitComment" />
        </div>
      </div>
    </div>
    <!-- 评论内容 -->
    <div class="comment-content-box" v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span class="commentInfo-title-text">Comments | </span>
        <span>{{ total }} 条留言</span>
      </div>
      <!-- 评论详情 -->
      <div
        id="comment-content"
        class="commentInfo-detail"
        v-for="(item, index) in comments"
        :key="index"
      >
        <!-- 头像 -->
        <el-avatar
          shape="square"
          class="commentInfo-avatar"
          :size="35"
          :src="item.avatar || webInfo.avatar"
        />
        <div class="commentInfo-content-box">
          <!-- 评论人信息 -->
          <div class="commentInfo-left-box">
            <div class="commentInfo-left">
              <span class="commentInfo-username">{{ item.username }}</span>
              <span class="commentInfo-master" v-if="item.userType === 0"
                >店长</span
              >
              <span class="commentInfo-other">{{
                $common.getDateDiff(item.createTime)
              }}</span>
            </div>
            <div class="commentInfo-reply" @click="replyDialog(item, item)">
              <span
                class="commentInfo-reply-text"
                v-if="item.childComments[0].total > 0"
                >{{ item.childComments[0].total }} </span
              ><span><i class="iconfont icon-chat--fill"></i></span>
            </div>
          </div>
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.commentContent"></span>
          </div>
          <!-- 回复模块 -->
          <div
            v-if="
              !$common.isEmpty(item.childComments[0]) &&
              !$common.isEmpty(item.childComments[0].records)
            "
          >
            <div
              class="commentInfo-detail"
              v-for="(childItem, i) in item.childComments[0].records"
              :key="i"
            >
              <!-- 头像 -->
              <el-avatar
                shape="square"
                class="commentInfo-avatar"
                :size="30"
                :src="childItem.avatar || webInfo.avatar"
              />
              <div class="commentInfo-content-box">
                <!-- 评论人信息 -->
                <div class="commentInfo-left-box">
                  <div class="commentReply-left">
                    <span class="commentInfo-username-small">{{
                      childItem.username
                    }}</span>
                    <span
                      class="commentInfo-master"
                      v-if="childItem.userType === 0"
                      >店长</span
                    >
                    <span class="commentInfo-other">{{
                      $common.getDateDiff(childItem.createTime)
                    }}</span>
                  </div>
                  <div>
                    <span
                      class="commentInfo-reply"
                      @click="replyDialog(childItem, item)"
                      ><i class="iconfont icon-chat--fill"></i
                    ></span>
                  </div>
                </div>
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <template
                    v-if="
                      childItem.parentCommentId !== item.id &&
                      childItem.parentUserId !== childItem.userId
                    "
                  >
                    <span class="commentInfo-at-text"
                      >@{{ childItem.parentUsername }} </span
                    >:
                  </template>
                  <span v-html="childItem.commentContent"></span>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div
              class="pagination-wrap"
              v-if="
                item.childComments[0].records.length <
                item.childComments[0].total
              "
            >
              <div class="pagination" @click="toChildPage(item)">展开</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <proPage
        :current="pagination.current"
        :size="pagination.size"
        :total="pagination.total"
        :buttonSize="6"
        :color="$constant?.commentPageColor"
        @toPage="toPage"
      />
    </div>
    <div v-else class="comment-empty-box myCenter">
      <i>来发第一个留言啦~</i>
    </div>
    <el-dialog
      title="留言"
      v-model="replyDialogVisible"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
      destroy-on-close
      center
      class="custom-my-dialog"
    >
      <div>
        <commentBox :disableGraffiti="true" @submitComment="submitReply" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { notifySuccess, notifyError } from "@/utils/notify";
import api from "@/api";
import { ref, onMounted, computed } from "vue";
import { defineAsyncComponent } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const commentBox = defineAsyncComponent(() => import("./commentBox.vue"));
const proPage = defineAsyncComponent(() => import("./proPage.vue"));

const props = defineProps({
  source: {
    type: Number, // 0 树洞评论 1 恋爱留言 其他 文章评论
  },
  type: {
    type: String,
  },
});

const emit = defineEmits(["getProhibitedWordsList"]);

import { useStore } from "@/stores";

const store = useStore();
const { $constant, $common } = useGlobalProperties();

const webInfo = computed(() => store.webInfo);
const currentUser = computed(() => store.currentUser);
const userList = computed(() => store.userList);

const setUserList = (value) => store.setUserList(value);

const total = ref(0);
const replyDialogVisible = ref(false);
const floorComment = ref({});
const replyComment = ref({});
const comments = ref([]);
const pagination = ref({
  current: 1,
  size: 5,
  total: 0,
  source: props.source,
  commentType: props.type,
  floorCommentId: null,
  csize: 5,
});
const prohibitedWordsList = ref([]);
const userPagination = ref({
  current: 1,
  size: 9999,
  total: 0,
  searchKey: "",
  userStatus: null,
  userType: null,
});

onMounted(() => {
  getProhibitedWordsList();
  getComments(pagination.value);
  if (userList.value.length === 0) {
    getUsers();
  }
  emit("getProhibitedWordsList", prohibitedWordsList.value);
});

const getUsers = async () => {
  try {
    const res = await api.getUserListPaginated(userPagination.value);
    if (!$common.isEmpty(res.result[0].data)) {
      setUserList(res.result[0].data);
    }
  } catch (error) {
    console.log(error);
  }
};

// 跳转到指定页数
const toPage = (page) => {
  pagination.value.current = page;
  window.scrollTo({
    top: document.getElementById("comment-content").offsetTop,
  });
  getComments(pagination.value);
};

// 展开
const toChildPage = (floorCommentItem) => {
  // floorComment 传过来的一个一级评论对象
  floorCommentItem.childComments[0].current += 1;
  const paginationData = {
    current: floorCommentItem.childComments[0].current,
    size: 5,
    total: 0,
    source: props.source,
    commentType: props.type,
    floorCommentId: floorCommentItem.id,
    csize: 5,
  };
  getComments(paginationData, floorCommentItem, true);
};

const emoji = (commentsData, flag) => {
  // 传过来的true对应着comments是this.comments，false对应着comments是floorComment.childComments[0].records
  commentsData.forEach((c) => {
    c.commentContent = c.commentContent.replace(/\n/g, "<br/>");
    // 表情包转换
    c.commentContent = $common.faceReg(c.commentContent);
    // 图片转换
    c.commentContent = $common.pictureReg(c.commentContent);
    // 传过来的true对应着comments是this.comments，false是floorComment.childComments[0].records
    if (flag) {
      if (
        !$common.isEmpty(c.childComments) &&
        !$common.isEmpty(c.childComments[0].records)
      ) {
        c.childComments[0].records.forEach((cc) => {
          c.commentContent = c.commentContent.replace(/\n/g, "<br/>");
          cc.commentContent = $common.faceReg(cc.commentContent);
          cc.commentContent = $common.pictureReg(cc.commentContent);
        });
      }
    }
  });
};
const getComments = async (
  paginationData,
  floorCommentItem = {},
  isToPage = false
) => {
  try {
    const response = await api.getCommentList(paginationData);
    if (
      !$common.isEmpty(response.result[0]) &&
      !$common.isEmpty(response.result[0].data)
    ) {
      const res = response.result[0];
      if ($common.isEmpty(floorCommentItem)) {
        comments.value = res.data;
        // pagination.total用来判断分页
        paginationData.total = res.total - res.parenttotal;
        total.value = res.total;
        emoji(comments.value, true);
      } else {
        // floorComment 有值的情况是回复或者展开的情况
        // floorComment 传过来的都是一个一级评论对象
        // 点击回复的时候
        if (isToPage === false) {
          // 将新返回的二级列表返回给一级目录中，通过数据改变视图
          floorCommentItem.childComments[0].records = res.data;
          floorCommentItem.childComments[0].total = res.parenttotal;
        } else {
          // 点击展开评论的时候
          floorCommentItem.childComments[0].total = res.parenttotal;
          floorCommentItem.childComments[0].records =
            floorCommentItem.childComments[0].records.concat(res.data);
        }
        emoji(floorCommentItem.childComments[0].records, false);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const submitComment = async (commentContent) => {
  const comment = {
    source: props.source,
    type: props.type,
    commentContent,
    parentCommentId: 0,
    userId: currentUser.value.id,
    floorCommentId: null,
    parentUserId: null,
    likeCount: 0,
    commentInfo: "",
  };
  const newArr = [];
  const list = [];
  const word = comment.commentContent.split("");
  prohibitedWordsList.value.forEach((e) => list.push(e.message));
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < word.length; j++) {
      if (word[j] === list[i]) {
        newArr.push(word[j]);
      }
    }
  }
  if (newArr.length > 0) {
    notifyError("你发的评论带有违禁词！请发一条友好的评论~~~");
    return;
  }
  try {
    await api.bossAddComment(comment);
    // 评论博客主人
    try {
      await api.sendCodeComment({
        email: "1816298537@qq.com",
        comment: commentContent,
        name: currentUser.value.username,
        type: "",
      });
      notifySuccess("评论成功！同时也给当事人发送了一封邮件~");
    } catch (error) {
      console.log(error);
    }
    pagination.value = {
      current: 1,
      size: 5,
      total: 0,
      source: props.source,
      commentType: props.type,
      floorCommentId: null,
      csize: 5,
    };
    await getComments(pagination.value);
  } catch (error) {
    console.log(error);
  }
};
// commentContent是回复弹窗输入的值
const submitReply = async (commentContent) => {
  // replyComment 上面的回复是item，下面的是childItem
  // floorComment 是一个一级评论对象
  const comment = {
    source: props.source,
    type: props.type,
    commentContent,
    parentCommentId: replyComment.value.id,
    userId: currentUser.value.id,
    likeCount: 0,
    floorCommentId: floorComment.value.id,
    parentUserId: replyComment.value.userId,
    commentInfo: "",
  };
  const name = userList.value.find(
    (e) => e.id === comment.parentUserId
  ).username;
  const email = userList.value.find((e) => e.id === comment.parentUserId).email;
  // floorComment 一级评论对象
  const floorCommentItem = floorComment.value;
  floorCommentItem.childComments[0].current = 1;
  const newArr = [];
  const list = [];
  const word = comment.commentContent.split("");
  prohibitedWordsList.value.forEach((e) => list.push(e.message));
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < word.length; j++) {
      if (word[j] === list[i]) {
        newArr.push(word[j]);
      }
    }
  }
  if (newArr.length > 0) {
    notifyError("你发的评论带有违禁词！请发一条友好的评论~~~");
    return;
  }
  try {
    await api.bossAddComment(comment);
    // 回复时发邮件（回复的不是自己发的评论）
    if (comment.parentUserId !== currentUser.value.id) {
      try {
        await api.sendCodeComment({
          email,
          comment: commentContent,
          name,
          type: "",
        });
        notifySuccess("评论成功！同时也给当事人发送了一封邮件~");
      } catch (error) {
        console.log(error);
      }
    } else {
      notifySuccess("评论成功！");
    }
    const paginationData = {
      current: 1,
      size: 5,
      total: 0,
      source: props.source,
      commentType: props.type,
      floorCommentId: floorCommentItem.id,
    };
    await getComments(paginationData, floorCommentItem);
  } catch (error) {
    console.log(error);
  }
  handleClose();
};

// floorComment 传过来的一个一级评论对象，comment上面的回复是item，下面的是childItem
const replyDialog = (comment, floorCommentItem) => {
  replyComment.value = comment;
  floorComment.value = floorCommentItem;
  replyDialogVisible.value = true;
};

const handleClose = () => {
  replyDialogVisible.value = false;
  floorComment.value = {};
  replyComment.value = {};
};

const getProhibitedWordsList = async () => {
  try {
    const res = await api.getProhibitedWordsList({
      current: 1,
      size: 10,
      total: 0,
      searchKey: "",
    });
    if (res.result[0]) {
      prohibitedWordsList.value = res.result[0].data;
      emit("getProhibitedWordsList", prohibitedWordsList.value);
    } else {
      notifyError(res.data.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.comment-container {
  .comment-head-box {
    margin-bottom: 40px;

    .comment-head {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      margin: 40px 0 20px 0;
      user-select: none;
      color: var(--red);
    }
  }

  .comment-content-box {
    .commentInfo-title {
      margin-bottom: 20px;
      color: var(--bigRed);
      user-select: none;

      .commentInfo-title-text {
        font-size: 1.15rem;
      }
    }
  }

  .comment-empty-box {
    color: var(--red);
  }
}

.commentInfo-detail {
  display: flex;

  .commentInfo-avatar {
    border-radius: 5px;
  }

  .commentInfo-content-box {
    flex: 1;
    padding-left: 12px;

    .commentInfo-left-box {
      display: flex;
      justify-content: space-between;

      .commentInfo-left,
      .commentReply-left {
        .commentInfo-username {
          color: var(--red);
          font-size: 18px;
          font-weight: 400;
          margin-right: 5px;

          &-small {
            color: var(--red);
            font-size: 16px;
            font-weight: 400;
            margin-right: 5px;
          }
        }

        .commentInfo-master {
          color: var(--bigRed);
          border: 1px solid var(--bigRed);
          border-radius: 0.2rem;
          font-size: 14px;
          padding: 2px 4px;
          margin-right: 5px;
        }

        .commentInfo-other {
          font-size: 14px;
          color: var(--darkBlue);
          user-select: none;
        }
      }

      .commentInfo-reply {
        text-align: center;
        min-width: 30px;
        white-space: nowrap;
        height: 22px;
        user-select: none;
        color: var(--white1);
        background: var(--red3);
        border-radius: 0.2rem;
        padding: 3px 6px;
        transition: all 0.3s ease;
        border: 1px solid var(--gray1);
        display: flex;
        align-items: center;

        .commentInfo-reply-text {
          height: 16px;
          line-height: 16px;
          display: inline-block;
          font-size: 14px;
        }

        &:hover {
          color: var(--white);
          background: var(--red);
          border-color: var(--gray4);
        }
      }
    }

    .commentInfo-content {
      margin: 15px 0 25px;
      padding: 18px 20px;
      background: var(--favoriteBg);
      border-radius: 12px;
      color: var(--fontColor);
      word-break: break-word;
      transition: all 0.3s ease;
      border: 1px solid var(--gray1);

      .commentInfo-at-text {
        color: var(--blue2);
      }

      &:hover {
        border-color: var(--gray4);
      }
    }

    .pagination-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;

      .pagination {
        padding: 6px 20px;
        border: 1px solid var(--red1);
        border-radius: 3rem;
        color: var(--red1);
        user-select: none;
        text-align: center;
        font-size: 12px;

        &:hover {
          border: 1px solid var(--blue2);
          color: var(--orange2);
          box-shadow: 0 0 5px var(--blue2);
        }
      }
    }
  }
}
@media screen and (max-width: 515px) {
  .commentInfo-left {
    min-width: 196px;
  }

  .commentReply-left {
    min-width: 210px;
  }
}
</style>
