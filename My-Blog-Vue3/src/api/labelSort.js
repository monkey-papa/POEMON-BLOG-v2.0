import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 分类标签相关 API ====================

/**
 * 删除分类
 * @param {number} id - 分类ID
 * @returns {Promise} 删除结果
 */
export function deleteSort(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/deleteSort/`, { id }),
    "删除分类失败！"
  );
}

/**
 * 删除标签
 * @param {number} id - 标签ID
 * @returns {Promise} 删除结果
 */
export function deleteLabel(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/deleteLabel/`, { id }),
    "删除标签失败！"
  );
}

/**
 * 保存分类
 * @param {Object} sort - 分类数据
 * @returns {Promise} 保存结果
 */
export function saveSort(sort) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/saveSort/`, sort),
    "保存分类失败！"
  );
}

/**
 * 更新分类
 * @param {Object} sort - 分类数据
 * @returns {Promise} 更新结果
 */
export function updateSort(sort) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/updateSort/`, sort),
    "更新分类失败！"
  );
}

/**
 * 保存标签
 * @param {Object} label - 标签数据
 * @returns {Promise} 保存结果
 */
export function saveLabel(label) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/saveLabel/`, label),
    "保存标签失败！"
  );
}

/**
 * 更新标签
 * @param {Object} label - 标签数据
 * @returns {Promise} 更新结果
 */
export function updateLabel(label) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/updateLabel/`, label),
    "更新标签失败！"
  );
}

export default {
  deleteSort,
  deleteLabel,
  saveSort,
  updateSort,
  saveLabel,
  updateLabel,
};
