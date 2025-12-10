<template>
  <div class="article-box-container" v-if="!$common.isEmpty(article)">
    <!-- 首页图片 -->
    <div
      style="animation: header-effect 2s"
      :style="{ background: `url(${article.articleCover})` }"
      class="background-image background-image-changeBg blur-filter"
    ></div>
    <!-- 顶部 -->
    <div class="article-head my-animation-slide-top">
      <!-- 文章信息 -->
      <div class="article-info-container">
        <div class="article-title">{{ article.articleTitle }}</div>
        <div class="article-info">
          <img src="../assets/svg/redPeople.svg" />
          <span>&nbsp;{{ article.username }}</span>
          <span>·</span>
          <img src="../assets/svg/calendar.svg" />
          <span>&nbsp;{{ formatTime(article.createTime) }}</span>
          <span>·</span>
          <img src="../assets/svg/fire.svg" />
          <span>&nbsp;{{ article.viewCount }}</span>
          <span>·</span>
          <img src="../assets/svg/comment.svg" />
          <span>&nbsp;{{ article.commentCount }}</span>
          <span>·</span>
          <img src="../assets/svg/star.svg" />
          <span>&nbsp;{{ article.likeCount }}</span>
        </div>
      </div>
      <div
        class="article-info-news"
        @click="weiYanDialogVisible = true"
        v-if="
          !$common.isEmpty(currentUser) && currentUser.id === article.userId
        "
      >
        <img src="../assets/svg/plus.svg" />
      </div>
    </div>
    <!-- 文章 -->
    <div class="article-background">
      <div class="article-background-content">
        <div class="article-container my-animation-slide-bottom shadow-box">
          <!-- 文章摘要 -->
          <div class="post-ai">
            <div class="ai-title myBetween">
              <a class="ai-title-left" data-pjax-state="">
                <div @click="getSummary" class="ai-title-text">
                  <a class="icon myCenter"
                    ><i class="iconfont icon-jiqirenjiankong"></i></a
                  ><span class="text">{{
                    article.summary || summary ? "文章摘要" : "点我生成摘要"
                  }}</span>
                  <el-icon :size="15" color="var(--red)"
                    ><ArrowRight
                  /></el-icon></div
              ></a>
              <div class="ai-tag" id="ai-tag">续写</div>
            </div>
            <div v-if="article.summary || summary" class="ai-explanation">
              <p class="text">{{ article.summary || summary }}</p>
              <p class="cover">
                <span class="text cover-text">
                  {{ article.summary || summary }}</span
                >
              </p>
            </div>
            <el-skeleton :rows="3" animated v-if="loading" />
            <div class="ai-bottom">
              <div class="ai-tips">
                此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结
              </div>
            </div>
          </div>
          <!-- 最新进展 -->
          <div v-if="!$common.isEmpty(treeHoleList)" class="process-wrap">
            <el-collapse accordion value="1">
              <el-collapse-item title="最新进展" name="1">
                <process
                  :treeHoleList="treeHoleList"
                  @deleteTreeHole="deleteTreeHole"
                />
              </el-collapse-item>
            </el-collapse>
            <hr />
          </div>
          <!-- 文章内容 -->
          <div v-html="articleContentHtml" class="entry-content"></div>
          <!-- 最后更新时间 -->
          <div class="article-update-time">
            <span>文章最后更新于 {{ formatTime(article.updateTime) }}</span>
          </div>
          <!-- 分类 -->
          <div class="article-sort">
            <span
              @click="
                $router.push({
                  path: '/sort',
                  query: { sortId: article.sortId, labelId: article.labelId },
                })
              "
              >{{
                article.sort[0].sortName + " ▶ " + article.label[0].labelName
              }}</span
            >
          </div>
          <!-- 作者信息 -->
          <blockquote>
            <div class="author-info">作者：{{ article.username }}</div>
            <div class="copyright-info">版权声明：转载请注明文章出处</div>
          </blockquote>
          <!-- 点赞 -->
          <div class="myCenter" id="article-like">
            <el-icon
              :class="{ 'article-like': article.articleLikeStatus === 1 }"
              class="article-like-icon"
              @click="articleLike"
              :size="60"
              ><Pointer
            /></el-icon>
            点个赞再走叭~~
          </div>
          <!-- 评论 -->
          <div v-if="article.commentStatus === true">
            <comment :type="'article'" :source="article.id" />
          </div>
        </div>
        <!-- 侧边栏 -->
        <div class="aside-content" v-if="!$common.mobile()">
          <myAside />
        </div>
      </div>
      <div v-show="!$common.mobile() && !mobile" id="toc" class="toc"></div>
    </div>
    <div id="toc-button" @click="clickTocButton()">
      <i class="fa fa-align-justify" aria-hidden="true"></i>
    </div>
    <el-dialog
      title="最新进展"
      v-model="weiYanDialogVisible"
      width="40%"
      :append-to-body="true"
      destroy-on-close
      class="wei-yan-dialog custom-my-dialog"
      center
    >
      <div class="wei-yan-dialog-content">
        <commentBox :disableGraffiti="true" @submitComment="submitWeiYan" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  defineAsyncComponent,
  computed,
} from "vue";
import { onBeforeRouteLeave } from "vue-router";
import MarkdownIt from "markdown-it";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

