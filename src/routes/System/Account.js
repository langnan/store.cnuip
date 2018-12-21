import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Select, Spin, message } from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from './Account.less';
import PictureWall from '../../components/Upload/PicturesWall';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  submitting: loading.effects['account/saveAccount'],
  loading: loading.effects['account/fetchCurrent'],
}))
@Form.create()
export default class extends React.Component {
  state = {
    isEditing: false,
  };

  componentDidMount() {
    this.getCurrentAccount();
  }

  getCurrentAccount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchCurrent',
    });
  };

  toggleEdit = isEditing => {
    this.setState({
      isEditing,
    });
  };

  saveAccount = e => {
    e.preventDefault();
    const { form, dispatch, account } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const params = {
        id: account.detail.id,
        ...fieldsValue,
      };
      console.log(params);
      let logoUrl;
      if (fieldsValue.logoUrl.length === 1) {
        const file = fieldsValue.logoUrl[0];
        if (file.response && file.response.length === 1) {
          logoUrl = file.response[0].url;
        } else {
          logoUrl = file.url;
        }
      }
      if (logoUrl) {
        params.logoUrl = logoUrl;
      }
      dispatch({
        type: 'account/saveAccount',
        payload: params,
        callback: res => {
          if (res.code === 0) {
            message.success('账号修改成功！');
            this.getCurrentAccount();
            this.toggleEdit(false);
          } else {
            message.error(`账号修改失败：${res.message}`);
          }
        },
      });
    });
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '系统管理',
        href: '/system',
      },
      {
        title: '账号设置',
      },
    ];
    const titleSpan = 2;
    const contentSpan = 22;
    const { submitting, loading, account, form } = this.props;
    const { isEditing } = this.state;
    const { detail } = account;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        {loading && <Spin size="large" className={styles.loader} />}
        {isEditing ? (
          <div className={styles.main}>
            <Form onSubmit={this.saveAccount}>
              <FormItem {...formItemLayout} label="LOGO">
                {getFieldDecorator('logoUrl', {
                  initialValue: detail.logoUrl ? [{ uid: 0, url: detail.logoUrl }] : [],
                  valuePropName: 'fileList',
                  rules: [
                    {
                      required: true,
                      message: '请上传头像',
                    },
                  ],
                })(<PictureWall maxCount={1} uploadTip="上传" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="账号名称">
                {getFieldDecorator('name', {
                  initialValue: detail.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入账号名称',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="联系地址">
                {getFieldDecorator('address', {
                  initialValue: detail.address,
                  rules: [
                    {
                      required: true,
                      message: '请输入联系地址',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="联系人">
                {getFieldDecorator('contact', {
                  initialValue: detail.contact,
                  rules: [
                    {
                      required: true,
                      message: '请输入联系人',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="联系电话">
                {getFieldDecorator('phone', {
                  initialValue: detail.phone,
                  rules: [
                    {
                      required: true,
                      message: '请输入联系电话',
                    },
                    {
                      pattern: /^\d{8,}$/,
                      message: '电话号码至少为8位数字',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="曾用名">
                {getFieldDecorator('usedNames', {
                  initialValue: detail.usedNames ? detail.usedNames.filter(n => n.length > 0) : [],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="选择或新建标签"
                    onChange={() => {}}
                    tokenSeparators={[',', '，', ';', '；']}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="科研方向">
                {getFieldDecorator('directions', {
                  initialValue: detail.directions ? detail.directions : [],
                  rules: [
                    {
                      required: true,
                      message: '请输入科研方向',
                    },
                  ],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="选择或新建标签"
                    onChange={() => {}}
                    tokenSeparators={[',', '，', ';', '；']}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="简介">
                {getFieldDecorator('introduction', {
                  initialValue: detail.introduction,
                  rules: [
                    {
                      required: true,
                      message: '请输入简介',
                    },
                  ],
                })(
                  <Input.TextArea
                    className={styles.textArea}
                    autosize={{ minRows: 2, maxRows: 8 }}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="荣誉">
                {getFieldDecorator('honor', {
                  initialValue: detail.honor,
                  rules: [
                    {
                      required: true,
                      message: '请输入荣誉',
                    },
                  ],
                })(
                  <Input.TextArea
                    className={styles.textArea}
                    autosize={{ minRows: 2, maxRows: 4 }}
                  />
                )}
              </FormItem>
              <FormItem style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  className={styles.bottomBtn}
                  htmlType="submit"
                  loading={submitting}
                >
                  保存
                </Button>
              </FormItem>
            </Form>
          </div>
        ) : (
          <div className={styles.main}>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle} style={{ lineHeight: '32px' }}>
                  LOGO：
                </p>
              </Col>
              <Col span={contentSpan}>
                <img className={styles.itemLogo} src={detail.logoUrl} height={44} alt="logo" />
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>账号名称：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.name}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>联系地址：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.address}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>联系人：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.contact}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>联系电话：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.phone}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>曾用名：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.usedNames && detail.usedNames.join('，')}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>科研方向：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.directions && detail.directions.join('，')}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>简介：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.introduction}</p>
              </Col>
            </Row>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle}>荣誉：</p>
              </Col>
              <Col span={contentSpan}>
                <p>{detail.honor}</p>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    className={styles.bottomBtn}
                    onClick={() => {
                      this.toggleEdit(true);
                    }}
                  >
                    修改
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}
