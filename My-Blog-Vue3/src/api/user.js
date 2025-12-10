import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 用户相关 API ====================

/**
 * 用户登录
 * @param {Object} user - 用户信息 { account, password, province }
 * @returns {Promise} 用户数据
 */
export function login(user) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/appone/login/`, user, false),
    "登录失败！"
  );
}

/**
 * 管理员登录
 * @param {Object} user - 管理员信息
 * @returns {Promise} 管理员数据
 */
export function adminLogin(user) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/user/login/`, user, false),
    "登录失败！"
  );
}

/**
 * 用户注册
 * @param {Object} user - 用户信息 { username, password, email, code, province }
 * @returns {Promise} 注册结果
 */
export function register(user) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/appone/registration/`, user),
    "注册失败！"
  );
}

/**
 * 发送验证码
 * @param {Object} params - 邮箱参数 { email }
 * @returns {Promise} 发送结果
 */
export function sendVerificationCode(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/code/`, params),
    "验证码发送失败！"
  );
}

/**
 * 更新用户信息
 * @param {Object} user - 用户信息
 * @returns {Promise} 更新结果
 */
export function updateUserInfo(user, json = true) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/user/updateUserInfo/`, user, json),
    "更新用户信息失败！"
  );
}

/**
 * 忘记密码更新
 * @param {Object} params - 重置密码参数
 * @returns {Promise} 更新结果
 */
export function updateForForgetPassword(params) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/user/updateForForgetPassword/`,
        params,
        false
      ),
    "重置密码失败！"
  );
}

/**
 * 获取用户列表（简化）
 * @returns {Promise} 用户列表
 */
export function getUserList() {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/user`),
    "获取用户列表失败！"
  );
}

/**
 * 获取用户列表（带分页）
 * @param {Object} pagination - 分页参数
 * @param {boolean} isAdmin - 是否管理员
 * @returns {Promise} 用户列表
 */
export function getUserListPaginated(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/user/list/`, pagination, false),
    "获取用户列表失败！"
  );
}

/**
 * 获取管理员用户列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 用户列表
 */
export function getAdminUserList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/admin/user/list/`, pagination, false),
    "获取用户列表失败！"
  );
}

/**
 * 修改用户状态
 * @param {Object} params - 用户状态参数
 * @returns {Promise} 修改结果
 */
export function changeUserStatus(params) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/admin/user/changeUserStatus/`,
        params,
        false
      ),
    "修改用户状态失败！"
  );
}

/**
 * 修改用户敬仰值
 * @param {Object} params - 敬仰值参数
 * @returns {Promise} 修改结果
 */
export function changeUserAdmire(params) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/admin/user/changeUserAdmire/`,
        params,
        false
      ),
    "修改敬仰值失败！"
  );
}

/**
 * 修改用户类型
 * @param {Object} params - 用户类型参数
 * @returns {Promise} 修改结果
 */
export function changeUserType(params) {
  return apiWrapper(
    () =>
      http.post(
        `${constant.baseURL}/admin/user/changeUserType/`,
        params,
        false
      ),
    "修改用户类型失败！"
  );
}

export default {
  login,
  adminLogin,
  register,
  sendVerificationCode,
  updateUserInfo,
  updateForForgetPassword,
  getUserList,
  getUserListPaginated,
  getAdminUserList,
  changeUserStatus,
  changeUserAdmire,
  changeUserType,
};
