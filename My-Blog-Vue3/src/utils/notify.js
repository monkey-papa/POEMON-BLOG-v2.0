import { ElNotification } from 'element-plus'

/**
 * 通知提示工具函数
 * 统一管理项目中的通知消息，提供简洁的 API
 */

const defaultOptions = {
  position: 'top-left',
  offset: 50,
  duration: 3000
}

/**
 * 成功提示
 * @param {string} message - 提示消息
 * @param {string} title - 提示标题，默认为 "成功 🍨"
 * @param {object} options - 其他配置选项
 */
export function notifySuccess(message, title = '可以啦🍨', options = {}) {
  return ElNotification({
    type: 'success',
    title,
    message,
    ...defaultOptions,
    ...options
  })
}

/**
 * 错误提示
 * @param {string} message - 提示消息
 * @param {string} title - 提示标题，默认为 "可恶🤬"
 * @param {object} options - 其他配置选项
 */
export function notifyError(message, title = '可恶🤬', options = {}) {
  return ElNotification({
    type: 'error',
    title,
    message,
    ...defaultOptions,
    ...options
  })
}

/**
 * 警告提示
 * @param {string} message - 提示消息
 * @param {string} title - 提示标题，默认为 "淘气👻"
 * @param {object} options - 其他配置选项
 */
export function notifyWarning(message, title = '淘气👻', options = {}) {
  return ElNotification({
    type: 'warning',
    title,
    message,
    ...defaultOptions,
    ...options
  })
}

/**
 * 信息提示
 * @param {string} message - 提示消息
 * @param {string} title - 提示标题
 * @param {object} options - 其他配置选项
 */
export function notifyInfo(message, title = '提示', options = {}) {
  return ElNotification({
    type: 'info',
    title,
    message,
    ...defaultOptions,
    ...options
  })
}

// 默认导出所有通知函数
export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo
}

