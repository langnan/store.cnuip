import { stringify } from 'qs';
import request from '../utils/request';

export async function getTransactionList(payload) {
    return request(`/api/colligate/v1/colligate/authorize/?${stringify(payload)}`);
}

export async function addTransactionList(payload) {
    return request('/api/colligate/v1/colligate/authorize/', {
      method: 'POST',
      body: payload,
    });
  }

  export async function getTranscationDetail(payload) {
    return request(`/api/authorize/v1/authorize/detail/?${stringify(payload)}`);
}

export async function updateTranscationState(payload) {
  return request(`/api/authorize/v1/authorize/updatestate/?${stringify(payload)}`,{
    method: 'PUT',
  });
}



