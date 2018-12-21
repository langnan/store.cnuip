import { stringify } from 'qs';
import request from '../utils/request';

export async function queryPatent(payload) {
  return request(`/api/colligate/v1/patent/?${stringify(payload)}`);
}

export async function getPatentDetail(payload) {
  return request(`/api/colligate/v1/patent/detail?an=${payload.an}`);
}

export async function getValueDetail(payload) {
  return request(`/api/colligate/v1/patent/report?an=${payload.an}`);
}
// export async function getPatentDetail(payload) {
//   return request(`/api/colligate/tiikong?name=getPatentByPatentNo&patentNo=${payload.an}`);
// }

/**
 * 获取专利相似度
 * @param {*} payload
 */
export async function getPatentSimilarity(payload) {
  // return request(`/api/colligate/tiikong?name=getSimilarityInfo&appNo=${payload.an}`);
  return request(`/api/colligate/tiikong?${stringify(payload)}`);
}

/**
 * 获取专利引证信息
 * @param {*} payload
 */
export async function getPatentQuoteList(payload) {
  return request(`/api/colligate/tiikong?name=getPatentQuoteList&appNo=${payload.an}`);
}

export async function queryFeeWarning() {
  return request('/api/patent/feeWarning');
}

export async function queryValue(payload) {
  return request(`/api/colligate/v1/patent/value?${stringify(payload)}`);
}

export async function queryUseful(payload) {
  return request(`/api/colligate/v1/patent/useful?${stringify(payload)}`);
}

/**
 * 获取我的收藏列表
 * @param {*} payload
 */
export async function queryFavorite(payload) {
  return request(`/api/patent/v1/favorite/?${stringify(payload)}`);
}

/**
 * 收藏
 * @param {*} payload
 */
export async function addFavorite(payload) {
  return request(`/api/patent/v1/favorite/?${stringify(payload)}`, {
    method: 'POST',
  });
}

/**
 * 删除收藏
 * @param {*} payload
 */
export async function deleteFavorite(payload) {
  return request(`/api/patent/v1/favorite/?${stringify(payload)}`, {
    method: 'DELETE',
  });
}

export async function getValueList() {
  return request('/api/patent/favorite');
}
