/**
 * console.js
 * created by 熊玮 at 2018/8/27
 */

import { stringify } from 'qs';
import request from '../utils/request';

// 获取所有组织
export const getOrganizations = () => request('/api/console/v1/org/all');

// 获取组织树
export const getALLOrganizations = () => request('/api/console/v1/org/province/organization');
