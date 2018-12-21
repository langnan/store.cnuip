import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Select, Checkbox, Alert, Icon, notification } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import UserLayoutStyles from '../../layouts/UserLayout.less';
import QR from '../../assets/images/login/QR.png';
import shan from '../../assets/images/login/shan.png';

const { Option } = Select;
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, global, loading }) => ({
  login,
  global,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    loginTypeEnum: 'PWD',
    orgs: [],
    orgId: undefined,
    active: '',
    active2: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/fetchOrganizations',
    });
    dispatch({
      type: 'global/fetchAllRoles',
      payload: {
        isDelete: 'NO',
        pageNum: 0,
        pageSize: 0,
      },
    });
  }

  onTabChange = loginTypeEnum => {
    this.setState({ loginTypeEnum });
  };

  onProChange = proId => {
    const { login } = this.props;
    login.organizations.forEach(ele => {
      if (ele.id === proId) {
        this.setState({
          orgs: ele.children,
          orgId: undefined,
        });
      }
    });
  };

  onOrgChange = orgId => {
    this.setState({ orgId });
  };

  handleSubmit = (err, values) => {
    const { loginTypeEnum, orgId } = this.state;
    if (!orgId && loginTypeEnum === 'PWD') {
      return notification.warn({
        message: '请选择所属高校！',
      });
    }
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/checkVerifyCode',
        payload: {
          ...values,
          action: 'LOGIN',
        },
        callback: res => {
          if (res.code === 0) {
            dispatch({
              type: 'login/login',
              payload: {
                ...values,
                loginTypeEnum,
                username: values.username ? values.username : values.phone,
                organizationId: loginTypeEnum === 'PWD' ? orgId : undefined,
              },
            });
          } else {
            notification.error({
              message: '验证码验证失败！',
              description: res.message,
            });
          }
        },
      });
    }
  };

  showQR = () => {
    const { active } = this.state;
    this.setState({
      active: active ? '' : 'active',
    });
  };

  showIntro = () => {
    const { active2 } = this.state;
    this.setState({
      active2: active2 ? '' : 'active',
    });
  };

  onGetCaptcha = (m, cb) => {
    const { dispatch } = this.props;
    if (m) {
      dispatch({
        type: 'login/queryVerifyCode',
        payload: {
          phone: m,
          action: 'LOGIN',
        },
        callback: res => {
          if (res.code === 0) {
            cb();
          }
        },
      });
    } else {
      notification.warn({
        message: '请输入手机号码',
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { loginTypeEnum, active, active2, orgs, orgId } = this.state;
    return (
      <div className={styles.mainBox}>
        <div onClick={this.showQR} className={styles.box1}>
          <div style={{ display: `${active ? 'block' : 'none'}` }}>
            <img src={QR} alt="" />
            <p>扫一扫 下载专利书包</p>
          </div>
        </div>
        <div onClick={this.showIntro} className={styles.box2}>
          <div style={{ display: `${active2 ? 'block' : 'none'}` }}>
            中国高校知识产权全流程管理系统，涵盖从专利申请、审批；专利及成果管理、专利价值分析以及高校科研人员知产报告的内容。
          </div>
        </div>
        <div className={styles.main}>
          <Login
            defaultActiveKey={loginTypeEnum}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
          >
            <Tab key="PWD" tab="密码登录">
              {login.status === 'error' &&
                login.loginTypeEnum === 'PWD' &&
                !submitting &&
                this.renderMessage(login.errorMessage)}
              <UserName name="username" placeholder="请输入用户名" />
              <Password name="password" placeholder="请输入密码" />
            </Tab>
            <Tab key="MSG" tab="验证码登录">
              {login.status === 'error' &&
                login.loginTypeEnum === 'MSG' &&
                !submitting &&
                this.renderMessage(login.errorMessage)}
              <Mobile name="phone" placeholder="请输入手机号码" />
              <Captcha
                onGetCaptcha={this.onGetCaptcha}
                name="verifyCode"
                placeholder="请输入验证码"
              />
            </Tab>
            <div style={{display: `${loginTypeEnum === 'PWD' ? 'block' : 'none'}`}}>
              <Select
                showSearch
                style={{ width: 150, height: 50 }}
                placeholder="选择省份"
                optionFilterProp="children"
                onChange={this.onProChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {login.organizations.map((org, index) => (
                  <Option key={`option-${org.id}`} value={org.id}>
                    {org.name}
                  </Option>
                ))}
              </Select>
              <Select
                value={orgId}
                showSearch
                style={{ width: 170, height: 50, marginLeft: 10 }}
                placeholder="选择高校"
                optionFilterProp="children"
                onChange={this.onOrgChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {orgs &&
                  orgs.map((org, index) => (
                    <Option key={`option-${org.id}`} value={org.id}>
                      {org.name}
                    </Option>
                  ))}
              </Select>
            </div>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}>
              <Link className={styles.forgetPwd} to="/user/forgetPwd">
                找回密码
              </Link>
              <Link className={styles.register} to="/user/register">
                去注册
              </Link>
            </div>
            {
              loginTypeEnum !== "PWD" && (
                <div style={{height: 50}} />
              )
            }
          </Login>
        </div>
      </div>
    );
  }
}
