import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 资源相关 API ====================

/**
 * 获取资源列表
 * @param {Object} pagination - 分页参数
 * @param {boolean} isAdmin - 是否管理员
 * @returns {Promise} 资源列表
 */
export function getResourceList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/resource/listResource/`, pagination),
    "获取资源列表失败！"
  );
}

/**
 * 修改资源状态
 * @param {Object} params - 状态参数
 * @returns {Promise} 更新结果
 */
export function changeResourceStatus(params) {
  return apiWrapper(
    () =>
      http.get(`${constant.baseURL}/resource/changeResourceStatus/`, params),
    "修改状态失败！"
  );
}

/**
 * 删除文章图片
 * @param {Object} params - 删除参数
 * @returns {Promise} 删除结果
 */
export function deleteArticleImage(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/delArticleImage/`, params),
    "删除图片失败！"
  );
}

/**
 * 获取资源路径列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 资源列表
 */
export function getResourcePathList(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/listResourcePath/`, params),
    "获取资源列表失败！"
  );
}

/**
 * 获取娱乐列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 娱乐列表
 */
export function getClientResourcePathList(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/clistResourcePath/`, params),
    "获取娱乐列表失败！"
  );
}

/**
 * 保存资源路径
 * @param {Object} resource - 资源数据
 * @param {boolean} isUpdate - 是否为更新操作
 * @returns {Promise} 保存结果
 */
export function saveResourcePath(resource, isUpdate = false) {
  const url = isUpdate
    ? `${constant.baseURL}/webInfo/updateResourcePath/`
    : `${constant.baseURL}/webInfo/saveResourcePath/`;

  return apiWrapper(
    () => http.post(url, resource),
    `${isUpdate ? "更新" : "保存"}资源失败！`
  );
}

/**
 * 删除资源路径
 * @param {number} id - 资源ID
 * @returns {Promise} 删除结果
 */
export function deleteResourcePath(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/deleteResourcePath/`, { id }),
    "删除资源失败！"
  );
}

/**
 * 保存资源（通用）
 * @param {Object} resource - 资源数据 { type, path, size, mimeType, id }
 * @param {boolean} isAdmin - 是否管理员
 * @returns {Promise} 保存结果
 */
export function saveResource(resource) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/resource/saveResource/`, resource),
    "保存资源失败！"
  );
}

export default {
  getResourceList,
  changeResourceStatus,
  deleteArticleImage,
  getResourcePathList,
  getClientResourcePathList,
  saveResourcePath,
  deleteResourcePath,
  saveResource,
};
