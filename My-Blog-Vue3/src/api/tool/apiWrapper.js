import { notifyError } from "../../utils/notify";

/**
 * API 请求封装
 * 统一管理所有 API 调用，提供类型安全和错误处理
 */

/**
 * 通用 API 请求包装器
 * @param {Function} requestFn - 请求函数
 * @param {string} errorMessage - 自定义错误消息
 * @returns {Promise} API 响应数据
 */
export default async function apiWrapper(
  requestFn,
  errorMessage = "请求失败！"
) {
  try {
    const response = await requestFn();
    return response;
  } catch (error) {
    notifyError(errorMessage || error.message);
    throw error;
  }
}
