import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 其他 API ====================

/**
 * 发送代码评论（邮件通知）
 * @param {Object} params - {email, comment, name, type}
 * @returns {Promise} 发送结果
 */
export function sendCodeComment(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/codeComment/`, params),
    "发送通知失败！"
  );
}

/**
 * 获取IP信息
 * @returns {Promise} IP信息
 */
export function getIpInfo() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/list/ip/`),
    "获取IP信息失败！"
  );
}

/**
 * 提交地区信息
 * @param {Object} params - {province, city, userId}
 * @returns {Promise} 提交结果
 */
export function submitLocation(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/submit/`, params),
    "提交地区信息失败！"
  );
}

/**
 * 获取地图数据
 * @returns {Promise} 地图数据
 */
export function getMap() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/map`),
    "获取地图数据失败！"
  );
}

/**
 * 获取 IP 信息
 * @returns {Promise} IP 信息
 */
export function getIpAddress() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/ip/`),
    "获取 IP 信息失败！"
  );
}

export default {
  sendCodeComment,
  getIpInfo,
  submitLocation,
  getMap,
  getIpAddress,
};
