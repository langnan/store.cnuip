import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { getOrganizations } from './mock/console';
import { getCurrentAccount, saveAccount } from './mock/account';
import { getLevelList, saveLevel } from './mock/level';
import { getAuthorityList, getAllAuthority } from './mock/authority';
import { getDepartmentList } from './mock/department';
import { getProjectList, addProjectName, deleteName } from './mock/projectSetting';
import { getUserList, getFromInfo } from './mock/userSetting';
import { getAllFlows, saveFlow } from './mock/flow';
import { getPostList } from './mock/post';
import { getProposalList } from './mock/proposal/proposalList';
import { queryPatent, getPatentDetail } from './mock/patentList';
import { queryFeeWarning } from './mock/feeWarning';
import { queryFavorite } from './mock/favorite';
// 是否禁用mock数据
const noMock = process.env.NO_MOCK === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const mock = {
  // 支持值为 Object 和 Array

  'GET /api/console/v1/org/all': {
    code: 0,
    message: 'success',
    result: getOrganizations(),
  },

  'GET /api/account': (req, res) => {
    res.send({
      status: 'ok',
      detail: getCurrentAccount(),
    });
  },

  'POST /api/account': (req, res) => {
    saveAccount(req.body);
    res.send({
      status: 'ok',
    });
  },

  'GET /console/v1/powers/': (req, res) => {
    res.send({
      code: 0,
      message: 'success',
      result: getLevelList(),
    });
  },

  'PUT /api/console/v1/powers/': (req, res) => {
    saveLevel(req.body);
    res.send({
      code: 0,
      message: 'success',
    });
  },

  'GET /api/projectName': (req, res) => {
    res.send({
      status: 'ok',
      list: getProjectList(),
    });
  },
  'GET /api/user/v1/role/': (req, res) => {
    res.send({
      status: 'ok',
      result: getAuthorityList(),
    });
  },
  'POST /api/projectName': (req, res) => {
    addProjectName(req.body);
    res.send({
      status: 'ok',
      list: getProjectList(),
    });
  },

  'POST /api/deleteProjectName': (req, res) => {
    deleteName(req.body);
    res.send({
      status: 'ok',
      list: getProjectList(),
    });
  },

  'GET /api/getUserList': (req, res) => {
    res.send({
      status: 'ok',
      list: getUserList(),
    });
  },

  'GET /api/getFromInfo': (req, res) => {
    res.send({
      status: 'ok',
      list: getFromInfo(),
    });
  },

  'GET /api/user/v1/authority/': (req, res) => {
    res.send({
      status: 'ok',
      result: getAllAuthority(),
    });
  },

  'GET /api/getDepartmentList': (req, res) => {
    res.send({
      status: 'ok',
      list: getDepartmentList(),
    });
  },

  'GET /api/getPostList': (req, res) => {
    res.send({
      status: 'ok',
      list: getPostList(),
    });
  },

  'GET /api/flows': (req, res) => {
    res.send({
      status: 'ok',
      result: getAllFlows(),
    });
  },

  'POST /api/flows': (req, res) => {
    saveFlow(req.body);
    res.send({
      status: 'ok',
    });
  },

  'GET /api/patent/list': (req, res) => {
    res.send({
      status: 'ok',
      result: queryPatent(),
    });
  },

  'GET /api/patent/detail': (req, res) => {
    res.send({
      status: 'ok',
      result: getPatentDetail(req.query.an),
    });
  },

  'GET /api/patent/feeWarning': (req, res) => {
    res.send({
      status: 'ok',
      result: queryFeeWarning(),
    });
  },

  'GET /api/patent/favorite': (req, res) => {
    res.send({
      code: 0,
      result: queryFavorite(),
    });
  },

  'GET /api/process/v1/process/': (req, res) => {
    res.send({
      code: 0,
      message: 'success',
      result: getProposalList(),
    });
  },

  'GET /api/user/v1/user/current': {
    code: 0,
    message: 'success',
    result: {
      id: 1,
      organizationId: 1,
      username: 'admin',
      realName: '超级用户',
      phone: '18000000000',
      sex: '男',
      nation: null,
      nativePlace: null,
      idCardNo: null,
      birthday: null,
      wchat: null,
      imageUrl: null,
      title: null,
      departmentId: 1,
      departmentName: '',
      postId: 1,
      postName: '',
      powersId: 1,
      powersName: '',
      direction: null,
      introduction: null,
      honor: null,
      isDelete: 'NO',
      editorId: 1,
      editorName: 'admin',
      createdTime: 1534938626000,
      updatedTime: 1534938661000,
      roles: [
        {
          id: 1,
          organizationId: 1,
          name: 'ROLE_ADMIN',
          remark: '超级用户组',
          isDelete: 'NO',
          editorId: 1,
          editorName: 'admin',
          createdTime: 1534938626000,
          updatedTime: 1534938626000,
        },
      ],
      authorities: [
        {
          id: 1,
          type: 'MENU',
          name: 'AUTH_WELCOME',
          title: '欢迎页',
          parentId: 0,
          sortOrder: 1,
          url: 'main.dashboard',
          icon: 'fa fa-dashboard',
          editorId: 0,
          editorName: '',
          createdTime: 1534938625000,
          updatedTime: 1534938625000,
          children: null,
        },
        {
          id: 2,
          type: 'MENU',
          name: 'AUTH_SYSTEM',
          title: '系统设置',
          parentId: 0,
          sortOrder: 2,
          url: 'main.system',
          icon: 'fa fa-bars',
          editorId: 0,
          editorName: '',
          createdTime: 1534938625000,
          updatedTime: 1534938625000,
          children: [
            {
              id: 3,
              type: 'MENU',
              name: 'AUTH_SYSTEM_DEPARTMENT',
              title: '部门设置',
              parentId: 2,
              sortOrder: 1,
              url: 'main.system.department',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 4,
              type: 'MENU',
              name: 'AUTH_SYSTEM_POST',
              title: '岗位设置',
              parentId: 2,
              sortOrder: 2,
              url: 'main.system.post',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 5,
              type: 'MENU',
              name: 'AUTH_SYSTEM_POWERS',
              title: '审核权限',
              parentId: 2,
              sortOrder: 3,
              url: 'main.system.powers',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 6,
              type: 'MENU',
              name: 'AUTH_SYSTEM_TEAM',
              title: '项目组设置',
              parentId: 2,
              sortOrder: 4,
              url: 'main.system.team',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 7,
              type: 'MENU',
              name: 'AUTH_SYSTEM_USER',
              title: '用户信息',
              parentId: 2,
              sortOrder: 5,
              url: 'main.system.user',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 8,
              type: 'MENU',
              name: 'AUTH_SYSTEM_ROLE',
              title: '权限设置',
              parentId: 2,
              sortOrder: 6,
              url: 'main.system.role',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 9,
              type: 'MENU',
              name: 'AUTH_SYSTEM_PROCESS',
              title: '流程设置',
              parentId: 2,
              sortOrder: 7,
              url: 'main.system.process',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 10,
              type: 'MENU',
              name: 'AUTH_SYSTEM_COLLEGE',
              title: '账号设置',
              parentId: 2,
              sortOrder: 8,
              url: 'main.system.college',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
          ],
        },
        {
          id: 11,
          type: 'MENU',
          name: 'AUTH_PROCESS',
          title: '提案管理',
          parentId: 0,
          sortOrder: 3,
          url: 'main.process',
          icon: 'fa fa-bars',
          editorId: 0,
          editorName: '',
          createdTime: 1534938625000,
          updatedTime: 1534938625000,
          children: [
            {
              id: 12,
              type: 'MENU',
              name: 'AUTH_PROCESS_EXAMINED',
              title: '由我审核',
              parentId: 11,
              sortOrder: 1,
              url: 'main.process.examined',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 13,
              type: 'MENU',
              name: 'AUTH_PROCESS_LIST',
              title: '提案列表',
              parentId: 11,
              sortOrder: 2,
              url: 'main.process.list',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938626000,
              children: null,
            },
            {
              id: 14,
              type: 'MENU',
              name: 'AUTH_PROCESS_ADD',
              title: '新增提案',
              parentId: 11,
              sortOrder: 3,
              url: 'main.process.add',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938626000,
              updatedTime: 1534938626000,
              children: null,
            },
            {
              id: 15,
              type: 'MENU',
              name: 'AUTH_PROCESS_SHOW',
              title: '抄送给我',
              parentId: 11,
              sortOrder: 4,
              url: 'main.process.show',
              icon: null,
              editorId: 0,
              editorName: '',
              createdTime: 1534938626000,
              updatedTime: 1534938626000,
              children: null,
            },
          ],
        },
      ],
      teams: null,
    },
  },
  'POST /api/user/v1/user/login': (req, res) => {
    const { password, username, type, orgId } = req.query;
    if (password === '123456' && username === 'admin') {
      res.send({
        code: 0,
        message: 'success',
        result: {
          id: 1,
          organizationId: 1,
          username: 'admin',
          realName: '超级用户',
          phone: '18000000000',
          sex: '男',
          nation: null,
          nativePlace: null,
          idCardNo: null,
          birthday: null,
          wchat: null,
          imageUrl: null,
          title: null,
          departmentId: 1,
          departmentName: '',
          postId: 1,
          postName: '',
          powersId: 1,
          powersName: '',
          direction: null,
          introduction: null,
          honor: null,
          isDelete: 'NO',
          editorId: 1,
          editorName: 'admin',
          createdTime: 1534938626000,
          updatedTime: 1534938661000,
          roles: [
            {
              id: 1,
              organizationId: 1,
              name: 'ROLE_ADMIN',
              remark: '超级用户组',
              isDelete: 'NO',
              editorId: 1,
              editorName: 'admin',
              createdTime: 1534938626000,
              updatedTime: 1534938626000,
            },
          ],
          authorities: [
            {
              id: 1,
              type: 'MENU',
              name: 'AUTH_WELCOME',
              title: '欢迎页',
              parentId: 0,
              sortOrder: 1,
              url: 'main.dashboard',
              icon: 'fa fa-dashboard',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 2,
              type: 'MENU',
              name: 'AUTH_SYSTEM',
              title: '系统设置',
              parentId: 0,
              sortOrder: 2,
              url: 'main.system',
              icon: 'fa fa-bars',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: [
                {
                  id: 3,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_DEPARTMENT',
                  title: '部门设置',
                  parentId: 2,
                  sortOrder: 1,
                  url: 'main.system.department',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 4,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_POST',
                  title: '岗位设置',
                  parentId: 2,
                  sortOrder: 2,
                  url: 'main.system.post',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 5,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_POWERS',
                  title: '审核权限',
                  parentId: 2,
                  sortOrder: 3,
                  url: 'main.system.powers',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 6,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_TEAM',
                  title: '项目组设置',
                  parentId: 2,
                  sortOrder: 4,
                  url: 'main.system.team',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 7,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_USER',
                  title: '用户信息',
                  parentId: 2,
                  sortOrder: 5,
                  url: 'main.system.user',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 8,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_ROLE',
                  title: '权限设置',
                  parentId: 2,
                  sortOrder: 6,
                  url: 'main.system.role',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 9,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_PROCESS',
                  title: '流程设置',
                  parentId: 2,
                  sortOrder: 7,
                  url: 'main.system.process',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 10,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_COLLEGE',
                  title: '账号设置',
                  parentId: 2,
                  sortOrder: 8,
                  url: 'main.system.college',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
              ],
            },
            {
              id: 11,
              type: 'MENU',
              name: 'AUTH_PROCESS',
              title: '提案管理',
              parentId: 0,
              sortOrder: 3,
              url: 'main.process',
              icon: 'fa fa-bars',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: [
                {
                  id: 12,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_EXAMINED',
                  title: '由我审核',
                  parentId: 11,
                  sortOrder: 1,
                  url: 'main.process.examined',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 13,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_LIST',
                  title: '提案列表',
                  parentId: 11,
                  sortOrder: 2,
                  url: 'main.process.list',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938626000,
                  children: null,
                },
                {
                  id: 14,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_ADD',
                  title: '新增提案',
                  parentId: 11,
                  sortOrder: 3,
                  url: 'main.process.add',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938626000,
                  updatedTime: 1534938626000,
                  children: null,
                },
                {
                  id: 15,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_SHOW',
                  title: '抄送给我',
                  parentId: 11,
                  sortOrder: 4,
                  url: 'main.process.show',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938626000,
                  updatedTime: 1534938626000,
                  children: null,
                },
              ],
            },
          ],
          teams: null,
        },
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        code: 0,
        message: 'success',
        result: {
          id: 1,
          organizationId: 1,
          username: 'admin',
          realName: '超级用户',
          phone: '18000000000',
          sex: '男',
          nation: null,
          nativePlace: null,
          idCardNo: null,
          birthday: null,
          wchat: null,
          imageUrl: null,
          title: null,
          departmentId: 1,
          departmentName: '',
          postId: 1,
          postName: '',
          powersId: 1,
          powersName: '',
          direction: null,
          introduction: null,
          honor: null,
          isDelete: 'NO',
          editorId: 1,
          editorName: 'admin',
          createdTime: 1534938626000,
          updatedTime: 1534938661000,
          roles: [
            {
              id: 1,
              organizationId: 1,
              name: 'ROLE_ADMIN',
              remark: '超级用户组',
              isDelete: 'NO',
              editorId: 1,
              editorName: 'admin',
              createdTime: 1534938626000,
              updatedTime: 1534938626000,
            },
          ],
          authorities: [
            {
              id: 1,
              type: 'MENU',
              name: 'AUTH_WELCOME',
              title: '欢迎页',
              parentId: 0,
              sortOrder: 1,
              url: 'main.dashboard',
              icon: 'fa fa-dashboard',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: null,
            },
            {
              id: 2,
              type: 'MENU',
              name: 'AUTH_SYSTEM',
              title: '系统设置',
              parentId: 0,
              sortOrder: 2,
              url: 'main.system',
              icon: 'fa fa-bars',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: [
                {
                  id: 3,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_DEPARTMENT',
                  title: '部门设置',
                  parentId: 2,
                  sortOrder: 1,
                  url: 'main.system.department',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 4,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_POST',
                  title: '岗位设置',
                  parentId: 2,
                  sortOrder: 2,
                  url: 'main.system.post',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 5,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_POWERS',
                  title: '审核权限',
                  parentId: 2,
                  sortOrder: 3,
                  url: 'main.system.powers',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 6,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_TEAM',
                  title: '项目组设置',
                  parentId: 2,
                  sortOrder: 4,
                  url: 'main.system.team',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 7,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_USER',
                  title: '用户信息',
                  parentId: 2,
                  sortOrder: 5,
                  url: 'main.system.user',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 8,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_ROLE',
                  title: '权限设置',
                  parentId: 2,
                  sortOrder: 6,
                  url: 'main.system.role',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 9,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_PROCESS',
                  title: '流程设置',
                  parentId: 2,
                  sortOrder: 7,
                  url: 'main.system.process',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 10,
                  type: 'MENU',
                  name: 'AUTH_SYSTEM_COLLEGE',
                  title: '账号设置',
                  parentId: 2,
                  sortOrder: 8,
                  url: 'main.system.college',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
              ],
            },
            {
              id: 11,
              type: 'MENU',
              name: 'AUTH_PROCESS',
              title: '提案管理',
              parentId: 0,
              sortOrder: 3,
              url: 'main.process',
              icon: 'fa fa-bars',
              editorId: 0,
              editorName: '',
              createdTime: 1534938625000,
              updatedTime: 1534938625000,
              children: [
                {
                  id: 12,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_EXAMINED',
                  title: '由我审核',
                  parentId: 11,
                  sortOrder: 1,
                  url: 'main.process.examined',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938625000,
                  children: null,
                },
                {
                  id: 13,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_LIST',
                  title: '提案列表',
                  parentId: 11,
                  sortOrder: 2,
                  url: 'main.process.list',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938625000,
                  updatedTime: 1534938626000,
                  children: null,
                },
                {
                  id: 14,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_ADD',
                  title: '新增提案',
                  parentId: 11,
                  sortOrder: 3,
                  url: 'main.process.add',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938626000,
                  updatedTime: 1534938626000,
                  children: null,
                },
                {
                  id: 15,
                  type: 'MENU',
                  name: 'AUTH_PROCESS_SHOW',
                  title: '抄送给我',
                  parentId: 11,
                  sortOrder: 4,
                  url: 'main.process.show',
                  icon: null,
                  editorId: 0,
                  editorName: '',
                  createdTime: 1534938626000,
                  updatedTime: 1534938626000,
                  children: null,
                },
              ],
            },
          ],
          teams: null,
        },
      });
      return;
    }
    res.send({
      code: -1,
    });
  },
  'POST /api/user/v1/user/logout': {
    code: 0,
    message: 'success',
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

const proxy = {};

export default (noMock ? proxy : delay(mock, 1000));
