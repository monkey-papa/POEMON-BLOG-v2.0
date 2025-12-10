import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 收藏夹相关 API ====================

/**
 * 获取收藏夹列表
 * @returns {Promise} 收藏夹列表
 */
export function getCollectList() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/listCollect/`),
    "获取收藏夹失败！"
  );
}

export default {
  // 收藏夹
  getCollectList,
};
