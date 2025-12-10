import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 表白墙相关 API ====================

/**
 * 获取管理员表白墙信息
 * @returns {Promise} 表白墙信息
 */
export function getAdminFamily() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/family/getAdminFamily/`),
    "获取表白墙信息失败！"
  );
}

/**
 * 获取随机表白墙列表
 * @returns {Promise} 表白墙列表
 */
export function getRandomFamilyList() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/family/listRandomFamily/`),
    "获取表白墙列表失败！"
  );
}

/**
 * 添加表白墙
 * @param {Object} family - 表白墙数据
 * @returns {Promise} 添加结果
 */
export function addFamily(family) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/family/addFamily/`, family),
    "提交失败！"
  );
}

/**
 * 获取表白墙列表（管理员）
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 表白墙列表
 */
export function listFamily(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/family/listFamily/`, pagination),
    "获取表白墙列表失败！"
  );
}

/**
 * 删除表白墙
 * @param {number} id - 表白墙ID
 * @returns {Promise} 删除结果
 */
export function deleteFamily(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/family/deleteFamily/`, { id }),
    "删除表白墙失败！"
  );
}

/**
 * 修改表白墙状态
 * @param {Object} params - {id, flag}
 * @returns {Promise} 修改结果
 */
export function changeLoveStatus(params) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/family/changeLoveStatus/`, params),
    "修改状态失败！"
  );
}

export default {
  getAdminFamily,
  getRandomFamilyList,
  addFamily,
  listFamily,
  deleteFamily,
  changeLoveStatus,
};
