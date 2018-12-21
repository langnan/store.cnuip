import { stringify } from 'qs';
import request from '../utils/request';

// 需求类型
const requirementTypes = [
  { label: '全部', value: undefined },
  { label: '项目申报', value: 'PROJECT_DECLARATION' },
  { label: '专利申请', value: 'PATENT_APPLICATION' },
  { label: '知识产权贯标', value: 'INTELLECTUAL_PROPERTY_RIGHT' },
  { label: '法律援助', value: 'LEGAL_AID' },
  { label: '专利情报分析', value: 'ANALYSIS_OF_PATENT_INFORMATION' },
  { label: '专利价值评估', value: 'EVALUATION_OF_PATENT_VALUE' },
];

// 企业类型
const enterpriseTypes = [
  { label: '全部', value: undefined },
  { label: '高新技术企业', value: 'HIGH_NEW_TECHNOLOGY' },
  { label: '创新型企业', value: 'INNOVATIVE' },
  { label: '科技型中小企业', value: 'SCIENCE_TECHNOLOGY' },
  { label: '民营科技企业', value: 'PRIVATE_SCIENCE_TECHNOLOGY' },
  { label: '大中型企业', value: 'LARGE_MIDDLE_SIZED' },
];

// 回复状态
const replyTypes = [
  { label: '全部', value: undefined },
  { label: '未回复', value: 'NO' },
  { label: '已回复', value: 'YES' },
];

// 时间
const timeRanges = [
  { label: '全部', value: undefined },
  { label: '今日', value: 0 },
  { label: '最近三天', value: 3 },
  { label: '最近一周', value: 7 },
  { label: '最近一月', value: 30 },
];

export { requirementTypes, enterpriseTypes, replyTypes, timeRanges };

/**
 * 获取专利知事
 * @param {*} payload
 */
export async function queryNews(payload) {
  return request(`/api/cnuip/article/v1/article/?${stringify(payload)}`);
}

/**
 * 获取知事详情
 * @param {*} payload
 */
export async function getNewsDetail(payload) {
  return request(`/api/cnuip/article/v1/article/detail?id=${payload.id}`);
}

/**
 * 获取需求列表
 * @param {*} payload
 */
export async function queryRequirement(payload) {
  return request(`/api/user/v1/requirement/?${stringify(payload)}`);
}

/**
 * 获取分类
 */
export async function getClassifies(payload) {
  return request(`/api/cnuip/console/v1/classify/two?${stringify(payload)}`);
}

/**
 * 获取企业分类接口
 */
export async function getFirmTypes(payload) {
  return request(`/api/cnuip/user/v1/classify?${stringify(payload)}`);
}

/**
 * 获取需求详情
 */
export async function getRequirementDetail(payload) {
  return request(`/api/user/v1/requirement/detail?requirementId=${payload.id}`);
}

/**
 * 回复需求
 * @param {*} payload
 */
export async function replyRequirement(payload) {
  return request(`/api/user/v1/requirement/reply?${stringify(payload)}`);
}

/**
 * 获取商品留言列表
 */
export async function queryConsultation(payload) {
  return request(`/api/colligate/v1/colligate/comment/goods?${stringify(payload)}`);
}

/**
 * 回复商品咨询
 * @param {*} payload
 */
export async function replyConsultation(payload) {
  return request(`/api/colligate/v1/colligate/comment/goods/reply?${stringify(payload)}`, {
    method: 'PUT',
  });
}

/**
 * 获取店铺咨询列表
 */
export async function queryShop(payload) {
  return request(`/api/colligate/v1/colligate/comment/shop?${stringify(payload)}`);
}

/**
 * 回复店铺咨询
 */
export async function replyShop(payload) {
  return request(`/api/colligate/v1/colligate/comment/shop/reply?${stringify(payload)}`, {
    method: 'PUT',
  });
}
