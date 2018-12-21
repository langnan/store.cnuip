import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '专利宝一站式高校专利运营、管理工具';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 专利宝一站式高校专利运营、管理工具`;
    }
    return title;
  }

  render() {
    const {
      routerData,
      match,
      location: { pathname },
    } = this.props;
    const copyright = (
      <Fragment>
        <p style={{ color: `${pathname === '/user/login' ? '#fff' : '#000'}` }}>
          Copyright <Icon type="copyright" /> 2018 Cnuip.com Inc All Right Reserved.
        </p>
        <p style={{ color: `${pathname === '/user/login' ? '#fff' : '#000'}` }}>
          南京中高知识产权股份有限公司 版权所有 &nbsp;&nbsp;&nbsp;&nbsp; 苏ICP备17052769号-1
        </p>
      </Fragment>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={`${styles.container} ${pathname === '/user/login' ? '' : styles.notLogin}`}>
          <div className={styles.content}>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
