import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 网站信息相关 API ====================

/**
 * 获取网站信息
 * @returns {Promise} 网站信息
 */
export function getWebInfo() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/getWebInfo`),
    "获取网站信息失败！"
  );
}

/**
 * 获取分类列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 分类列表
 */
export function getClassifyList(params = {}) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/getClassifyList/`, params),
    "获取分类列表失败！"
  );
}

/**
 * 获取排序信息
 * @returns {Promise} 排序信息
 */
export function getSortInfo() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/getSortInfo/`),
    "获取分类信息失败！"
  );
}

/**
 * 获取排序和标签列表
 * @returns {Promise} 排序和标签
 */
export function getSortAndLabelList() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/listSortAndLabel/`, {}),
    "获取分类标签失败！"
  );
}

/**
 * 获取所有网站背景图片
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 背景图片列表
 */
export function getAllWebBackgroundImages(pagination) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/webInfo/allWebBackgroundImage/`,
        pagination
      ),
    "获取背景图片失败！"
  );
}

/**
 * 获取管理员网站信息
 * @returns {Promise} 网站信息
 */
export function getAdminWebInfo() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/admin/webInfo/getAdminWebInfo/`, {}),
    "获取网站信息失败！"
  );
}

/**
 * 更新管理员网站信息
 * @param {Object} params - 网站信息
 * @returns {Promise} 更新结果
 */
export function updateAdminWebInfo(params) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/admin/webInfo/updateAdminWebInfo/`,
        params,
        false
      ),
    "更新网站信息失败！"
  );
}

export default {
  getWebInfo,
  getClassifyList,
  getSortInfo,
  getSortAndLabelList,
  getAllWebBackgroundImages,
  getAdminWebInfo,
  updateAdminWebInfo,
};
