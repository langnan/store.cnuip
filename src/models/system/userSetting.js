import { notification } from 'antd';
import {
  getUserList,
  getRegisterUser,
  getRoleList,
  getLevelList,
  getPostList,
  getCurrentUser,
  getDepartmentList,
  getProjectList,
  editUser,
  addUser,
  getUserByUserId,
  deleteUser,
} from '../../services/system';

export default {
  namespace: 'userSetting',
  state: {
    departmentList: [],
    userList: [],
    userRegisterList: [],
    roleList: [],
    powersList: [],
    projectList: [],
    postList: [],
    editObject: {},
    user: {},
    showEdit: false,
  },
  effects: {
    *getUserList({ payload, callback }, { call, put }) {
      const response = yield call(getUserList, payload);
      if (response.code === 0) {
        const { result } = response;
        const userList = [
          {
            id: payload && payload.departmentId,
            name: payload && payload.departmentName,
            children: result.list,
            pagination: {
              pageSize: result.pageSize,
              current: result.pageNum,
              total: result.total,
            },
          },
        ];
        yield put({
          type: 'save',
          payload: {
            userList,
          },
        });
        if (callback) callback(userList);
      } else {
        notification.error({
          message: '获取用户列表失败！',
        });
      }
    },

    *getRegisterUser({ payload, callback }, { call, put }) {
      const response = yield call(getRegisterUser, payload);
      if (response.code === 0) {
        const { result } = response;
        const userRegisterList = [
          {
            children: result.list,
            pagination: {
              pageSize: result.pageSize,
              current: result.pageNum,
              total: result.total,
            },
          },
        ];
        yield put({
          type: 'save',
          payload: {
            userRegisterList,
          },
        });
        if (callback) callback(userRegisterList);
      } else {
        notification.error({
          message: '获取注册用户列表失败！',
        });
      }
    },

    *getUserByUserId({ payload, callback }, { call, put }) {
      if (!payload.id) {
        yield put({
          type: 'save',
          payload: {
            editObject: {},
            userList: [],
          },
        });
        return;
      }
      const response = yield call(getUserByUserId, payload);
      if (callback) callback(response);
    },
    *getRoleList({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);

      if (response.code === 0) {
        // response.result.list.push({ id: '', remark: '请选择角色' });
        yield put({
          type: 'save',
          payload: {
            roleList: response.result.list,
          },
        });
      } else {
        notification.error({
          message: '获取角色列表失败！',
        });
      }
    },
    *getPowersList({ payload }, { call, put }) {
      const response = yield call(getLevelList, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            powersList: response.result.list,
          },
        });
      } else {
        notification.error({
          message: '获取职权列表失败！',
        });
      }
    },
    *getPostList({ payload }, { call, put }) {
      const response = yield call(getPostList, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            postList: response.result,
          },
        });
      } else {
        notification.error({
          message: '获取岗位列表失败！',
        });
      }
    },
    *getProjectList({ payload }, { call, put }) {
      const response = yield call(getProjectList, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            projectList: response.result.list,
          },
        });
      } else {
        notification.error({
          message: '获取岗位列表失败！',
        });
      }
    },
    *getDepartmentList({ payload }, { call, put }) {
      const userResponse = yield call(getCurrentUser);
      if (userResponse.code === 0) {
        const response = yield call(getDepartmentList);
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              departmentList: [
                {
                  id: 0,
                  name: userResponse.result.organizationName,
                  children: response.result,
                },
              ],
            },
          });
        } else {
          notification.error({
            message: '获取部门列表失败！',
          });
        }
      } else {
        notification.error({
          message: '获取组织信息失败！',
        });
      }
    },
    *saveUser({ payload, callback }, { call, put }) {
      let response;
      if (payload.user.id) {
        response = yield call(editUser, payload.user);
      } else {
        response = yield call(addUser, payload.user);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.list,
        });
        notification.success({
          message: `${payload.user.id ? '编辑' : '新增'}用户成功！`,
        });
      } else {
        notification.error({
          message: `${payload.user.id ? '编辑' : '新增'}用户失败！`,
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
    *editUser({ payload, callback }, { call, put }) {
      const response = yield call(editUser, payload);
      const { result } = response;
      // console.log(payload, 'xx');
      // response = JSON.parse(response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: result,
        });
        notification.success({
          message: `${payload.isDelete === 'YES' ? '停用' : '启用'}用户成功！`,
        });
      } else {
        notification.error({
          message: `${payload.isDelete === 'YES' ? '停用' : '启用'}用户失败！`,
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setEditObject(state, { payload, flag }) {
      return {
        ...state,
        editObject: payload,
        showEdit: flag,
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
