import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () =>
        import('../layouts/AuthorizedLayout')
      ),
    },
    '/retrieval/favorite': {
      component: dynamicWrapper(app, ['patent/favorite'], () =>
        import('../routes/Retrieval/Favorite')
      ),
    },
    '/retrieval/search': {
      component: dynamicWrapper(app, [], () => import('../routes/Retrieval/TiiKong')),
    },
    '/system/': {
      component: dynamicWrapper(app, [], () => import('../routes/System/Index')),
    },
    '/system/department': {
      component: dynamicWrapper(app, ['system/department'], () =>
        import('../routes/System/Department')
      ),
    },
    '/system/projectSetting': {
      component: dynamicWrapper(app, ['system/projectSetting'], () =>
        import('../routes/System/ProjectSetting')
      ),
    },
    '/system/userSetting': {
      component: dynamicWrapper(app, ['system/userSetting'], () =>
        import('../routes/System/UserSetting')
      ),
    },
    '/system/level': {
      component: dynamicWrapper(app, ['system/level'], () => import('../routes/System/Level')),
    },
    '/system/authority': {
      component: dynamicWrapper(app, ['system/authority'], () =>
        import('../routes/System/Authority')
      ),
    },
    '/system/account': {
      component: dynamicWrapper(app, ['system/account'], () => import('../routes/System/Account')),
    },
    '/system/post': {
      component: dynamicWrapper(app, ['system/post'], () => import('../routes/System/Post')),
    },
    '/system/flow': {
      component: dynamicWrapper(app, ['system/flow'], () => import('../routes/System/Flow')),
    },
    '/proposal/my-audit': {
      component: dynamicWrapper(app, ['proposal/myAudit'], () =>
        import('../routes/Proposal/MyAudit')
      ),
    },
    '/proposal/detail/:id': {
      component: dynamicWrapper(app, ['proposal/proposalList'], () =>
        import('../routes/Proposal/ProposalDetail')
      ),
    },
    '/proposal/list': {
      component: dynamicWrapper(app, ['proposal/proposalList'], () =>
        import('../routes/Proposal/ProposalList')
      ),
    },
    '/proposal/create': {
      component: dynamicWrapper(app, ['proposal/proposal'], () =>
        import('../routes/Proposal/ProposalEdit')
      ),
    },
    '/proposal/copy-me': {
      component: dynamicWrapper(app, ['proposal/copyMe'], () =>
        import('../routes/Proposal/CopyMe')
      ),
    },
    '/transaction/list': {
      component: dynamicWrapper(app, ['transaction/transaction'], () =>
        import('../routes/Transaction/TransactionList')
      ),
    },
    '/transaction/create': {
      component: dynamicWrapper(app, ['transaction/transaction'], () =>
        import('../routes/Transaction/AddTransaction')
      ),
    },
    '/transaction/detail/:id': {
      component: dynamicWrapper(app, ['transaction/transaction'], () =>
        import('../routes/Transaction/TransactionDetail')
      ),
    },
    '/result/list': {
      component: dynamicWrapper(app, ['result/result'], () => import('../routes/Result/Result')),
    },
    '/result/detail/:id': {
      component: dynamicWrapper(app, ['result/result'], () =>
        import('../routes/Result/ResultDetail')
      ),
    },
    '/result/create': {
      component: dynamicWrapper(app, ['result/result'], () =>
        import('../routes/Result/ResultEdit')
      ),
    },
    '/result/edit/:id': {
      component: dynamicWrapper(app, ['result/result'], () =>
        import('../routes/Result/ResultEdit')
      ),
    },
    '/result/tags': {
      component: dynamicWrapper(app, ['result/label'], () => import('../routes/Result/Label')),
    },
    '/result/tagsValue/:id': {
      component: dynamicWrapper(app, ['result/labelValue'], () =>
        import('../routes/Result/LabelValue')
      ),
    },
    '/patent/list': {
      component: dynamicWrapper(app, ['patent/patentList'], () => import('../routes/Patent/List')),
    },
    '/patent/detail/:an': {
      component: dynamicWrapper(app, ['patent/patentList'], () =>
        import('../routes/Patent/PatentDetail')
      ),
    },
    '/patent/value': {
      component: dynamicWrapper(app, ['patent/patent'], () => import('../routes/Patent/Value')),
    },
    '/patent/valueDetail/:id': {
      component: dynamicWrapper(app, ['patent/patent'], () =>
        import('../routes/Patent/ValueDetail')
      ),
    },
    '/patent/fee-warning': {
      component: dynamicWrapper(app, ['patent/feeWarning'], () =>
        import('../routes/Patent/FeeWarning')
      ),
    },
    '/patent/statistics': {
      component: dynamicWrapper(app, ['patent/patent'], () =>
        import('../routes/Patent/Statistics')
      ),
    },
    '/info/news': {
      component: dynamicWrapper(app, ['info/news'], () => import('../routes/Info/News')),
    },
    '/info/news-detail/:id': {
      component: dynamicWrapper(app, ['info/news'], () => import('../routes/Info/NewsDetail')),
    },
    '/info/requirement': {
      component: dynamicWrapper(app, ['info/requirement'], () =>
        import('../routes/Info/Requirement')
      ),
    },
    '/info/requirement-detail/:id': {
      component: dynamicWrapper(app, ['info/requirement'], () =>
        import('../routes/Info/RequirementDetail')
      ),
    },
    '/info/consultation': {
      component: dynamicWrapper(app, ['info/consultation'], () =>
        import('../routes/Info/Consultation')
      ),
    },
    '/info/consultation-detail/:id': {
      component: dynamicWrapper(app, ['info/consultation'], () =>
        import('../routes/Info/ConsultationDetail')
      ),
    },
    '/info/consultation-shop-detail/:id': {
      component: dynamicWrapper(app, ['info/consultation'], () =>
        import('../routes/Info/ConsultationShopDetail')
      ),
    },
    '/info/message': {
      component: dynamicWrapper(app, ['info/message'], () => import('../routes/Info/Message')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/forgetPwd': {
      component: dynamicWrapper(app, ['forgetPwd'], () => import('../routes/User/ForgetPwd')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
