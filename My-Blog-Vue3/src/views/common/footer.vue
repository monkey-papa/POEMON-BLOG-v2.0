<template>
  <footer id="footer">
    <div id="footer_icons" class="myCenter">
      <div>
        <a
          class="icon_link myCenter"
          data-pjax-state=""
          href="javascript:;"
          @click="toUrl('/about')"
          title="个人主页"
        >
          <i class="iconfont icon-zhinanzhen"></i>
        </a>
        <a
          @click="copy(1)"
          class="icon_link contact-qq myCenter"
          href="javascript:;"
          title="联系QQ"
          data-pjax-state=""
        >
          <i class="iconfont icon-qq"></i>
        </a>
        <a
          @click="copy(2)"
          class="icon_link contact-wechat myCenter"
          href="javascript:;"
          title="联系微信"
          data-pjax-state=""
        >
          <i class="iconfont icon-weixin"></i>
        </a>
        <a
          class="icon_link myCenter"
          href="https://blog.csdn.net/qq_53461589?spm=1010.2135.3001.5421"
          title="CSDN主页"
          data-pjax-state=""
        >
          <i class="iconfont icon-csdn"> </i>
        </a>
      </div>
      <img
        class="footer_logo entered loaded"
        src="/title.jpg"
        data-lazy-src="/title.jpg"
        data-ll-status="loaded"
      />
      <div>
        <a
          class="icon_link myCenter"
          target="_blank"
          rel="noopener"
          href="https://github.com/monkey-papa/POEMON-BLOG"
          title="Github主页"
        >
          <i class="iconfont icon-github"></i>
        </a>
        <a
          class="icon_link myCenter"
          target="_blank"
          rel="noopener"
          href="https://www.bilibili.com/video/BV1nh4y1m7CV/?spm_id_from=333.999.0.0"
          title="哔哩哔哩主页"
        >
          <i class="iconfont icon-wf_Bzhan"></i>
        </a>
        <a
          class="icon_link myCenter"
          target="_blank"
          rel="noopener"
          href="https://travellings.link"
          title="随机跳转到另一个加入开往的网页"
        >
          <i class="iconfont icon-huochepiao"></i>
        </a>
        <a
          class="icon_link myCenter"
          target="_blank"
          rel="noopener"
          href="https://www.foreverblog.cn/go.html"
          title="随机访问十年之约友链博客"
        >
          <i class="iconfont icon-AppIcon"></i>
        </a>
      </div>
    </div>
    <div id="footer_content">
      <div class="footer-group">
        <h3 class="footer-title">直达</h3>
        <div class="footer-links">
          <a
            class="footer-item"
            @click="toUrl('/tools')"
            href="javascript:;"
            data-pjax-state=""
            >藏宝阁</a
          >
          <a
            class="footer-item"
            @click="toUrl('/friend')"
            href="javascript:;"
            data-pjax-state=""
            >友链</a
          >
          <a
            class="footer-item"
            @click="toUrl('/message')"
            href="javascript:;"
            data-pjax-state=""
            >留言厅</a
          >
          <a
            class="footer-item"
            @click="toUrl('/travel')"
            href="javascript:;"
            data-pjax-state=""
            >个人相册</a
          >
          <a
            class="footer-item"
            @click="toUrl('/funny')"
            href="javascript:;"
            data-pjax-state=""
            >幻音坊</a
          >
        </div>
      </div>
      <div class="footer-group">
        <h3 class="footer-title">分类</h3>
        <div class="footer-links">
          <a
            class="footer-item"
            @click="toUrl('/sort?sortId=1')"
            href="javascript:;"
            data-pjax-state=""
            >学习笔记</a
          >
          <a
            class="footer-item"
            @click="toUrl('/sort?sortId=6')"
            href="javascript:;"
            data-pjax-state=""
            >我的项目</a
          >
          <a
            class="footer-item"
            @click="toUrl('/sort?sortId=3')"
            href="javascript:;"
            data-pjax-state=""
            >游戏</a
          >
          <a
            class="footer-item"
            @click="toUrl('/sort?sortId=4')"
            href="javascript:;"
            data-pjax-state=""
            >动漫</a
          >
          <a
            class="footer-item"
            @click="toUrl('/sort?sortId=7')"
            href="javascript:;"
            data-pjax-state=""
            >随想</a
          >
          <a
            class="footer-item"
            @click="toUrl('/sort')"
            href="javascript:;"
            data-pjax-state=""
            >查看全部</a
          >
        </div>
      </div>
      <div class="footer-group" id="friend-links-in-footer">
        <h3 class="footer-title">友链</h3>
        <div class="footer-links">
          <a class="footer-item" target="_blank" href="https://poetize.cn/"
            >POETIZE</a
          >
          <a class="footer-item" target="_blank" href="https://www.qcqx.cn/"
            >轻笑Chuckle</a
          >
          <a
            class="footer-item"
            target="_blank"
            href="https://blog.ezuxoay.top/home"
            >Ezuxoay</a
          >
          <a
            class="footer-item"
            target="_blank"
            href="https://blog.zhengxian.top/"
            >380AM-0204</a
          >
          <a
            class="footer-item"
            @click="toUrl('/friend')"
            href="javascript:;"
            data-pjax-state=""
            >查看更多</a
          >
        </div>
      </div>
    </div>
    <div id="footer-bottom">
      <div class="footer-bottom-content">
        <div class="footer-bottom-left">
          <span
            >Copyright © 2023 By
            <a
              data-pjax-state=""
              href="javascript:;"
              @click="toUrl('/')"
              title="点击访问Monkey-PaPa的主页"
              >Monkey-PaPa
            </a>
          </span>
          <div>
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://cloud.tencent.com/"
              title="腾讯云提供图片存储和网站托管"
              >腾讯云</a
            >
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://tongji.baidu.com/"
              title="百度统计提供用户访问统计"
              >百度统计</a
            >
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://vercel.com/"
              title="Vercel提供镜像站托管"
              >Vercel</a
            >
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://github.com/"
              title="Github提供源码托管"
              >Github</a
            >
          </div>
        </div>
        <div class="footer-bottom-right">
          <div id="runtime" title="本站已运行 1.10 坤年🐔🏀">
            本站已运行：{{ countdownChange }}
          </div>
          <div>
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://v2.cn.vuejs.org/v2/guide/"
              title="框架"
              >Vue3</a
            >
            <a
              class="footer-bottom-link"
              target="_blank"
              href="https://docs.djangoproject.com/zh-hans/5.0/"
              title="框架"
              >Django</a
            >
            <a class="footer-bottom-link" href="javascript:;" title="备案号"
              >京cpu备5201314号</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { notifySuccess } from "@/utils/notify";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGlobalProperties } from "@/composables/useGlobalProperties";