// ColorThief 通过 CDN 引入，全局变量为 ColorThief
const ColorThief = window.ColorThief;
const comment = defineAsyncComponent(() => import("./common/comment.vue"));
const process = defineAsyncComponent(() => import("./common/process.vue"));
const commentBox = defineAsyncComponent(() =>
  import("./common/commentBox.vue")
);
const myAside = defineAsyncComponent(() => import("./myAside.vue"));

import { useStore } from "@/stores";
import { notifySuccess, notifyWarning } from "@/utils/notify";
import { useFormValidation } from "@/composables/useFormValidation";
import api from "@/api";

const store = useStore();
const { $route, $router, $common, $confirm } = useGlobalProperties();
const { validateLogin } = useFormValidation();

const currentUser = computed(() => store.currentUser);

const id = ref($route.query.id);
const article = ref({});
const articleContentHtml = ref("");
const treeHoleList = ref([]);
const weiYanDialogVisible = ref(false);
const mobile = ref(false);
const tocbotDom = ref(null);
const summary = ref("");
const loading = ref(false);
let resizeHandler = null;

onMounted(() => {
  getArticle();
  mobile.value = document.body.clientWidth < 500;
  resizeHandler = () => {
    const docWidth = document.body.clientWidth;
    if (docWidth < 500) {
      mobile.value = true;
    } else {
      mobile.value = false;
    }
  };
  window.addEventListener("resize", resizeHandler);
  if (!mobile.value) {
    window.addEventListener("scroll", onScrollPage, { passive: true });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollPage);
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
});

onBeforeRouteLeave(() => {
  const root = document.querySelector(":root");
  if (root) {
    root.style.setProperty("--themeColor", localStorage.getItem("themeColor"));
    $common.getThemeRgb();
  }
});

const formatTime = (row) => {
  const day = row.split(".")[0].split("T")[0];
  const time = row.split(".")[0].split("T")[1];
  return `${day} 日 ${time}`;
};

