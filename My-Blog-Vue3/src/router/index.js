import { createRouter, createWebHistory } from "vue-router";
import {
  startRouteNavigation,
  endRouteNavigation,
  initLoading,
} from "../utils/request";
import { useStore } from "../stores";

// 延迟获取 store 实例，避免在 Pinia 初始化前访问
let storeInstance = null;
const getStore = () => {
  if (!storeInstance) {
    storeInstance = useStore();
  }
  return storeInstance;
};

const routes = [
  {
    path: "/",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/",
        name: "index",
        component: () => import("../views/index.vue"),
      },
      {
        path: "/sort",
        name: "sort",
        component: () => import("../views/sort.vue"),
      },
      {
        path: "/tags",
        name: "tags",
        component: () => import("../views/tags.vue"),
      },
      {
        path: "/map",
        name: "map",
        component: () => import("../views/map.vue"),
      },
      {
        path: "/article",
        name: "article",
        component: () => import("../views/article.vue"),
      },
      {
        path: "/weiYan",
        name: "weiYan",
        component: () => import("../views/weiYan.vue"),
      },
      {
        path: "/love",
        name: "love",
        component: () => import("../views/love.vue"),
      },
      {
        path: "/travel",
        name: "travel",
        component: () => import("../views/travel.vue"),
      },
      {
        path: "/tools",
        name: "tools",
        component: () => import("../views/tools.vue"),
      },
      {
        path: "/message",
        name: "message",
        component: () => import("../views/message.vue"),
      },
      {
        path: "/friend",
        name: "friend",
        component: () => import("../views/friend.vue"),
      },
      {
        path: "/funny",
        name: "funny",
        component: () => import("../views/funny.vue"),
      },
      {
        path: "/about",
        name: "about",
        component: () => import("../views/about.vue"),
      },
      {
        path: "/user",
        name: "user",
        component: () => import("../views/user.vue"),
      },
    ],
  },
  {
    path: "/backend",
    redirect: "/backendMain",
    meta: { requiresAuth: true },
    component: () => import("../views/admin/admin.vue"),
    children: [
      {
        path: "/backendMain",
        name: "main",
        component: () => import("../views/admin/main.vue"),
      },
      {
        path: "/webEdit",
        name: "webEdit",
        component: () => import("../views/admin/webEdit.vue"),
      },
      {
        path: "/userList",
        name: "userList",
        component: () => import("../views/admin/userList.vue"),
      },
      {
        path: "/postList",
        name: "postList",
        component: () => import("../views/admin/postList.vue"),
      },
      {
        path: "/postEdit",
        name: "postEdit",
        component: () => import("../views/admin/postEdit.vue"),
      },
      {
        path: "/sortList",
        name: "sortList",
        component: () => import("../views/admin/sortList.vue"),
      },
      {
        path: "/weiYanList",
        name: "weiYanList",
        component: () => import("../views/admin/weiYanList.vue"),
      },
      {
        path: "/progressList",
        name: "progressList",
        component: () => import("../views/admin/progressList.vue"),
      },
      {
        path: "/commentList",
        name: "commentList",
        component: () => import("../views/admin/commentList.vue"),
      },
      {
        path: "/treeHoleList",
        name: "treeHoleList",
        component: () => import("../views/admin/treeHoleList.vue"),
      },
      {
        path: "/resourceList",
        name: "resourceList",
        component: () => import("../views/admin/resourceList.vue"),
      },
      {
        path: "/loveList",
        name: "loveList",
        component: () => import("../views/admin/loveList.vue"),
      },
      {
        path: "/resourcePathList",
        name: "resourcePathList",
        component: () => import("../views/admin/resourcePathList.vue"),
      },
      {
        path: "/prohibitedWordsList",
        name: "prohibitedWordsList",
        component: () => import("../views/admin/prohibitedWordsList.vue"),
      },
    ],
  },
  {
    path: "/verifyLogin",
    name: "verify",
    component: () => import("../views/admin/verify.vue"),
  },
];

// 如果是访客剔除后台用户列表路由（延迟检查）
const filterVisitorRoutes = () => {
  try {
    const mainStore = getStore();
    if (mainStore.currentAdmin.userType === 3) {
      routes[1].children = routes[1].children.filter(
        (item) => item.name != "userList"
      );
    }
  } catch {
    // store 尚未初始化，忽略
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();

  // 首次路由时过滤访客路由
  filterVisitorRoutes();

  // 如果是首次加载（刷新页面），初始化 loading 状态
  const isInitialLoad = from.name === null || from.name === undefined;
  if (isInitialLoad) {
    initLoading();
  } else {
    // 路由跳转时，开始路由导航，打开 loading
    startRouteNavigation();
  }

  const mainStore = getStore();

  // 如果已登录用户访问后台登录页面，自动跳转到后台首页
  if (to.path === "/verifyLogin") {
    if (mainStore.currentAdmin.accessToken) {
      next({ path: "/backendMain" });
      return;
    }
  }

  // 后台页面跳转的判断
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!mainStore.currentAdmin.accessToken) {
      next({
        path: "/verifyLogin",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    // 对于非需要认证的页面，直接放行
    // 如果未登录用户访问 /user 页面，仅在没有 redirect 参数时添加
    if (
      to.path === "/user" &&
      !mainStore.currentUser.accessToken &&
      !to.query.redirect &&
      from.path !== "/" &&
      from.path !== "/user"
    ) {
      next({
        path: "/user",
        query: { redirect: from.fullPath },
        replace: true, // 使用 replace 避免产生多余的历史记录
      });
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  // 完成进度条
  NProgress.done();

  // 等待所有路由跳转时的请求完成后再关闭 loading
  endRouteNavigation();
});
export default router;