const { $common, $router } = useGlobalProperties();

const countdownTime = ref("2023-08-13 00:00:00");
const countdownChange = ref("");
const countdownTimer = ref(null);

onMounted(() => {
  countdownTimer.value = setInterval(() => {
    countdown();
  }, 1000);
});

onBeforeUnmount(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
});

const toUrl = (path) => {
  $router.push(path);
};

const copy = (val) => {
  const number = val === 1 ? "1816298537" : "z-poemon";
  const text = val === 1 ? "QQ" : "微信";
  const aux = document.createElement("input");
  aux.setAttribute("value", number);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  notifySuccess(`本博主的${text}已经到你的剪贴板啦，快加入我们吧~~🎉`);
};

const countdown = () => {
  if ($common.isEmpty(countdownTime.value)) {
    return;
  }
  const countdownResult = $common.countdown(countdownTime.value);
  countdownChange.value =
    countdownResult.d +
    "天" +
    countdownResult.h +
    "时" +
    countdownResult.m +
    "分" +
    countdownResult.s +
    "秒";
  countdownChange.value = countdownChange.value.replace(/-/g, " ");
};
</script>

<style lang="scss" scoped>
#footer_icons,
#footer_content {
  margin: auto;
  background: var(--background);
}

#footer_icons {
  padding-top: 2rem;
  flex-wrap: wrap;

  > div {
    display: flex;
  }

  img.footer_logo {
    border-style: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    margin: 0 1rem;
    filter: drop-shadow(0 0 12px var(--blue22));
    transition: all 0.25s;

    &:hover {
      transform: scale(1.1);
      transition-duration: 0.4s;
    }
  }

  a {
    text-decoration: none;
    word-wrap: break-word;
    transition: all 0.2s;
    overflow-wrap: break-word;
  }

  .icon_link {
    height: 40px;
    width: 40px;
    margin: 1rem;
    background-color: var(--fontColor);
    border-radius: 50%;

    i {
      font-size: 20px;
      color: var(--favoriteBg);
    }

    &:hover {
      background: var(--red);
    }
  }
}

#footer_content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 10rem 2rem;

  .footer-group {
    min-width: 120px;
    text-align: center;
  }

  .footer-title {
    color: var(--fontColor);
  }

  .footer-links {
    display: flex;
    flex-direction: column;
  }

  .footer-item {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--fontColor);

    &:hover {
      color: var(--red);
    }
  }
}

#footer-bottom {
  padding: 1rem;
  background: var(--background);
  z-index: 2;

  .footer-bottom-content {
    display: flex;
    justify-content: space-between;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .footer-bottom-left {
    a {
      margin-left: 5px;
    }
  }

  .footer-bottom-left,
  .footer-bottom-right {
    display: flex;
    flex-direction: column;
  }

  .footer-bottom-content * {
    font-size: 17px;
    white-space: nowrap;
    color: var(--fontColor);
  }

  .footer-bottom-left div,
  .footer-bottom-right div,
  .footer-bottom-left span,
  .footer-bottom-right span {
    display: flex;
    align-items: center;
  }

  a {
    display: flex;
    align-items: center;

    &:not(:first-child)::before {
      content: "|";
      font-size: 14px;
      line-height: 2.45;
      margin: 0 10px;
    }

    &:hover {
      color: var(--red);

      &:not(:first-child)::before {
        color: var(--fontColor);
      }
    }
  }

  .footer-bottom-right div {
    justify-content: flex-end;
  }
}

@media screen and (max-width: 768px) {
  #footer-bottom {
    padding: 1rem 0;

    .footer-bottom-content * {
      font-size: 1rem;
    }

    .footer-bottom-left,
    .footer-bottom-right {
      width: 100%;
      align-items: center;
    }
  }

  #footer_icons img.footer_logo {
    display: none;
  }

  #footer_content {
    padding: 1rem;

    .footer-group {
      text-align: center;
    }

    #friend-links-in-footer h3 {
      padding-left: 10px;
    }
  }
}
</style>