const getSummary = async () => {
  if (article.value.summary || summary.value) {
    return;
  }
  loading.value = true;

  try {
    const res = await api.generateSummary({
      message: article.value.articleContent,
      articleId: article.value.id,
    });
    summary.value = res.summary;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};

const clickTocButton = () => {
  const display = $(".toc");
  if (display.css("display") === "none" || !display.length) {
    const articleDom = $(".article-background");
    if (tocbotDom.value) {
      articleDom.append(tocbotDom.value);
    }
  } else {
    tocbotDom.value = display;
    display.remove();
  }
};

const deleteTreeHole = async (id) => {
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;

  try {
    await $confirm("确认删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });

    await api.deleteWeiYan(id);
    notifySuccess("删除成功!");
    getNews();
  } catch (error) {
    if (error === "cancel") {
      notifySuccess("已取消删除!");
    }
    console.log(error);
  }
};

const submitWeiYan = async (content) => {
  const weiYan = {
    content,
    source: article.value.id,
    userId: currentUser.value.id,
  };

  try {
    await api.saveNews(weiYan);
    notifySuccess("添加进展成功!");
    weiYanDialogVisible.value = false;
    getNews();
  } catch (error) {
    console.log(error);
  }
};

const getNews = async () => {
  try {
    const res = await api.getNewsList({
      current: 1,
      size: 9999,
      source: article.value.id,
    });
    if (!$common.isEmpty(res.result[0])) {
      res.result[0].records.forEach((c) => {
        c.content = c.content.replace(
          /\n{2,}/g,
          '<div style="height: 12px"></div>'
        );
        c.content = c.content.replace(/\n/g, "<br/>");
        c.content = $common.faceReg(c.content);
        c.content = $common.pictureReg(c.content);
      });
      treeHoleList.value = res.result[0].records;
    }
  } catch (error) {
    console.log(error);
  }
};

const onScrollPage = () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop < window.innerHeight / 4) {
    $(".toc").css("top", window.innerHeight / 2);
    $(".toc").css("display", "unset");
  } else if (
    scrollTop > window.innerHeight / 4 &&
    scrollTop < $("#article-like").offset().top - window.innerHeight
  ) {
    $(".toc").css("top", "100px");
    $(".toc").css("display", "unset");
  } else {
    $(".toc").css("display", "none");
  }
};

const getTocbot = () => {
  // tocbot 已通过 npm 包导入并在 main.js 中挂载到 window 上
  if (window.tocbot) {
    window.tocbot.init({
      tocSelector: "#toc",
      contentSelector: ".entry-content",
      headingSelector: "h1, h2, h3, h4, h5, h6",
      scrollSmooth: true,
      fixedSidebarOffset: "auto",
      scrollSmoothOffset: 0,
      hasInnerContainers: true,
    });

    // 禁用a标签的默认行为
    $("a.toc-link").on("click", function (event) {
      event.preventDefault();
    });
  }
};

const addId = () => {
  const headings = $(".entry-content").find("h1, h2, h3, h4, h5, h6");
  headings.attr("id", (i, id) => id || "toc-" + i);
};

