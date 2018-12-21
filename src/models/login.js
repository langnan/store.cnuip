import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { notification } from 'antd';
import { getALLOrganizations } from '../services/console';
import { login, logout, queryVerifyCode, checkVerifyCode } from '../services/user';
import { getAuthority, setAuthority, setMenus, setSysMenu } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';
import store from '../index';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    organizations: [],
    errorMessage: undefined,
    loginTypeEnum: 'PWD',
  },

  effects: {
    *fetchOrganizations({ _ }, { call, put }) {
      const response = yield call(getALLOrganizations);
      yield put({
        type: 'changeOrganizations',
        payload: response.result,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // Login successfully
      if (response.code === 0) {
        const loginUser = response.result;
        if (loginUser.roles && loginUser.roles.length > 0) {
          const currentAuthority = loginUser.roles[0].name;
          yield put({
            type: 'changeLoginStatus',
            payload: {
              ...payload,
              status: 'ok',
              currentAuthority,
            },
          });
          store.dispatch({
            type: 'user/saveCurrentUser',
            payload: loginUser,
          });
          loginUser.authorities.forEach(ele => {
            ele.path = ele.url;
            if (ele.children && ele.children.length) {
              ele.children.forEach(e => {
                e.path = e.url;
              });
            }
            if (ele.name === 'SYSTEM' && ele.children) {
              setSysMenu(JSON.stringify(ele.children));
              ele.children = null;
            }
          });
          setMenus(JSON.stringify(loginUser.authorities));
        } else {
          // 没有角色，不允许登录
          return yield put({
            type: 'changeLoginStatus',
            payload: {
              ...payload,
              status: 'error',
            },
          });
        }
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (
          redirect &&
          (redirect.indexOf('user/login') >= 0 || redirect.indexOf('user/logout') >= 0)
        ) {
          redirect = null;
        }
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.push(redirect || '/'));
      } else {
        // 登录失败
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...payload,
            status: 'error',
            errorMessage: response.message,
          },
        });
      }
    },
    *logout(_, { call, put }) {
      yield call(logout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
    *queryVerifyCode({ payload, callback }, { call, put }) {
      const response = yield call(queryVerifyCode, payload);
      if (response.code !== 0) {
        notification.error({
          message: '短信发送失败',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
    *checkVerifyCode({ payload, callback }, { call, put }) {
      const response = yield call(checkVerifyCode, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeOrganizations(state, { payload }) {
      return {
        ...state,
        organizations: payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        loginTypeEnum: payload.loginTypeEnum,
        errorMessage: payload.errorMessage,
      };
    },
  },
};
