import { notifyError, notifyWarning } from "../utils/notify";

/**
 * 表单验证工具 composable
 * 提供常用的表单验证逻辑，减少重复代码
 */

/**
 * 验证必填字段
 * @param {object} fields - 字段对象，格式为 { fieldValue: 'fieldName' }
 * @param {string} message - 自定义错误消息
 * @returns {boolean} 验证是否通过
 */
export function validateRequired(fields, message) {
  for (const [value, name] of Object.entries(fields)) {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      notifyError(message || `${name}不能为空！`);
      return false;
    }
  }
  return true;
}

/**
 * 验证必填字段
 * @param {object} fields - 字段对象，格式为 { fieldValue: 'fieldName' }
 * @param {string} customMessage - 自定义警告消息
 * @returns {boolean} 验证是否通过
 */
export function validateRequiredWarn(fields, customMessage) {
  for (const [value, name] of Object.entries(fields)) {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      notifyWarning(customMessage || `你还没${name}呢~`);
      return false;
    }
  }
  return true;
}

/**
 * 验证字段不包含空格
 * @param {object} fields - 字段对象，格式为 { fieldValue: 'fieldName' }
 * @returns {boolean} 验证是否通过
 */
export function validateNoSpaces(fields) {
  for (const [value, name] of Object.entries(fields)) {
    if (typeof value === "string" && value.indexOf(" ") !== -1) {
      notifyError(`${name}不能包含空格！`);
      return false;
    }
  }
  return true;
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 验证是否通过
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    notifyError("邮箱格式不正确！");
    return false;
  }
  return true;
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 验证是否通过
 */
export function validatePhone(phone) {
  if (!phone) return true; // 允许为空，由 validateRequired 处理
  if (!/^1[345789]\d{9}$/.test(phone)) {
    notifyError("手机号格式有误！");
    return false;
  }
  return true;
}

/**
 * 验证 URL 格式（必须以 http 或 https 开头）
 * @param {string} url - URL 地址
 * @param {string} message - 自定义错误消息
 * @returns {boolean} 验证是否通过
 */
export function validateUrl(url, message) {
  if (!url || !url.includes("http")) {
    notifyError(message || "请填写以http或https开头的有效地址！");
    return false;
  }
  return true;
}

/**
 * 验证是否已登录
 * @param {object} currentUser - 当前用户对象
 * @param {Function} isEmpty - isEmpty 检查函数
 * @returns {boolean} 是否已登录
 */
export function validateLogin(currentUser, isEmpty) {
  if (isEmpty(currentUser?.accessToken)) {
    notifyError("请先登录！");
    return false;
  }
  return true;
}

/**
 * 使用表单验证 composable
 * 提供统一的验证方法和状态管理
 */
export function useFormValidation() {
  return {
    validateRequired,
    validateRequiredWarn,
    validateNoSpaces,
    validateEmail,
    validatePhone,
    validateUrl,
    validateLogin,
  };
}

export default useFormValidation;
