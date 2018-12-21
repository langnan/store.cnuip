import { notification } from 'antd';
import {
  getAuthorityList,
  getAllAuthority,
  getAuthorityById,
  editRole,
  deleteRole,
} from '../../services/system';

export default {
  namespace: 'authority',

  state: {
    result: {
      list: [],
    },
    showEdit: false,
    editObject: {
      authorityVos: [],
    },
    authorityVos: [],
    visible: false,
    showEmpty: true,
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(getAuthorityList, { isDelete: 'NO', pageSize: 0, pageNum: 0 });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            result: response.result,
          },
        });
      } else {
        notification.error({
          message: '请求角色出错！',
          description: response.message,
        });
      }
    },
    *fetchEdit({ payload, flag, showEmpty }, { call, put }) {
      const response = yield call(getAuthorityById, payload);
      if (response.code === 0) {
        const editObject = response.result;
        payload.subAuthorityVos.authorityVos.forEach(ele => {
          const parent = ele;
          if (!parent.children) {
            parent.is_checked = false;
          } else {
            parent.children.forEach(e => {
              e.is_checked = false;
            });
          }
        });
        if (editObject.authorityVos.length) {
          editObject.authorityVos.forEach(ele => {
            const parent = ele;
            if (!parent.children) {
              parent.is_checked = true;
            } else {
              parent.children.forEach(e => {
                e.is_checked = true;
              });
            }
          });
          payload.subAuthorityVos.authorityVos.forEach((value, index) => {
            const v1 = value;
            editObject.authorityVos.forEach((ele, i) => {
              if (!v1.children) {
                if (ele.id === v1.id) {
                  v1.is_checked = true;
                }
              } else {
                if (ele.id === v1.id) {
                  v1.children.forEach((value1, ind) => {
                    const v2 = value1;
                    ele.children.forEach((el, ii) => {
                      if (v2.id === el.id) {
                        v2.is_checked = true;
                      }
                    });
                  });
                }
              }
            });
          });
        }
        editObject.authorityVos = payload.subAuthorityVos.authorityVos;
        const editObject2 = editObject;
        yield put({
          type: 'save',
          payload: {
            editObject: editObject2,
            showEdit: flag,
            showEmpty: showEmpty,
          },
        });
      } else {
        notification.error({
          message: '请求角色出错！',
          description: response.message,
        });
      }
    },
    *saveEdit({ payload }, { call, put }) {
      const response = yield call(editRole, payload);
      if (response.code === 0) {
        notification.success({
          message: `${payload.id ? '编辑' : '新增'}角色成功！`,
        });
        yield put({
          type: 'fetchCurrent',
        });
        yield put({
          type: 'getAllAuthority',
        });
      } else {
        notification.error({
          message: `${payload.id ? '编辑' : '新增'}角色出错！`,
          description: response.message,
        });
      }
    },
    *deleteRole({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload.id);
      if (callback) callback(response);
    },
    *getAllAuthority({ payload }, { call, put }) {
      const response = yield call(getAllAuthority);
      if (response.code === 0) {
        response.result.forEach(ele => {
          const parent = ele;
          if (!parent.children) {
            parent.is_checked = false;
          } else {
            parent.children.forEach(e => {
              e.is_checked = false;
            });
          }
        });
        yield put({
          type: 'save',
          payload: {
            authorityVos: response.result,
            editObject: {
              authorityVos: response.result,
            },
          },
        });
      } else {
        notification.error({
          message: '请求权限树出错！',
          description: response.message,
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
      const { query } = payload;
      return {
        ...state,
        result: {
          list: state.result.list.filter(i => i.name.indexOf(query) >= 0),
        },
      };
    },
    editAuthority(state, { payload, flag, showEmpty }) {
      return {
        ...state,
        editObject: payload,
        showEdit: flag,
        showEmpty: showEmpty,
      };
    },
    showModal(state, { visible }) {
      return {
        ...state,
        visible,
      };
    },
  },
};
