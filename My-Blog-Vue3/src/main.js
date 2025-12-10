import { createApp, nextTick, watch } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useStore } from "./stores";
import { setStoreGetter } from "./utils/request";
import {
  ElDialog,
  ElImage,
  ElPopover,
  ElTooltip,
  ElDropdown,
  ElSelect,
  ElMessageBox,
} from "element-plus";
import "element-plus/es/components/notification/style/css";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/tag/style/css";
import "element-plus/es/components/upload/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/date-picker/style/css";
import "element-plus/es/components/dialog/style/css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import common from "./utils/common";
import constant from "./utils/constant";

// 导入 CDN 库的 npm 包
import $ from "jquery";
import anime from "animejs";
import hljs from "highlight.js";
import WOW from "wow.js";
import ClipboardJS from "clipboard";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// echarts 按需导入
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// 注册 echarts 组件
echarts.use([
  MapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import ColorThief from "colorthief";
import tocbot from "tocbot";
import "tocbot/dist/tocbot.css";

// 挂载到 window 对象上，以便全局使用
window.$ = window.jQuery = $;
window.anime = anime;
window.hljs = hljs;
window.WOW = WOW;
window.ClipboardJS = ClipboardJS;
window.NProgress = NProgress;
window.echarts = echarts;
window.APlayer = APlayer;
window.ColorThief = ColorThief;
window.tocbot = tocbot;

// highlightjs-line-numbers.js 会自动扩展全局 hljs 对象
// 必须在 hljs 挂载到 window 之后导入
let highlightLineNumbersLoaded = false;
import("highlightjs-line-numbers.js")
  .then(() => {
    highlightLineNumbersLoaded = true;
    // 如果应用已经挂载，立即初始化行号功能
    if (
      document.getElementById("app") &&
      window.hljs &&
      window.hljs.initLineNumbersOnLoad
    ) {
      window.hljs.initLineNumbersOnLoad();
    }
  })
  .catch((err) => {
    console.warn("Failed to load highlightjs-line-numbers.js:", err);
  });

NProgress.configure({ showSpinner: false });
NProgress.configure({ minimum: 0 });
NProgress.configure({ ease: "linear", speed: 100 });

// 初始化 WOW.js（确保在 DOM 加载后执行）
if (typeof window !== "undefined" && window.WOW) {
  // 等待 DOM 加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new window.WOW().init();
    });
  } else {
    // DOM 已经加载完成
    new window.WOW().init();
  }
}

import "./utils/title";
// 引入css
import "./assets/css/index.css";
import "./assets/css/tocbot.css";
import "./assets/css/color.css";
import "./assets/css/markdown-highlight.css";
import "./assets/css/icon.css";
// 图标引入
import "./assets/css/font-awesome.min.css";
// 图片跳动
import "./assets/css/animation.css";
// 樱花
import "./utils/sakura.js";
// 权限
import directive from "./directive";

const app = createApp(App);

// 创建 Pinia 实例并配置持久化插件
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件（注意：Pinia 必须在 Router 之前初始化）
app.use(pinia);

// 初始化 store getter（必须在 pinia 初始化后，router 使用前）
setStoreGetter(useStore);

