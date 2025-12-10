import http from "../utils/request";
import constant from "../utils/constant";
import apiWrapper from "./tool/apiWrapper";

// ==================== 微言/树洞相关 API ====================

/**
 * 获取微言列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 微言列表
 */
export function getWeiYanList(pagination) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/weiYan/listWeiYan/`, pagination),
    "获取微言列表失败！"
  );
}

/**
 * 修改微言是否可见
 * @param {number} id - 微言ID
 * @param {boolean} isPublic - 是否可见
 * @returns {Promise} 修改结果
 */
export function changeWeiYanIsPublic(id, isPublic) {
  return apiWrapper(
    () =>
      http.post(`${constant.baseURL}/weiYan/changepublic/`, {
        id,
        isPublic,
      }),
    "修改微言是否可见失败！"
  );
}

/**
 * 保存进展
 * @param {Object} weiYan - 进展数据
 * @returns {Promise} 保存结果
 */
export function saveNews(weiYan) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/weiYan/saveNews/`, weiYan),
    "添加进展失败！"
  );
}

/**
 * 删除微言
 * @param {number} id - 微言ID
 * @returns {Promise} 删除结果
 */
export function deleteWeiYan(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/weiYan/deleteWeiYan/`, { id }),
    "删除失败！"
  );
}

/**
 * 保存微言
 * @param {Object} weiYan - 微言数据
 * @returns {Promise} 保存结果
 */
export function saveWeiYan(weiYan) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/weiYan/saveWeiYan/`, weiYan),
    "保存微言失败！"
  );
}

/**
 * 获取进展列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 进展列表
 */
export function getNewsList(params) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/weiYan/listNews/`, params),
    "获取进展列表失败！"
  );
}

/**
 * 保存树洞留言
 * @param {Object} treeHole - 树洞数据
 * @returns {Promise} 保存结果
 */
export function saveTreeHole(treeHole) {
  return apiWrapper(
    () => http.post(`${constant.baseURL}/webInfo/saveTreeHole/`, treeHole),
    "保存留言失败！"
  );
}

/**
 * 删除树洞留言
 * @param {number} id - 树洞ID
 * @returns {Promise} 删除结果
 */
export function deleteTreeHole(id) {
  return apiWrapper(
    () => http.get(`${constant.baseURL}/webInfo/deleteTreeHole/`, { id }),
    "删除留言失败！"
  );
}

/**
 * 获取管理员树洞列表
 * @param {Object} pagination - 分页参数
 * @returns {Promise} 树洞列表
 */
export function getBossTreeHoleList(pagination) {
  return apiWrapper(
    () =>
      http.post(`${constant.baseURL}/admin/treeHole/boss/list/`, pagination),
    "获取树洞列表失败！"
  );
}

export default {
  getWeiYanList,
  changeWeiYanIsPublic,
  saveNews,
  deleteWeiYan,
  saveWeiYan,
  getNewsList,
  saveTreeHole,
  deleteTreeHole,
  getBossTreeHoleList,
};
