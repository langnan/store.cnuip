import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress, notification } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, login, loading }) => ({
  register,
  login,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    orgs: [],
    orgId: undefined,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'register/fetchOrganizations',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('mail');
    if (nextProps.register.status === 'ok') {
      dispatch(
        routerRedux.push({
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form, dispatch } = this.props;
    const reg = /^1\d{10}$/;
    if (form.getFieldsValue().username && reg.test(form.getFieldsValue().username)) {
      dispatch({
        type: 'register/queryVerifyCode',
        payload: {
          phone: form.getFieldsValue().username,
          action: 'REGISTER',
        },
        callback: res => {
          if (res.code === 0) {
            let count = 59;
            this.setState({ count });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          }
        },
      });
    } else {
      notification.warn({
        message: '请输入有效的手机号码',
      });
    }
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { orgId, orgs } = this.state;
    let orgname;
    if (orgId) {
      orgs.forEach(ele => {
        if (ele.id === orgId) {
          orgname = ele.name;
        }
      });
    }
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/checkVerifyCode',
          payload: {
            action: 'REGISTER',
            verifyCode: values.verifyCode,
            phone: values.username,
          },
          callback: res => {
            if (res.code === 0) {
              this.checkIdCard(values.realName, values.idCardNo, () => {
                dispatch({
                  type: 'register/submit',
                  payload: {
                    ...values,
                    organizationId: orgId,
                    organizationName: orgname,
                  },
                  callback: resp => {
                    if (resp.code === 0) {
                      notification.success({
                        message: '已成功注册！',
                      });
                      dispatch(routerRedux.push('/user/login'));
                    }
                  },
                });
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
    });
  };

  // 检测身份证是否符合
  checkIdCard = (n, idCard, cb) => {
    fetch(`http://idcard.market.alicloudapi.com/lianzhuo/idcard?cardno=${idCard}&name=${n}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'APPCODE 4f37b927c50045b58742d50740c1cfae',
      },
    })
      .then(res => {
        if (res.ok) {
          res.json().then(obj => {
            if (obj.resp && obj.resp.code === 0) {
              cb();
            } else {
              notification.error({
                message: '姓名与身份证号不匹配',
              });
            }
          });
        }
      })
      .catch(e => {
        console.log('fetch fail', JSON.stringify(e));
      });
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  onProChange = proId => {
    const { register } = this.props;
    register.organizations.forEach(ele => {
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

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting, register } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, visible, orgs, orgId } = this.state;
    return (
      <div className={styles.registerBox}>
        <div className={`${styles.top} ${styles.clearfix}`}>
          <h3>
            <span>专利宝</span>
            <span>一站式高校专利运营、管理工具</span>
          </h3>
          <p>
            已有账号，
            <Link style={{ paddingRight: 10 }} className={styles.login} to="/user/login">
              马上登录
            </Link>
            |
            <Link style={{ paddingLeft: 10 }} className={styles.login} to="/">
              返回首页
            </Link>
          </p>
        </div>
        <h3 className={styles.title}>注册</h3>
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <Select
                showSearch
                style={{ width: 179 }}
                placeholder="选择省份"
                optionFilterProp="children"
                onChange={this.onProChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {register.organizations &&
                  register.organizations.map((org, index) => (
                    <Option key={`option-${org.id}`} value={org.id}>
                      {org.name}
                    </Option>
                  ))}
              </Select>
              <Select
                value={orgId}
                showSearch
                style={{ width: 179, marginLeft: 10 }}
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
            <FormItem>
              <InputGroup compact>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                })(<Input size="large" placeholder="请输入手机号" />)}
              </InputGroup>
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('verifyCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ],
                  })(<Input size="large" placeholder="验证码" />)}
                </Col>
                <Col span={8}>
                  <Button
                    size="large"
                    disabled={count}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem help={help}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(<Input size="large" type="password" placeholder="请设置密码" />)}
              </Popover>
            </FormItem>
            <FormItem>
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: '请输入真实姓名！',
                  },
                ],
              })(<Input size="large" placeholder="请输入真实姓名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('idCardNo', {
                rules: [
                  {
                    required: true,
                    message: '请输入身份证号码！',
                  },
                ],
              })(<Input size="large" placeholder="请输入身份证号码" />)}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
