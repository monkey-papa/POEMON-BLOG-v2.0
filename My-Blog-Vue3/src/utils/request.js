import axios from "axios";
import constant from "./constant";
// 处理url参数
import qs from "qs";

// 延迟获取 store 实例，避免在 Pinia 初始化前访问
let storeInstance = null;
let useStoreFn = null;

// 初始化 store 引用（在 main.js 中调用）
export const setStoreGetter = (fn) => {
  useStoreFn = fn;
};

const getStore = () => {
  if (!storeInstance && useStoreFn) {
    storeInstance = useStoreFn();
  }
  return storeInstance;
};

// 请求计数器，用于管理 loading 状态
let loadingCount = 0;
// 最小显示时间（毫秒），避免 loading 闪烁
const MIN_LOADING_TIME = 300;

let loadingStartTime = 0;
let loadingTimer = null;

// 路由跳转标志，用于区分路由跳转时的请求和业务操作时的请求
let isRouteNavigation = false;
// 路由跳转 ID，用于跟踪当前路由跳转，避免旧的检查影响新的路由
let routeNavigationId = 0;

/**
 * 开始 loading（只在路由跳转时调用）
 */
const startLoading = () => {
  // 只有路由跳转时的请求才计入 loading
  if (!isRouteNavigation) {
    return;
  }

  loadingCount++;
  // 如果是第一个请求，开始显示 loading 并记录开始时间
  if (loadingCount === 1) {
    const mainStore = getStore();
    // 如果 loading 已经显示（首次加载时），只记录开始时间
    if (!mainStore.isShowLoading) {
      mainStore.setShowLoading(true);
    }
    // 记录开始时间（如果还没有记录）
    if (loadingStartTime === 0) {
      loadingStartTime = Date.now();
    }
  }
};

/**
 * 结束 loading（只在路由跳转时调用，只负责计数，不关闭 loading）
 */
const endLoading = () => {
  // 只有路由跳转时的请求才计入 loading
  if (!isRouteNavigation) {
    return;
  }

  // 只减少计数，不关闭 loading
  // loading 的关闭由 endRouteNavigation() 统一处理
  loadingCount = Math.max(loadingCount - 1, 0);
};

/**
 * 开始路由跳转（在路由守卫中调用）
 */
export const startRouteNavigation = () => {
  // 清除可能存在的定时器
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  // 生成新的路由跳转 ID，用于跟踪当前路由跳转
  routeNavigationId++;
  // 重置计数器
  loadingCount = 0;
  // 设置路由跳转标志
  isRouteNavigation = true;
  // 记录开始时间
  loadingStartTime = Date.now();
  // 显示 loading
  getStore().setShowLoading(true);
};

/**
 * 结束路由跳转（在路由 afterEach 中调用，等待所有请求完成）
 */
