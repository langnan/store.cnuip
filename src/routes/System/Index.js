import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { NavLink, Link } from 'dva/router';
import { getSysMenu } from '../../utils/authority';
import accountIcon from '../../assets/images/system/account-icon.png';
import authorityIcon from '../../assets/images/system/authority-icon.png';
import departmentIcon from '../../assets/images/system/department-icon.png';
import flowIcon from '../../assets/images/system/flow-icon.png';
import levelIcon from '../../assets/images/system/level-icon.png';
import postIcon from '../../assets/images/system/post-icon.png';
import projectSettingIcon from '../../assets/images/system/project-icon.png';
import userSettingIcon from '../../assets/images/system/user-icon.png';

import styles from './Index.less';

const srcPik = {
  account: accountIcon,
  authority: authorityIcon,
  department: departmentIcon,
  flow: flowIcon,
  level: levelIcon,
  post: postIcon,
  projectSetting: projectSettingIcon,
  userSetting: userSettingIcon,
};
export default class extends PureComponent {
  render() {
    const menu = JSON.parse(getSysMenu());
    return (
      <div className={styles.main}>
        <Row gutter={32}>
          {menu.slice(0, 4).map(ele => {
            return (
              <Col key={ele.id} className="gutter-row" span={6}>
                <NavLink to={ele.path} className={styles.card}>
                  <img
                    src={srcPik[`${ele.path.substring(ele.path.lastIndexOf('/') + 1)}`]}
                    className={styles.cardIcon}
                    alt={ele.title}
                  />
                  <h1 className={styles.cardTitle}>{ele.title}</h1>
                </NavLink>
              </Col>
            );
          })}
        </Row>
        <div className={styles.rowGutter} />
        <Row gutter={32}>
          {menu.length > 4 &&
            menu.slice(4, 8).map(ele => {
              return (
                <Col key={ele.id} className="gutter-row" span={6}>
                  <NavLink to={ele.path} className={styles.card}>
                    <img
                      src={srcPik[`${ele.path.substring(ele.path.lastIndexOf('/') + 1)}`]}
                      className={styles.cardIcon}
                      alt={ele.title}
                    />
                    <h1 className={styles.cardTitle}>{ele.title}</h1>
                  </NavLink>
                </Col>
              );
            })}
        </Row>
      </div>
    );
  }
}
