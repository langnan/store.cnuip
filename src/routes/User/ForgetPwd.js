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

@connect(({ forgetPwd, loading }) => ({
  forgetPwd,
  submitting: loading.effects['forgetPwd/submit'],
}))
@Form.create()
export default class forgetPwd extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentWillReceiveProps(nextProps) {
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('mail');
    if (nextProps.forgetPwd.status === 'ok') {
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
    if (form.getFieldsValue().phone && reg.test(form.getFieldsValue().phone)) {
      dispatch({
        type: 'forgetPwd/queryVerifyCode',
        payload: {
          phone: form.getFieldsValue().phone,
          action: 'FORGET',
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
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'forgetPwd/checkVerifyCode',
          payload: {
            action: 'FORGET',
            verifyCode: values.code,
            phone: values.phone,
          },
          callback: res => {
            if (res.code === 0) {
              dispatch({
                type: 'forgetPwd/submit',
                payload: {
                  ...values,
                },
                callback: resp => {
                  if (resp.code === 0) {
                    notification.success({
                      message: '已成功修改密码！',
                    });
                    dispatch(
                      routerRedux.push({
                        pathname: '/user/login',
                      })
                    );
                  }
                },
              });
            }
          },
        });
      }
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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, visible } = this.state;
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
        <h3 className={styles.title}>找回密码</h3>
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <InputGroup compact>
                {getFieldDecorator('phone', {
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
                  {getFieldDecorator('code', {
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
                })(<Input size="large" type="password" placeholder="请设置新密码" />)}
              </Popover>
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                完成
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
