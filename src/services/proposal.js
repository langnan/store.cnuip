import { stringify } from 'qs';
import request from '../utils/request';

export async function getProposalList(payload) {
  return request(`/api/process/v1/process/?${stringify(payload)}`);
}

export async function getCopyMeList(payload) {
  return request(`/api/process/v1/process/copyme?${stringify(payload)}`);
}

export async function getEditorProposalList(payload) {
  return request(`/api/process/v1/process/editor?${stringify(payload)}`);
}

export async function getProcessUserList(payload) {
  return request(`/api/process/v1/process/user?${stringify(payload)}`);
}

export async function changeProposalUserState(proposal) {
  return request('/api/process/v1/process/task/user/', {
    method: 'PUT',
    body: proposal,
  });
}

export async function getProposalDetail(payload) {
  return request(`/api/process/v1/process/detail/?${stringify(payload)}`);
}

export async function addProposal() {
  return request('');
}

export async function changeProposalState(proposal) {
  return request('/api/process/v1/process/', {
    method: 'PUT',
    body: proposal,
  });
}

export async function AddProposal(proposal) {
  return request('/api/colligate/v1/process/', {
    method: 'POST',
    body: proposal,
  });
}

export async function addProcessRequisition(requisition) {
  return request('/api/process/v1/process/requisition/', {
    method: 'POST',
    body: requisition,
  });
}
