import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 评论相关 API ====================

/**
 * 获取评论列表
 * @param {Object} params - 分页参数 { current, size, source, type }
 * @returns {Promise} 评论列表
 */
export function getCommentList(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/comment/listComment/`, params),
    "获取评论列表失败！"
  );
}

/**
 * 获取管理员评论列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 评论列表
 */
export function getBossCommentList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/admin/comment/boss/list/`, pagination),
    "获取评论列表失败！"
  );
}

/**
 * 管理员添加评论
 * @param {Object} comment - 评论数据
 * @returns {Promise} 添加结果
 */
export function bossAddComment(comment) {
  return apiWrapper(
    () =>
      http.post(`${constant.baseURL}/admin/comment/boss/addComment/`, comment),
    "添加评论失败！"
  );
}

/**
 * 管理员删除评论
 * @param {number} id - 评论ID
 * @returns {Promise} 删除结果
 */
export function bossDeleteComment(id) {
  return apiWrapper(
    () =>
      http.get(`${constant.baseURL}/admin/comment/boss/deleteComment/`, { id }),
    "删除评论失败！"
  );
}

export default {
  getCommentList,
  getBossCommentList,
  bossAddComment,
  bossDeleteComment,
};
