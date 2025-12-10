import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/stores";
import { getCurrentInstance } from "vue";

/**
 * 统一获取全局属性和常用实例的 composable
 * 避免在每个组件中重复导入和获取
 * @returns {Object} 包含 router, route, store 和所有全局属性的对象
 */
export function useGlobalProperties() {
  const router = useRouter();
  const route = useRoute();
  const store = useStore();
  const instance = getCurrentInstance();

  // 获取全局属性
  const globalProperties = instance?.appContext.config.globalProperties || {};

  // 返回全局属性
  return {
    $router: router,
    $route: route,
    $store: store,
    $common: globalProperties.$common,
    $constant: globalProperties.$constant,
    $confirm: globalProperties.$confirm,
  };
}
