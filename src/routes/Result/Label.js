import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, notification } from 'antd';
import styles from '../System/ProjectSetting.less';
import PageHeader from '../../components/PageHeader';

const { Search } = Input;
const FormItem = Form.Item;
@connect(({ label, loading }) => ({
  label,
  submitting: loading.effects['label/saveLabel'],
  loading: loading.effects['label/getAll'],
}))
@Form.create()
export default class Label extends React.Component {
  componentDidMount() {
    this.getLabelList();
    this.editLabel({}, false);
  }

  // 查询标签列表
  getLabelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'label/getAll',
    });
  };

  // 模糊查询，传keyword调用后台接口
  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'label/search',
      payload: {
        query: value,
      },
    });
  };

  editLabel = (obj, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'label/setEditObject',
      payload: obj,
      flag,
    });
  };

  // 新增/修改
  doSubmit = () => {
    const {
      form,
      dispatch,
      label: { editObject, searchValue },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      searchValue.forEach(item => {
        if (item.name === values.name) {
          notification.error({
            message: '成果标签已被占用！',
          });
          err = true;
        }
      });
      if (editObject.id) {
        values.id = editObject.id;
      }
      if (!err) {
        form.resetFields();
        dispatch({
          type: 'label/saveLabel',
          payload: {
            label: values,
          },
          callback: res => {
            if (res.code === 0) {
              this.getLabelList();
            }
          },
        });
        this.editLabel({}, false);
      }
    });
  };

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'label/showModal',
      visible: true,
    });
  };

  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, label } = this.props;
    this.handleCancel();
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const params = {
        id: label.editObject.id,
      };
      dispatch({
        type: 'label/deleteLabel',
        payload: params,
        callback: res => {
          if (res.code === 0) {
            this.getLabelList();
          }
        },
      });
      this.editLabel({}, false);
    });
    form.resetFields();
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'label/showModal',
      visible: false,
    });
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '科技成果',
        href: '/result/',
      },
      {
        title: '成果标签',
      },
    ];
    const { label, loading, form } = this.props;

    const { getFieldDecorator } = form;

    const extraContent = (
      <div>
        <Search
          className={styles.bgColor}
          style={{ width: 250 }}
          placeholder="请输入标签名称查询"
          onSearch={this.search}
        />
      </div>
    );

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div>
        <Modal
          title="提示"
          visible={label.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>确定要删除吗？</p>
        </Modal>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col sm={6}>
            <Card
              bordered={false}
              style={{ width: 290 }}
              bodyStyle={{ padding: '30px 32px 40px 32px' }}
              extra={extraContent}
            >
              {loading && <Spin indicator={antIcon} className={styles.loader} />}

              {label.searchValue ? (
                label.searchValue.map(d => (
                  <div className={styles.projectItem} key={d.id}>
                    {d.name}
                    <a
                      onClick={() => {
                        this.editLabel(d, true);
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                    <Link to={`/result/tagsValue/${d.id}`}>
                      <Icon type="eye-o" />
                    </Link>
                  </div>
                ))
              ) : (
                <span>暂无列表！！！</span>
              )}
            </Card>
            <Card bordered={false} style={{ width: 290 }}>
              <Button
                type="primary"
                onClick={() => {
                  this.editLabel({}, false);
                }}
              >
                新增标签
              </Button>
              <Button style={{ float: 'right' }} type="primary">
                导入标签
              </Button>
            </Card>
          </Col>
          <Col sm={18}>
            <Card
              bordered={false}
              style={{ width: 900, minHeight: 540 }}
              bodyStyle={{ padding: '100px 0 0 200px' }}
            >
              <div>
                <Form>
                  <FormItem label="标签名称">
                    {getFieldDecorator('name', {
                      initialValue: label.editObject.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入标签名称',
                        },
                        {
                          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,8}$/,
                          message: '请输入不超过8位的字母、数字或汉字！',
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 250, height: 40 }}
                        size="large"
                        placeholder="请输入标签名称"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button
                      style={{ marginRight: 28 }}
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={() => {
                        this.doSubmit();
                      }}
                    >
                      {label.showEdit ? '确认修改' : '确认新增'}
                    </Button>
                    <Button
                      className={`${styles.buttonStyle} ${
                        label.showEdit ? styles.formShow : styles.formHide
                      }`}
                      type="primary"
                      onClick={this.showModal}
                    >
                      删除标签
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
