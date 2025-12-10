import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 文章相关 API ====================

/**
 * 获取文章列表
 * @param {Object} params - 分页参数 { current, size, sortId, labelId }
 * @returns {Promise} 文章列表
 */
export function getArticleList(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/article/listArticle`, params),
    "获取文章列表失败！"
  );
}

/**
 * 获取文章详情
 * @param {Object} params - { id, flag, userId }
 * @returns {Promise} 文章详情
 */
export function getArticleById(params) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/article/getArticleById/`, params),
    "获取文章详情失败！"
  );
}

/**
 * 文章点赞
 * @param {Object} data - { userId, articleLikeStatus, id }
 * @returns {Promise} 点赞结果
 */
export function articleLike(data) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/article/articleLike/`, data),
    "点赞失败！"
  );
}

/**
 * 保存文章
 * @param {Object} article - 文章数据
 * @returns {Promise} 保存结果
 */
export function saveArticle(article) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/article/saveArticle/`, article),
    "保存文章失败！"
  );
}

/**
 * 更新文章
 * @param {Object} article - 文章数据
 * @returns {Promise} 更新结果
 */
export function updateArticle(article) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/article/updateArticle/`, article),
    "更新文章失败！"
  );
}

/**
 * 删除文章
 * @param {number} id - 文章ID
 * @returns {Promise} 删除结果
 */
export function deleteArticle(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/article/deleteArticle/`, { id }),
    "删除文章失败！"
  );
}

/**
 * 获取管理员文章列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 文章列表
 */
export function getAdminArticleList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/admin/article/boss/list/`, pagination),
    "获取文章列表失败！"
  );
}

/**
 * 获取管理员文章详情
 * @param {number} id - 文章ID
 * @returns {Promise} 文章详情
 */
export function getAdminArticleById(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/admin/article/getArticleById/`, { id }),
    "获取文章详情失败！"
  );
}

/**
 * 修改文章状态
 * @param {Object} param - 状态参数
 * @returns {Promise} 更新结果
 */
export function changeArticleStatus(param) {
  return apiWrapper(
    () =>
      http.get(`${constant.baseURL}/admin/article/changeArticleStatus/`, param),
    "修改状态失败！"
  );
}

/**
 * 生成文章摘要
 * @param {Object} data - { message, articleId }
 * @returns {Promise} 摘要结果
 */
export function generateSummary(data) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/summary`, data),
    "生成摘要失败！"
  );
}

export default {
  getArticleList,
  getArticleById,
  articleLike,
  saveArticle,
  updateArticle,
  deleteArticle,
  getAdminArticleList,
  getAdminArticleById,
  changeArticleStatus,
  generateSummary,
};
