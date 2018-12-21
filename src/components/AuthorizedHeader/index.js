import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';

class AuthorizedHeader extends PureComponent {
  constructor(props) {
    super(props);
    const { pathname } = props.location;
    let currentMenuKey = '/retrieval/favorite';
    if (pathname && pathname !== '/') {
      currentMenuKey = pathname;
    }
    this.state = {
      current: currentMenuKey,
    };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { currentUser = {}, isMobile, logo, onMenuClick, menus } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {isMobile && [
            <Link to="/" className={styles.logo} key="logo">
              <img src={logo} alt="logo" width="32" />
            </Link>,
            <Divider type="vertical" key="line" />,
          ]}
          <div className={styles.left}>
            <img className={styles.navLogo} src={logo} alt="logo" height="32" />
          </div>
          <div className={styles.navBar}>
            <Menu
              mode="horizontal"
              style={{ lineHeight: '64px', backgroundColor: 'transparent', color: '#fff' }}
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
            >
              {menus &&
                menus.map((menu, i) => {
                  if (menu.children && menu.children.length > 0) {
                    return (
                      <Menu.SubMenu key={menu.path} title={menu.title}>
                        {menu.children.map((subMenu, j) => {
                          return (
                            <Menu.Item key={subMenu.path}>
                              {/^http(s)*:\/\//.test(subMenu.path) ? (
                                <a href={subMenu.path}>{subMenu.title}</a>
                              ) : (
                                <Link to={subMenu.path}>{subMenu.title}</Link>
                              )}
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item key={menu.path}>
                        {/^http(s)*:\/\//.test(menu.path) ? (
                          <a href={menu.path}>{menu.title}</a>
                        ) : (
                          <Link to={menu.path}>{menu.title}</Link>
                        )}
                      </Menu.Item>
                    );
                  }
                })}
            </Menu>
          </div>
          <div className={styles.right}>
            {currentUser.realName ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} src={currentUser.imageUrl} />
                  <span className={styles.name}>{currentUser.realName}</span>
                </span>
              </Dropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AuthorizedHeader);