const getColorFromImage = (articleCover) => {
  // 创建一个新的img元素
  const img = document.createElement("img");
  img.src = articleCover;
  img.setAttribute("crossOrigin", "");
  // 创建一个ColorThief实例
  const colorThief = new ColorThief();
  // 当图片加载完成后，提取颜色
  img.onload = () => {
    // 提取主色
    const dominantColor = colorThief.getColor(img);
    const root = document.querySelector(":root");
    const rgbToHex = (rgb) => {
      const [r, g, b] = rgb.map((num) => parseInt(num, 10));
      const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    const color = rgbToHex(dominantColor);
    if (root) {
      root.style.setProperty("--themeColor", color);
      $common.getThemeRgb();
    }
    // 销毁img元素
    img.remove();
  };
};

const getArticle = async () => {
  try {
    const res = await api.getArticleById({
      id: id.value,
      flag: true,
      userId: currentUser.value.id,
    });
    if (!$common.isEmpty(res.result[0])) {
      article.value = res.result[0].data[0];
      getColorFromImage(article.value.articleCover);
      getNews();
      const md = new MarkdownIt({ breaks: true });
      articleContentHtml.value = md.render(article.value.articleContent);
      nextTick(() => {
        highlight();
        addId();
        getTocbot();
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const highlight = () => {
  const attributes = {
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: "false",
    contenteditable: "false",
  };
  $("pre").each(function (i, item) {
    const preCode = $(item).children("code");
    const classNameStr = preCode[0].className;
    const classNameArr = classNameStr.split(" ");
    let lang = "";
    classNameArr.some(function (className) {
      if (className.indexOf("language-") > -1) {
        lang = className.substring(
          className.indexOf("-") + 1,
          className.length
        );
        return true;
      }
    });
    // 检测语言是否存在，不存在则自动检测
    const language = hljs.getLanguage(lang.toLowerCase());
    if (language === undefined) {
      // 启用自动检测
      const autoLanguage = hljs.highlightAuto(preCode.text());
      preCode.removeClass("language-" + lang);
      lang = autoLanguage.language;
      if (lang === undefined) {
        lang = "javascript";
      }
      preCode.addClass("language-" + lang);
    } else {
      lang = language.name;
    }
    $(item).addClass("highlight-wrap");
    $(item).attr(attributes);
    preCode.attr("data-rel", lang.toUpperCase()).addClass(lang.toLowerCase());
    // 启用代码高亮
    hljs.highlightBlock(preCode[0]);
    // 启用代码行号
    hljs.lineNumbersBlock(preCode[0]);
  });
  $("pre code").each(function (i, block) {
    $(block).attr({
      id: "hljs-" + i,
    });
    $(block).after(
      '<a class="copy-code" href="javascript:" data-clipboard-target="#hljs-' +
        i +
        '"><i class="fa fa-clipboard" aria-hidden="true"></i></a>'
    );
    new ClipboardJS(".copy-code");
  });
  if ($(".entry-content").children("table").length > 0) {
    $(".entry-content")
      .children("table")
      .wrap("<div class='table-wrapper'></div>");
  }
};

const articleLike = async () => {
  if (!validateLogin(currentUser.value, $common.isEmpty)) return;
  if (!article.value.articleLikeStatus) {
    try {
      await api.articleLike({
        userId: currentUser.value.id,
        articleLikeStatus: true,
        id: id.value,
      });
      article.value.articleLikeStatus = 1;
      notifySuccess("感谢您的点赞！");
    } catch (error) {
      console.log(error);
    }
  } else {
    notifyWarning("你已经点过赞啦！");
  }
};
</script>

<style lang="scss">
.wei-yan-dialog {
  .wei-yan-dialog-content {
    .wei-yan-dialog-content-item {
      margin-bottom: 20px;
    }
  }
}
</style>
<style lang="scss" scoped>
.article-box-container {
  .background-image {
    &.blur-filter {
      filter: blur(30px);
    }
  }

  .article-head {
    height: 40vh;
    position: relative;

    .article-info-container {
      position: absolute;
      bottom: 15px;
      left: 20%;
      color: var(--bigRed);

      .article-title {
        font-size: 28px;
        margin-bottom: 15px;
      }

      .article-info {
        font-size: 14px;
        user-select: none;
        color: var(--bigRed5);

        img {
          vertical-align: -2px;
        }

        span:not(:last-child) {
          margin-right: 5px;
        }
      }
    }

    .article-info-news {
      position: absolute;
      bottom: 10px;
      right: 20px;
      animation: scale 1s ease-in-out infinite;
    }
  }

  .article-background {
    background: var(--background);
    position: relative;
    padding: 10px 130px 0;

    .article-background-content {
      display: flex;
      justify-content: space-between;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(6px);
      z-index: -1;
    }

    .article-container {
      padding: 40px 20px;
      border-radius: 8px;
      border: 2px dashed var(--gray1);
      width: calc(100% - 310px);
      transition: all 0.3s ease;

      .post-ai {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        border: 1px dashed var(--red);
        background: var(--background);
        padding: 12px;
        margin-bottom: 12px;

        .ai-title {
          .ai-title-left {
            display: flex;
            align-items: center;

            .ai-title-icon {
              font-size: 20px;
              color: var(--red);
            }

            .ai-title-text {
              font-size: 14px;
              color: var(--red);
              display: flex;
              align-items: center;

              .icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--red);
                margin-right: 8px;

                .icon-jiqirenjiankong {
                  font-size: 14px;
                  color: var(--favoriteBg);
                  transition: all 0.3s ease;

                  &:hover {
                    opacity: 0.8;
                  }
                }
              }

              .text {
                margin-right: 4px;
                transition: all 0.3s ease;

                &:hover {
                  opacity: 0.8;
                }
              }
            }

            .ai-link {
              font-size: 20px;
              color: var(--red);
            }
          }

          .ai-tag {
            padding: 6px 8px;
            background-color: var(--red);
            color: var(--white);
            border-radius: 12px;
            font-size: 12px;
            transition: all 0.3s ease;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        .ai-explanation {
          padding: 8px 12px;
          font-size: 15px;
          margin-top: 12px;
          border-radius: 8px;
          border: 1px solid var(--myAsideBorderColor);
          color: var(--fontColor);
          background: var(--white3);
          font-size: 14px;
          line-height: 1.4;
          position: relative;

          .text {
            margin: 0;
          }

          .cover {
            position: absolute;
            top: 8px;
            left: 12px;
            padding-right: 12px;
            margin: 0;

            .cover-text {
              --p1: 0%;
              background: linear-gradient(
                to right,
                var(--black2) var(--p1),
                var(--white3) calc(var(--p1) + 20px)
              );
              color: transparent;
              animation: move-show 8s linear forwards;
            }
          }
        }

        .ai-bottom {
          padding: 0 12px;
          font-size: 12px;
          margin-top: 12px;
        }
      }

      .process-wrap {
        margin: 0 0 40px;

        hr {
          position: relative;
          margin: 20px auto 60px;
          border: 2px dashed var(--blue2);
          overflow: visible;

          &:before {
            position: absolute;
            top: -20px;
            left: 5%;
            color: var(--red);
            content: "\e673";
            font-size: 40px;
            line-height: 1;
            transition: all 1s ease;
            font-family: iconfont;
          }

          &:hover:before {
            left: calc(95% - 20px);
          }
        }

        .el-collapse {
          border-top: unset;
          border-bottom: unset;
        }

        :deep(.el-collapse-item__header) {
          border-bottom: unset;
          font-size: 20px;
          background-color: var(--background);
          color: var(--green2);

          .el-collapse-item__arrow {
            color: var(--green2);
          }

          .el-collapse-item__title {
            transition: all 0.3s ease;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        :deep(.el-collapse-item__wrap) {
          background-color: var(--background);
          border-bottom: unset;
        }
      }

      .article-update-time {
        color: var(--red);
        font-size: 14px;
        margin: 20px 0;
        user-select: none;
      }

      .article-sort {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;

        span {
          padding: 3px 10px;
          background-color: var(--blue);
          border-radius: 5px;
          font-size: 14px;
          color: var(--white1);
          margin-right: 25px;
          user-select: none;
          transition: all 0.3s ease;
          &:hover {
            color: var(--white2);
            background: var(--gradualRed);
          }
        }
      }

      blockquote {
        line-height: 2;
        border-left: 0.2rem solid var(--blue);
        padding: 10px 1rem;
        background-color: var(--favoriteBg);
        border-radius: 4px;
        margin: 0 0 40px 0;
        user-select: none;
        color: var(--black);

        .author-info {
          color: var(--blue2);
        }

        .copyright-info {
          color: var(--blue2);
        }
      }

      #article-like {
        color: var(--bigRed);
        .article-like {
          color: var(--red) !important;

          &-icon {
            color: var(--fontColor);
            transition: all 0.5s ease;
            border-radius: 50%;
            margin-bottom: 20px;

            &:hover {
              transform: rotate(360deg);
            }
          }
        }
      }

      &:hover {
        border-color: var(--red);
      }
    }

    .aside-content {
      width: 300px;
    }
  }

  #toc-button {
    position: fixed;
    right: 4vh;
    bottom: 14vh;
    z-index: 100;
    font-size: 23px;
    width: 23px;
    height: 23px;
    line-height: 23px;
    color: var(--black);
    text-align: center;

    &:hover {
      color: var(--green2);
    }
  }
}

:deep(.process-wrap .el-collapse-item__header),
:deep(.process-wrap .el-collapse-item__wrap) {
  color: var(--bigRed);
  border-radius: 8px;
  padding: 0 8px;
}

@keyframes move-show {
  to {
    --p1: 100%;
  }
}

@media screen and (max-width: 1278px) {
  .article-box-container {
    .article-background {
      padding: 10px 40px 0;
    }
  }
}

@media screen and (max-width: 1200px) {
  .article-box-container {
    .article-background {
      padding: 10px 20px 0;

      .aside-content {
        display: none;
      }

      .article-container {
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .article-box-container {
    .article-head {
      .article-info-container {
        left: 20px;
        max-width: 320px;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .article-box-container {
    #toc-button {
      right: 36px;
      bottom: 13vh;
      color: var(--red);
    }
  }
}
</style>
