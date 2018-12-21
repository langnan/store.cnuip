import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import {
  getPostList,
  getDepartmentList,
  addpost,
  editpost,
  deletepost,
  getCurrentUser
} from '../../services/system';

export default {
  namespace: 'post',

  state: {
    departmentList: [],
    postList: [],
    searchPostList: [],
    searchDepartmentList: [],
  },

  effects: {
    *fetchCurrentDepartment({ callback, payload }, { call, put }) {
      const userResponse = yield call(getCurrentUser);
      if (userResponse.code === 0){
        const response = yield call(getDepartmentList);
        yield put({
          type: 'save',
          payload: {
            departmentList: [{
              id: 0,
              name: userResponse.result.organizationName,
              children: response.result,
            }],
          },
        });
      }else{
        notification.error({
          message: '获取组织信息失败！',
        });
      }
    },
    *fetchCurrentPost({ callback, payload }, { call, put }) {
      const response = yield call(getPostList, payload);
      yield put({
        type: 'save',
        payload: {
          searchPostList: response.result,
          postList: response.result,
        },
      });
    },
    *addpost({ payload, callback }, { call, put }) {
      const response = yield call(addpost, payload);
      if (response.message === 'success') {
        notification.success({
          message: '新增岗位成功',
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '新增岗位失败',
          description: response.message,
        });
      }
    },
    *editpost({ payload, callback }, { call, put }) {
      const response = yield call(editpost, payload);
      if (response.message === 'success') {
        notification.success({
          message: '编辑岗位成功',
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '编辑岗位失败',
          description: response.message,
        });
      }
    },
    *deletepost({ payload, callback }, { call, put }) {
      const response = yield call(deletepost, payload);
      if (JSON.parse(response).message === 'success') {
        notification.success({
          message: '删除岗位成功',
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '删除岗位失败',
          description: JSON.parse(response).message,
        });
      }

    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    search(state, { payload }) {
      return {
        ...state,
        searchPostList: state.postList.filter(p => p.name.indexOf(payload.query) >= 0),
      };
    },
  },
};
