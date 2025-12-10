<template>
  <div v-if="!$common.isEmpty(articleList)" class="recent-post-container">
    <smokeLoading
      v-if="loadingMark && !$common.mobile()"
      :loadingText="loadingText"
    />
    <div class="article-first myBetween">
      <div><i class="iconfont icon-ziyuan11"></i> 发现</div>
      <div class="right-icon">
        <switchBtn v-if="!$common.mobile()" @click="handleChangeIcon" />
      </div>
    </div>
    <!-- 文章list -->
    <div :class="{ 'display-flex': !activeIcon }" id="container">
      <div class="spinner" v-if="loading">
        <div class="rect1">🐣</div>
        <div class="rect2">🐣</div>
        <div class="rect3">🐣</div>
        <div class="rect4">🐤</div>
        <div class="rect5">🐤</div>
        <div class="rect6">🐤</div>
        <div class="rect7">🐥</div>
        <div class="rect8">🐥</div>
        <div class="rect9">🐥</div>
        <div class="rect10">🤪</div>
      </div>
      <template v-else>
        <div
          class="recent-post-item shadow-box"
          v-for="(article, index) in articleList"
          :key="index"
          :class="{
            waterfall: !activeIcon,
            'my-animation-slide-top': index % 2 !== 0,
            'my-animation-slide-bottom': index % 2 === 0,
          }"
          @click="$router.push({ path: '/article', query: { id: article.id } })"
        >
          <!-- 封面 -->
          <div
            class="recent-post-item-image"
            :class="{
              leftImage: index % 2 !== 0,
              rightImage: index % 2 === 0,
              waterfallImage: !activeIcon,
            }"
          >
            <el-image
              class="custom-el-image"
              @load="allLoad"
              :lazy="activeIcon"
              :src="article.articleCover"
              fit="cover"
            >
              <!-- 懒加载图片 -->
              <template v-slot:placeholder>
                <div>
                  <div
                    v-if="activeIcon"
                    :class="{
                      leftImage: index % 2 !== 0 && activeIcon,
                      rightImage: index % 2 === 0 && activeIcon,
                    }"
                  >
                    <img
                      class="img img-loading"
                      :class="{ 'img-loading__active': !activeIcon }"
                      src="../assets/file/lazy.gif"
                    />
                  </div>
                </div>
              </template>
              <!-- 错误图片 -->
              <template v-slot:error>
                <div class="image-slot myCenter">
                  <img
                    class="error-img img"
                    :class="{ 'error-img__active': !activeIcon }"
                    src="../assets/file/errorBG.png"
                    alt=""
                  />
                  <div class="error-text">
                    <div class="error-text-content">
                      肥肠抱歉，图片跑掉了┮﹏┭
                    </div>
                  </div>
                </div>
              </template>
            </el-image>
          </div>
          <!-- 内容 -->
          <div
            class="recent-post-item-post"
            :class="{
              leftImage: index % 2 === 0,
              rightImage: index % 2 !== 0,
              waterfallImage: !activeIcon,
            }"
          >
            <!-- 时间 -->
            <div class="post-meta">
              <img class="post-meta-icon" src="../assets/svg/clock.svg" />
              发布于 {{ formatTime(article.createTime) }}
            </div>
            <!-- 标题 -->
            <el-tooltip placement="top" effect="light">
              <template #content>{{ article.articleTitle }}</template>
              <h3>{{ article.articleTitle }}</h3>
            </el-tooltip>
            <!-- 信息 -->
            <div class="post-meta post-meta-info">
              <span>
                <img src="../assets/svg/fire2.svg" />
                {{ article.viewCount }} 热度
              </span>
              <span>
                <img src="../assets/svg/comment2.svg" />
                {{ article.commentCount }} 条评论
              </span>
              <span>
                <img src="../assets/svg/like.svg" />
                {{ article.likeCount }} 点赞
              </span>
            </div>
            <!-- 内容 -->
            <div class="recent-post-desc">
              {{ removeMarkdown(article.articleContent) }}
            </div>
            <!-- 分类 标签 -->
            <div class="sort-label">
              <div
                class="sort-label--item"
                @click.stop="
                  $router.push({
                    path: '/sort',
                    query: { sortId: article.sortId },
                  })
                "
              >
                <img src="../assets/svg/sort2.svg" />
                <div class="SortLabelName">{{ article.sort[0].sortName }}</div>
              </div>
              <div
                class="sort-label--item"
                @click.stop="
                  $router.push({
                    path: '/sort',
                    query: { sortId: article.sortId, labelId: article.labelId },
                  })
                "
              >
                <img src="../assets/svg/tag2.svg" />
                <div class="SortLabelName">
                  {{ article.label[0].labelName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
} from "vue";

const switchBtn = defineAsyncComponent(() => import("./common/switchBtn.vue"));
const smokeLoading = defineAsyncComponent(() =>
  import("./common/smokeLoading.vue")
);

const props = defineProps({
  articleList: {
    type: Array,
  },
  parentLoadingMark: {
    type: Boolean,
  },
});

const loading = ref(false);
const loadingText = ref("Loading...");
const loadingMark = ref(false);
const activeIcon = ref(true);
const screenWidth = ref(window.innerWidth);
const allLoadIndex = ref(0); // 记录加载完成的图片数量

watch(
  () => props.parentLoadingMark,
  (newVal) => {
    loadingMark.value = newVal;
    loadingText.value = "Monkey-PaPa";
  },
  { immediate: true }
);

// 翻页
watch(
  () => props.articleList,
  (newVal) => {
    if (newVal.length > 0 && !activeIcon.value) {
      loadingMark.value = true;
      const cParent = document.querySelector("#container");
      if (cParent) {
        cParent.style.opacity = "0";
      }
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  setTimeout(() => {
    loadingMark.value = false;
  }, 3500);
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

const updateColumns = () => {
  // tip：媒体查询行不通
  screenWidth.value = window.innerWidth;
  if (screenWidth.value > 958) {
    document.querySelectorAll(".waterfall").forEach((item, i) => {
      // 以下控制一排3个盒子
      if ((i + 1) % 3 === 0) {
        item.style.width = "32%";
        item.style.marginRight = "0";
      } else {
        item.style.width = "32%";
        item.style.marginRight = "2%";
      }
    });
  }
  if (screenWidth.value <= 958) {
    document.querySelectorAll(".waterfall").forEach((item, i) => {
      if ((i + 1) % 2 === 0) {
        item.style.width = "49%";
        item.style.marginRight = "0";
      } else {
        item.style.width = "49%";
        item.style.marginRight = "2%";
      }
    });
  }
  if (screenWidth.value <= 545) {
    document.querySelectorAll(".waterfall").forEach((item, i) => {
      item.style.width = "100%";
      item.style.marginRight = "0";
    });
  }
  imgLocation();
};

const handleChangeIcon = () => {
  allLoadIndex.value = 0;
  loading.value = !loading.value;
  const cParent = document.querySelector("#container");
  setTimeout(() => {
    loading.value = !loading.value;
    activeIcon.value = !activeIcon.value;
    if (!activeIcon.value) {
      if (cParent) {
        cParent.style.opacity = "0";
      }
    } else {
      if (cParent) {
        cParent.style.height = "auto";
      }
    }
  }, 1000);
};

const allLoad = () => {
  if (activeIcon.value) return;
  allLoadIndex.value++;
  if (allLoadIndex.value === props.articleList.length) {
    imgLocation();
  }
};

const imgLocation = () => {
  if (activeIcon.value) return;
  const cParent = document.querySelector("#container");
  const cChild = cParent && cParent.querySelectorAll(".waterfall");
  // 父盒子宽度
  const screenWidth = cParent && cParent.offsetWidth;
  // 子盒子宽度
  const imgWidth = cChild.length > 0 && cChild[0].offsetWidth;
  // 列数 = 父盒子宽度 / 子盒子宽度
  const num = Math.floor(screenWidth / imgWidth) || 0;
  // 图片间隔
  const gap = (screenWidth - num * imgWidth) / (num - 1);
  // 下边距
  const marginBottom = 10;
  // 操作第num+1张图
  const boxHeightArr = new Array(num);
  boxHeightArr.fill(0);
  for (let i = 0; i < cChild.length; i++) {
    if (i < num) {
      // 摆放图片
      cChild[i].style.position = "absolute";
      cChild[i].style.top = "0px";
      cChild[i].style.left = i * imgWidth + i * gap + "px";
      boxHeightArr[i] = cChild[i].offsetHeight;
    } else {
      // 找数组最小值
      const minHeight = Math.min(...boxHeightArr);
      const minIndex = boxHeightArr.indexOf(minHeight);
      // 摆放图片
      cChild[i].style.position = "absolute";
      cChild[i].style.top = minHeight + marginBottom + "px";
      cChild[i].style.left = cChild[minIndex].offsetLeft + "px";
      // 更新高度数组
      boxHeightArr[minIndex] += cChild[i].offsetHeight + marginBottom;
    }
  }
  // 找数组最大值
  const maxIndex = Math.max(...boxHeightArr);
  if (cParent) {
    cParent.style.height = maxIndex + "px";
    cParent.style.opacity = "1";
  }
  loadingMark.value = false;
};

const formatTime = (row) => {
  const day = row.split(".")[0].split("T")[0];
  const time = row.split(".")[0].split("T")[1];
  return `${day} 日 ${time}`;
};

const removeMarkdown = (row) => {
  // 去除字符串中所有#和*
  return row.replace(/[#*]/g, "");
};
</script>
<style lang="scss" scoped>
.recent-post-container {
  max-width: 1080px;
  margin: auto;

  .article-first {
    height: 38px;
    color: var(--red);
    border-bottom: 1px dashed var(--red);
    padding-bottom: 5px;
    margin-bottom: 25px;

    .right-icon {
      width: 62px;
      transform: scale(0.16);
    }
  }

  #container {
    position: relative;

    &.display-flex {
      display: flex;
      flex-wrap: wrap;
    }

    .spinner {
      margin: 160px auto 0;
      width: 180px;
      height: 90px;
      text-align: center;

      > div {
        height: 100px;
        width: 18px;
        display: inline-block;
        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
      }

      .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
      }

      .rect3 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
      }

      .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
      }

      .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
      }

      .rect6 {
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
      }

      .rect7 {
        -webkit-animation-delay: -0.6s;
        animation-delay: -0.6s;
      }

      .rect8 {
        -webkit-animation-delay: -0.5s;
        animation-delay: -0.5s;
      }

      .rect9 {
        -webkit-animation-delay: -0.4s;
        animation-delay: -0.4s;
      }

      .rect10 {
        -webkit-animation-delay: -0.3s;
        animation-delay: -0.3s;
      }
    }

    .recent-post-item {
      height: 300px;
      position: relative;
      display: flex;
      flex-direction: row;
      user-select: none;
      overflow: hidden;
      border-radius: 10px;
      animation: hideToShow 1s ease-in-out;
      border: 1px solid var(--gray1);

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      &:hover {
        border-color: var(--gray4);
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200%;
        background: linear-gradient(
          to right,
          transparent,
          var(--white),
          transparent
        );
        transform: translateX(-200%);
        transition: transform 0.5s linear;
        z-index: 1;
      }

      &:hover::before {
        transform: translateX(100%) skewX(-60deg);
      }

      &-image {
        width: 50%;
        height: 100%;

        :deep(.el-image__inner) {
          transition: all 1s;

          &:hover {
            transform: scale(1.2);
          }
        }

        &.leftImage {
          position: absolute;
          left: 0;
        }

        &.rightImage {
          position: absolute;
          right: 0;
          text-align: right;
        }

        &.waterfallImage {
          width: 100%;
          position: unset;
          text-align: unset;
        }

        .img-loading {
          object-fit: cover;
          height: 300px;
          width: 540px;

          &__active {
            width: 100%;
          }
        }

        .error-img {
          position: relative;
          z-index: 1;
          object-fit: cover;
          height: 300px;
          width: 100%;

          &__active {
            height: 240px;
            width: 100%;
          }
        }

        .error-text {
          z-index: 2;
          position: absolute;
          font-size: 16px;
          line-height: 1.8;
          letter-spacing: 8px;

          .error-text-content {
            color: var(--wheat1);
          }
        }
      }

      &-post {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;

        h3 {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-weight: 600;
        }

        &.leftImage {
          position: absolute;
          left: 0;

          .sort-label {
            position: absolute;
            bottom: 20px;
            height: 20px;
            display: flex;
          }
        }

        &.rightImage {
          position: absolute;
          right: 0;
          text-align: right;

          .sort-label {
            position: absolute;
            bottom: 20px;
            right: 35px;
            height: 20px;
            display: flex;
          }
        }

        &.waterfallImage {
          width: 100%;
          position: unset;
          text-align: unset;
          padding: 10px 15px;

          .sort-label {
            position: unset;
            margin-top: 8px;
          }

          .post-meta,
          .post-meta.post-meta-info {
            margin-bottom: 8px;
          }
        }

        .post-meta {
          font-size: 14px;
          color: var(--red1);

          .post-meta-icon {
            vertical-align: -3px;
          }

          &.post-meta-info {
            margin-bottom: 15px;
            color: var(--darkBlue);

            img {
              vertical-align: -2px;
            }
          }

          i {
            font-size: 15px;
          }

          span:not(:last-child) {
            margin-right: 10px;
          }
        }

        .recent-post-desc {
          font-weight: 400;
          font-size: 16px;
          line-height: 1.7;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .sort-label {
          .sort-label--item {
            display: flex;
            align-items: center;
            padding: 3px 10px;
            background-color: var(--white);
            border-radius: 3px;
            font-size: 14px;
            color: var(--red5);
            user-select: none;
            border: 1px solid var(--gray1);

            > img {
              vertical-align: -3px;
              margin-right: 5px;
            }

            &:first-child {
              margin-right: 12px;
            }

            &:hover {
              border-color: var(--gray4);
              background: var(--gradientAnimation);
              color: var(--white2);
            }

            .SortLabelName {
              max-width: 110px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      &.waterfall {
        height: unset;
        width: 32%;
        margin-right: 2%;
        display: flex;
        flex-direction: column;

        &:not(:last-child) {
          margin-bottom: unset;
        }
      }
    }
  }
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

@media screen and (max-width: 958px) {
  .recent-post-container {
    #container {
      .recent-post-item {
        &-image {
          &.rightImage {
            .img {
              width: 100%;
            }
          }

          &.leftImage {
            .img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 545px) {
  .recent-post-container {
    #container {
      .recent-post-item {
        height: 450px;
        display: block;

        &-image {
          width: 100%;
          height: 200px;

          &.leftImage {
            position: unset;
            left: unset;

            .img {
              height: 100%;
              width: 100%;
            }
          }

          &.rightImage {
            position: unset;
            right: unset;
            text-align: unset;

            .img {
              height: 100%;
              width: 100%;
            }
          }
        }

        &-post {
          width: 100%;
          height: 250px;
          position: relative;

          .recent-post-desc {
            -webkit-line-clamp: 2;
          }
        }

        &.leftImage {
          .sort-label {
            position: absolute;
            bottom: 20px;
          }
        }

        &.rightImage {
          .sort-label {
            position: absolute;
            bottom: 20px;
            right: unset;
          }
        }
      }
    }
  }
}
</style>