export const endRouteNavigation = () => {
  // 如果没有路由跳转标志，直接返回，避免误操作
  if (!isRouteNavigation) {
    return;
  }

  // 保存当前路由跳转 ID，用于检查是否仍然是当前路由跳转
  const currentNavigationId = routeNavigationId;

  // 清除可能存在的旧定时器
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }

  // 等待所有请求完成后再关闭 loading
  const checkAndClose = () => {
    // 检查是否仍然是当前路由跳转，如果不是，说明已经有新的路由跳转，直接返回
    if (currentNavigationId !== routeNavigationId) {
      return;
    }

    // 再次检查路由跳转标志，防止在检查过程中被重置
    if (!isRouteNavigation) {
      return;
    }

    if (loadingCount === 0) {
      // 没有请求，可以关闭 loading
      const elapsed = Date.now() - loadingStartTime;
      const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);

      if (remaining > 0) {
        // 需要等待最小显示时间
        loadingTimer = setTimeout(() => {
          // 再次检查状态，确保在定时器执行时仍然是当前路由跳转
          if (
            currentNavigationId === routeNavigationId &&
            isRouteNavigation &&
            loadingCount === 0
          ) {
            getStore().setShowLoading(false);
            loadingTimer = null;
            loadingStartTime = 0;
            isRouteNavigation = false;
          }
        }, remaining);
      } else {
        // 已经满足最小显示时间，立即关闭
        if (
          currentNavigationId === routeNavigationId &&
          isRouteNavigation &&
          loadingCount === 0
        ) {
          getStore().setShowLoading(false);
          loadingStartTime = 0;
          isRouteNavigation = false;
        }
      }
    } else {
      // 如果还有请求在进行，继续等待
      // 但设置最大等待时间（10秒），避免无限等待
      const maxWaitTime = 10000;
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed < maxWaitTime) {
        setTimeout(checkAndClose, 50);
      } else {
        // 超时，强制关闭（但只关闭当前路由跳转的 loading）
        if (currentNavigationId === routeNavigationId) {
          console.warn("Loading timeout, force close");
          getStore().setShowLoading(false);
          loadingTimer = null;
          loadingStartTime = 0;
          isRouteNavigation = false;
        }
      }
    }
  };

  // 延迟检查，确保所有在路由跳转时发起的请求都被捕获
  // 给组件挂载和请求发起留出时间（150ms 足够组件 mounted 执行）
  setTimeout(checkAndClose, 150);
};

/**
 * 初始化 loading 状态（首次加载时调用）
 */
export const initLoading = () => {
  // 重置所有状态
  loadingCount = 0;
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  // 设置路由跳转标志（首次加载也算路由跳转）
  isRouteNavigation = true;
  // 首次加载时，立即显示 loading 并记录开始时间
  loadingStartTime = Date.now();
  getStore().setShowLoading(true);
};

axios.defaults.baseURL = constant.baseURL;
// 设置默认超时时间，避免在慢速网络下请求过早失败
axios.defaults.timeout = 30000; // 30秒

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    startLoading();
    return config;
  },
  function (error) {
    endLoading();
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    endLoading();
    if (
      response.data !== null &&
      Object.prototype.hasOwnProperty.call(response.data, "code") &&
      response.data.code !== 200
    ) {
      if (response.data.code === 300) {
        const mainStore = getStore();
        mainStore.loadCurrentUser({});
        mainStore.loadCurrentAdmin({});
        // 使用相对路径跳转到前端的 /user 页面，而不是后端 URL
        window.location.href = "/user";
      }
      return Promise.reject(new Error(response.data.message));
    } else {
      return response;
    }
  },
  function (error) {
    endLoading();
    return Promise.reject(error);
  }
);
/**
 * 判断当前是否在后台管理页面
 * 使用 window.location.pathname 而不是 router.currentRoute.value
 * 因为 window.location 是浏览器原生 API，始终反映真实 URL
 * 不受 Vue Router 响应式机制和 Vite 热更新的影响
 */
const isAdminPage = () => {
  const pathname = window.location.pathname;
  // 后台管理页面的路径特征
  const adminPaths = [
    "/backendMain",
    "/webEdit",
    "/userList",
    "/postList",
    "/postEdit",
    "/sortList",
    "/weiYanList",
    "/progressList",
    "/commentList",
    "/treeHoleList",
    "/resourceList",
    "/loveList",
    "/resourcePathList",
    "/prohibitedWordsList",
  ];
  return adminPaths.some((path) => pathname.startsWith(path));
};

/**
 * 获取请求头配置
 * 根据当前页面自动选择使用管理员 token 还是普通用户 token
 */
const getAuthConfig = () => {
  const mainStore = getStore();
  const isAdmin = isAdminPage();
  const token = isAdmin
    ? mainStore.currentAdmin.accessToken
    : mainStore.currentUser.accessToken;

  return {
    headers: {
      Authorization: token ? "Token " + token : "",
    },
  };
};

export default {
  post(url, params = {}, json = true) {
    const config = getAuthConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(url, json ? params : qs.stringify(params), config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get(url, params = {}) {
    const { headers } = getAuthConfig();
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params,
          headers,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  uploadQiniu(url, param) {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    };
    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
