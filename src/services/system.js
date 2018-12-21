import { stringify } from 'qs';
import request from '../utils/request';

export async function getCurrentAccount() {
  return request('/api/console/v1/org/detail');
}

export async function saveAccount(payload) {
  return request('/api/colligate/v1/org/', {
    method: 'PUT',
    body: payload,
  });
}

export async function getCurrentUser(query) {
  return request('/api/user/v1/user/current');
}

export async function getRoleList(query) {
  return request(`/api/user/v1/role/?${stringify(query)}`);
}

export async function getAllRoleList(query) {
  return request(`/api/user/v1/role/?${stringify(query)}`);
}

export async function getLevelList(query) {
  return request(`/api/console/v1/powers/?${stringify(query)}`);
}

export async function getUserByUserId(query) {
  return request(`/api/user/v1/user/detail?id=${query.id}`);
}

export async function getAuthorityList(query) {
  return request(`/api/user/v1/role/?${stringify(query)}`);
}

export async function getAuthorityById(query) {
  return request(`/api/user/v1/role/detail?id=${query.id}`);
}

export async function deleteRole(id) {
  return request(`/api/user/v1/role/?roleId=${id}`, {
    method: 'DELETE',
  });
}

export async function editRole(payload) {
  if (payload.id) {
    return request('/api/user/v1/role/', {
      method: 'PUT',
      body: payload,
    });
  } else {
    return request('/api/user/v1/role/', {
      method: 'POST',
      body: payload,
    });
  }
}

export async function getAllAuthority() {
  return request('/api/user/v1/authority/');
}

// export async function getDepartmentList() {
//   return request('/api/console/v1/department/tree');
// }
export async function getDepartmentList() {
  return request('/api/console/v1/department/?isDelete=NO');
}

export async function addDepartment(payload) {
  return request('/api/console/v1/department/', {
    method: 'POST',
    body: payload,
  });
}

export async function editDepartment(payload) {
  return request('/api/console/v1/department/', {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteDepartment(payload) {
  return request(`/api/colligate/v1/colligate/console/department/?${stringify(payload)}`, {
    method: 'DELETE',
  });
}

export async function addpost(payload) {
  return request('/api/console/v1/post/', {
    method: 'POST',
    body: payload,
  });
}

export async function editpost(payload) {
  return request('/api/console/v1/post/', {
    method: 'PUT',
    body: payload,
  });
}

export async function deletepost(payload) {
  return request(`/api/colligate/v1/colligate/console/post/?${stringify(payload)}`, {
    method: 'DELETE',
  });
}

export async function getPostList(payload) {
  return request(`/api/console/v1/post/?${stringify(payload)}`);
}

export async function saveLevel(payload) {
  if (payload.id) {
    return request('/api/console/v1/powers/', {
      method: 'PUT',
      body: payload,
    });
  } else {
    return request('/api/console/v1/powers/', {
      method: 'POST',
      body: payload,
    });
  }
}

export async function deleteLevel(id) {
  return request(`/api/colligate/v1/colligate/console/powers?id=${id}`, {
    method: 'DELETE',
  });
}

export async function getProjectList(payload) {
  return request(`/api/console/v1/team/?${stringify(payload)}`);
}

export async function addProjectName(project) {
  return request('/api/console/v1/team/', {
    method: 'POST',
    body: project,
  });
}

export async function editProjectName(project) {
  return request('/api/console/v1/team/', {
    method: 'PUT',
    body: project,
  });
}

export async function deleteProjectName(id) {
  return request(`/api/console/v1/team/?id=${id}`, {
    method: 'DELETE',
  });
}

export async function getUserList(payload) {
  return request(`/api/user/v1/user/?${stringify(payload)}`);
}

export async function getRegisterUser(payload) {
  return request(`/api/user/v1/user/department/none?${stringify(payload)}`);
}

export async function addUser(user) {
  return request('/api/user/v1/user/', {
    method: 'POST',
    body: user,
  });
}

export async function editUser(user) {
  return request('/api/user/v1/user/', {
    method: 'PUT',
    body: user,
  });
}

export async function deleteUser(id) {
  return request(`/api/user/v1/user/?userId=${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取所有的流程模版
 */
export async function getAllFlows() {
  return request('/api/process/v1/tmplprocess/');
}

/**
 * 保存流程模版
 * @param {*} payload
 */
export async function saveFlow(payload) {
  return request('/api/process/v1/tmplprocess/', {
    method: payload.id ? 'PUT' : 'POST',
    body: payload,
  });
}

/**
 * 获取流程模版详情
 * @param {*} payload
 */
export async function getFlowDetail(payload) {
  return request(`/api/process/v1/tmplprocess/detail?tmplProcessId=${payload.flowId}`);
}

/**
 * 获取所有部门，以数组形式返回
 */
export async function getDepartmentArray(payload) {
  return request(`/api/colligate/v1/colligate/console/dept?${stringify(payload)}`);
}

/**
 * 删除流程模版
 */
export async function deleteFlow(payload) {
  return request(`/api/process/v1/tmplprocess/?tmplProcessId=${payload.flowId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取科技成果列表
 */
export async function getResultList(payload) {
  return request(`/api/result/v1/patentresult/?${stringify(payload)}`);
}

/**
 * 新增科技成果
 */
export async function addResult(result) {
  return request('/api/colligate/v1/patentresult/', {
    method: 'POST',
    body: result,
  });
}

/**
 * 编辑科技成果
 */
export async function updateResult(result) {
  return request('/api/result/v1/patentresult/', {
    method: 'PUT',
    body: result,
  });
}

/**
 * 获取专利成果详情
 */
export async function getResultDetail(payload) {
  return request(`/api/result/v1/patentresult/detail?patentResultId=${payload.resultId}`);
}

/**
 * 删除专利成果
 */
export async function deleteResult(resultId) {
  return request(`/api/result/v1/patentresult/?patentResultId=${resultId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取标签列表
 */
export async function getLabelList(payload) {
  return request(`/api/result/v1/label/?${stringify(payload)}`);
}

/**
 * 新增标签
 */
export async function addLabel(label) {
  return request('/api/result/v1/label/', {
    method: 'POST',
    body: label,
  });
}

/**
 * 编辑标签
 */
export async function editLabel(label) {
  return request('/api/result/v1/label/', {
    method: 'PUT',
    body: label,
  });
}

/**
 * 删除标签
 */
export async function deleteLabel(labelId) {
  return request(`/api/result/v1/label/?labelId=${labelId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取标签值列表
 */
export async function getLabelValueList(payload) {
  return request(`/api/result/v1/labelvalue/?${stringify(payload)}`);
}

/**
 * 新增标签值
 */
export async function addLabelValue(labelValue) {
  return request('/api/result/v1/labelvalue/', {
    method: 'POST',
    body: labelValue,
  });
}

/**
 * 编辑标签值
 */
export async function editLabelValue(labelValue) {
  return request('/api/result/v1/labelvalue/', {
    method: 'PUT',
    body: labelValue,
  });
}

/**
 * 删除标签值
 */
export async function deleteLabelValue(labelValueId) {
  return request(`/api/result/v1/labelvalue/?labelValueId=${labelValueId}`, {
    method: 'DELETE',
  });
}