// 动态导入 router 并初始化应用（确保在 Pinia 初始化后）
import("./router").then(({ default: router }) => {
  app.use(router);
  app.use(directive);

  // 在注册 Element Plus 之后修改组件默认 props
  // 修改 el-dialog 默认点击遮照不关闭
  if (ElDialog && ElDialog.props && ElDialog.props.closeOnClickModal) {
    ElDialog.props.closeOnClickModal.default = false;
  }
  // 修改 el-image 默认预览插入到 body 中
  // 直接修改 props 对象的 default 值
  if (ElImage && ElImage.props) {
    // 如果 previewTeleported 已经存在，直接修改其 default
    if (ElImage.props.previewTeleported) {
      if (typeof ElImage.props.previewTeleported === "object") {
        ElImage.props.previewTeleported.default = true;
      } else {
        // 如果是函数形式，转换为对象形式
        ElImage.props.previewTeleported = {
          type: Boolean,
          default: true,
        };
      }
    } else {
      // 如果不存在，添加该 prop
      ElImage.props.previewTeleported = {
        type: Boolean,
        default: true,
      };
    }
  }

  // 全局关闭 el-popover 的 show-arrow 属性
  if (ElPopover && ElPopover.props && ElPopover.props.showArrow) {
    if (typeof ElPopover.props.showArrow === "object") {
      ElPopover.props.showArrow.default = false;
    } else {
      ElPopover.props.showArrow = {
        type: Boolean,
        default: false,
      };
    }
  }

  // 全局关闭 el-tooltip 的 show-arrow 属性
  if (ElTooltip && ElTooltip.props && ElTooltip.props.showArrow) {
    if (typeof ElTooltip.props.showArrow === "object") {
      ElTooltip.props.showArrow.default = false;
    } else {
      ElTooltip.props.showArrow = {
        type: Boolean,
        default: false,
      };
    }
  }

  // 全局关闭 el-dropdown 的 show-arrow 属性
  if (ElDropdown && ElDropdown.props && ElDropdown.props.showArrow) {
    if (typeof ElDropdown.props.showArrow === "object") {
      ElDropdown.props.showArrow.default = false;
    } else {
      ElDropdown.props.showArrow = {
        type: Boolean,
        default: false,
      };
    }
  }

  // 全局关闭 el-select 的 show-arrow 属性
  // 注意：el-select 的下拉箭头是内置的，不是通过 showArrow prop 控制
  // 如果 ElSelect 有 showArrow prop，则关闭它；否则通过 CSS 隐藏箭头
  if (ElSelect && ElSelect.props && ElSelect.props.showArrow) {
    if (typeof ElSelect.props.showArrow === "object") {
      ElSelect.props.showArrow.default = false;
    } else {
      ElSelect.props.showArrow = {
        type: Boolean,
        default: false,
      };
    }
  }

  // 设置全局属性
  app.config.globalProperties.$common = common;
  app.config.globalProperties.$constant = constant;
  app.config.globalProperties.$confirm = ElMessageBox.confirm;
  app.mount("#app");

  // 应用挂载后，等待 Vue loading 显示，然后隐藏 HTML 的 loading-box
  // 确保两个 loading 无缝衔接，避免闪烁
  nextTick(() => {
    const store = useStore();

    const hideLoadingBox = () => {
      if (window.hideInitialLoading) {
        window.hideInitialLoading();
      }
    };

    // 等待 Vue loading 渲染到 DOM 后再隐藏 HTML loading-box
    // 使用双重 nextTick 确保 Vue loading 已经渲染
    nextTick(() => {
      // 如果 Vue loading 已经显示，等待渲染后隐藏 HTML loading-box
      if (store.isShowLoading) {
        // 等待 Vue loading 完全渲染到 DOM（包括 transition 动画）
        setTimeout(hideLoadingBox, 150);
      } else {
        // 监听 isShowLoading 状态变化，当变为 true 时隐藏 HTML loading-box
        const unwatch = watch(
          () => store.isShowLoading,
          (isShowLoading) => {
            if (isShowLoading) {
              // Vue loading 已显示，等待渲染后隐藏 HTML loading-box
              nextTick(() => {
                setTimeout(() => {
                  hideLoadingBox();
                  unwatch(); // 只执行一次，取消监听
                }, 150);
              });
            }
          }
        );
      }
    });
  });

  // 在应用挂载后初始化行号功能
  // 使用 nextTick 确保 DOM 已渲染
  nextTick(() => {
    if (window.hljs && window.hljs.initLineNumbersOnLoad) {
      window.hljs.initLineNumbersOnLoad();
    } else if (!highlightLineNumbersLoaded) {
      // 如果还未加载完成，等待加载完成后再初始化
      import("highlightjs-line-numbers.js")
        .then(() => {
          if (window.hljs && window.hljs.initLineNumbersOnLoad) {
            window.hljs.initLineNumbersOnLoad();
          }
        })
        .catch(() => {
          // 已经在上面的导入中处理了错误
        });
    }
  });
});
