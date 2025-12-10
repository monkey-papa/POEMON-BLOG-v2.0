import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    toolbar: {
      visible: false,
      enter: true,
    },
    sortInfo: [],
    currentUser: {},
    currentAdmin: {},
    webInfo: {
      webName: "",
      webTitle: [],
      notices: [],
      footer: "",
      backgroundImage: "",
      avatar: "",
      randomCover: [],
    },
    changeBg: "url(https://your-qiniu-domain/webBackgroundImage/changeBg3)",
    isShowLoading: true, // 初始化为 true，避免首次加载时闪烁
    top: 0,
    pageView: {},
    newArticles: [],
    articleTotal: 0,
    userList: [],
  }),

  getters: {
    // 访客禁用按钮权限
    permissions: (state) => {
      return state.currentAdmin.userType === 3 ? [] : ["user:visit:read"];
    },

    // 文章总数
    totalArticles: (state) => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        if (state.sortInfo.length === 1) {
          return state.sortInfo[0].countOfSort;
        } else {
          return state.sortInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.countOfSort;
            } else {
              return prev.countOfSort + curr.countOfSort;
            }
          });
        }
      } else {
        return 0;
      }
    },

    // 导航栏
    navigationBar: (state) => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        return state.sortInfo.filter((f) => f.sortType === 0);
      } else {
        return [];
      }
    },

    // 标签信息
    labelInfo: (state) => {
      let labels = [];
      for (let index = 0; index < state.sortInfo.length; index++) {
        labels = labels.concat(state.sortInfo[index].labels);
      }
      return labels;
    },
  },

  actions: {
    // 设置用户列表
    setUserList(userList) {
      this.userList = userList;
    },

    // 设置文章总数
    setArticleTotal(articleTotal) {
      this.articleTotal = articleTotal;
    },

    // 设置最新文章
    setNewArticles(newArticles) {
      this.newArticles = newArticles;
    },

    // 设置页面浏览量
    setPageView(pageView) {
      this.pageView = pageView;
    },

    // 改变工具栏状态
    changeToolbarStatus(toolbarState) {
      this.toolbar = toolbarState;
    },

    // 加载分类信息
    loadSortInfo(sortInfo) {
      if (sortInfo !== null && sortInfo.length !== 0) {
        this.sortInfo = sortInfo.sort((s1, s2) => s1.priority - s2.priority);
      }
    },

    // 加载当前用户
    loadCurrentUser(user) {
      this.currentUser = user;
    },

    // 加载当前管理员
    loadCurrentAdmin(user) {
      this.currentAdmin = user;
    },

    // 加载网站信息
    loadWebInfo(webInfo) {
      webInfo.webTitle = webInfo.webTitle.split("");
      webInfo.notices = JSON.parse(webInfo.notices);
      webInfo.randomCover = JSON.parse(webInfo.randomCover);
      this.webInfo = webInfo;
    },

    // 改变背景
    changeBgBox(changeBg) {
      this.changeBg = changeBg;
    },

    // 设置 loading 状态
    setShowLoading(data) {
      this.isShowLoading = data;
    },

    // 设置滚动百分比
    setTopPercentage(top) {
      this.top = top;
    },
  },

  // 持久化配置
  persist: {
    key: "main",
    storage: localStorage,
    // 排除不需要持久化的状态
    paths: [
      "toolbar",
      "sortInfo",
      "currentUser",
      "currentAdmin",
      "webInfo",
      "changeBg",
      // "isShowLoading", // 排除，每次刷新都应该显示 loading
      "top",
      "pageView",
      "newArticles",
      "articleTotal",
      "userList",
    ],
  },
});
