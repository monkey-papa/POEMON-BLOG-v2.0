import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 违禁词相关 API ====================

/**
 * 获取违禁词列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 违禁词列表
 */
export function getProhibitedWordsList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/prohibitedWords/list/`, pagination),
    "获取违禁词列表失败！"
  );
}

/**
 * 添加违禁词
 * @param {Object} word - 违禁词数据
 * @returns {Promise} 添加结果
 */
export function addProhibitedWord(word) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/prohibitedWords/add/`, word),
    "添加违禁词失败！"
  );
}

/**
 * 更新违禁词
 * @param {Object} word - 违禁词数据
 * @returns {Promise} 更新结果
 */
export function updateProhibitedWord(word) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/prohibitedWords/update/`, word),
    "更新违禁词失败！"
  );
}

/**
 * 删除违禁词
 * @param {number} id - 违禁词ID
 * @returns {Promise} 删除结果
 */
export function deleteProhibitedWord(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/prohibitedWords/delete/`, { id }),
    "删除违禁词失败！"
  );
}

export default {
  getProhibitedWordsList,
  addProhibitedWord,
  updateProhibitedWord,
  deleteProhibitedWord,
};
