import React from 'react';
import { connect } from 'dva';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, notification } from 'antd';

import styles from './Level.less';
import PageHeader from '../../components/PageHeader';

const { Search } = Input;
const FormItem = Form.Item;

@connect(({ level, loading }) => ({
  level,
  loading: loading.effects['level/fetchCurrent'],
}))
@Form.create()
export default class extends React.Component {
  componentDidMount() {
    this.getLevelList();
  }

  getLevelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'level/fetchCurrent',
    });
  };

  editLevel = (obj, flag) => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'level/save',
      payload: {
        editObject: obj,
        showEdit: flag,
      },
    });
  };

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'level/showModal',
      visible: true,
    });
  };

  doSubmit = () => {
    const { form, dispatch, level } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (level.editObject.id) {
        fieldsValue.id = level.editObject.id;
      }
      const { name } = fieldsValue;
      const params = {
        ...level.editObject,
        name,
      };
      dispatch({
        type: 'level/saveLevel',
        payload: params,
        callback: res => {
          if (res.code === 0) {
            notification.success({
              message: `${level.editObject.id ? '编辑' : '新增'}职级成功！`,
            });
            this.getLevelList();
          } else {
            notification.error({
              message: `${level.editObject.id ? '编辑' : '新增'}职级出错！`,
              description: res.message,
            });
          }
        },
      });
      this.editLevel({}, false);
      form.resetFields();
    });
  };

  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, level } = this.props;
    this.handleCancel();
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const params = {
        id: level.editObject.id,
      };
      dispatch({
        type: 'level/deleteLevel',
        payload: params,
        callback: res => {
          const response = JSON.parse(res);
          if (response.code === 0) {
            notification.success({
              message: '删除职级成功！',
            });
            this.getLevelList();
          } else {
            notification.error({
              message: '删除职级出错！',
              description: response.message,
            });
          }
        },
      });
      this.editLevel({}, false);
    });
    form.resetFields();
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'level/showModal',
      visible: false,
    });
  };

  search = e => {
    const { dispatch } = this.props;
    if (e) {
      dispatch({
        type: 'level/search',
        payload: {
          query: e,
        },
      });
    } else {
      this.getLevelList();
    }
  };

  render() {
    const extraContent = (
      <div>
        <Search
          style={{ width: 250 }}
          placeholder="请输入审核权限名称查询"
          onSearch={this.search}
        />
      </div>
    );

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
        title: '审核权限',
      },
    ];

    const { level, loading, form } = this.props;

    const { getFieldDecorator } = form;

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Modal
          title="提示"
          visible={level.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>是否删除该内容?</p>
        </Modal>
        <Row>
          <Col sm={6}>
            <Card
              bordered={false}
              style={{ width: 290 }}
              bodyStyle={{ padding: '30px 32px 40px 32px' }}
              extra={extraContent}
            >
              <div
                className={styles.noScroll}
                style={{ height: 500, overflowY: 'scroll', overflowX: 'hidden' }}
              >
                {loading && <Spin style={{ margin: '0 auto', display: 'block' }} size="large" />}
                {level.result &&
                  level.result.list &&
                  level.result.list.map(d => (
                    <div className={styles.level} key={d.id}>
                      {d.name}
                      <a
                        onClick={() => {
                          this.editLevel(d, true);
                        }}
                      >
                        <Icon type="edit" />
                      </a>
                    </div>
                  ))}
              </div>
            </Card>
            <Card bordered={false} style={{ width: 290 }} bodyStyle={{ paddingTop: '0' }}>
              <Button
                onClick={() => {
                  this.editLevel({ name: '' }, false);
                }}
                className={styles.buttonStyle}
                type="primary"
              >
                新增审核权限
              </Button>
              <Button className={styles.buttonStyle} style={{ float: 'right' }} type="primary">
                导入审核权限
              </Button>
            </Card>
          </Col>
          <Col sm={18}>
            <Card
              bordered={false}
              style={{ paddingTop: 95, width: 900 }}
              bodyStyle={{ padding: '0 32px 40px 195px' }}
            >
              <div>
                <Form>
                  <FormItem>
                    <p>职级名称</p>
                    {getFieldDecorator('name', {
                      initialValue: level.editObject.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入职级名称',
                        },
                        {
                          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,15}$/,
                          message: '请输入不超过15位的字母、数字或汉字！',
                        },
                      ],
                    })(<Input style={{ width: 250, height: 40 }} size="large" />)}
                  </FormItem>
                  <br />
                  <FormItem style={{ textAlign: 'center' }}>
                    <Button
                      style={{ marginRight: 28 }}
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={() => {
                        this.doSubmit();
                      }}
                    >
                      确认{level.showEdit ? '修改' : '新增'}
                    </Button>
                    <Button
                      className={`${styles.buttonStyle} ${
                        level.showEdit ? styles.show : styles.hide
                      }`}
                      type="primary"
                      onClick={this.showModal}
                    >
                      删除审核权限
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
