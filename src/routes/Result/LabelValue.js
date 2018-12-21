import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, notification } from 'antd';
import styles from '../System/ProjectSetting.less';
import PageHeader from '../../components/PageHeader';

const { Search } = Input;
const FormItem = Form.Item;
@connect(({ labelValue, loading }) => ({
  labelValue,
  loading: loading.effects['labelValue/getAll'],
}))
@Form.create()
export default class LabelValue extends React.Component {
  componentDidMount() {
    this.getLabelValueList();
  }

  // 查询标签列表
  getLabelValueList = () => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'labelValue/getAll',
      payload: {
        labelId: match.params.id,
      },
    });
  };

  // 模糊查询，传keyword调用后台接口
  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelValue/search',
      payload: {
        query: value,
      },
    });
  };

  editLabelValue = (obj, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelValue/setEditObject',
      payload: obj,
      flag,
    });
  };

  // 新增/修改
  doSubmit = () => {
    const {
      form,
      dispatch,
      labelValue: { editObject, searchValue },
      match,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      searchValue.forEach(item => {
        if (item.value === values.value) {
          notification.error({
            message: '成果标签值已被占用！',
          });
          err = true;
        }
      });
      if (editObject.id) {
        values.id = editObject.id;
      }
      values.labelId = match.params.id;
      if (!err) {
        form.resetFields();
        dispatch({
          type: 'labelValue/saveLabelValue',
          payload: {
            labelValue: values,
          },
          callback: res => {
            if (res.code === 0) {
              this.getLabelValueList();
            }
          },
        });
        this.editLabelValue({}, false);
      }
    });
  };

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelValue/showModal',
      visible: true,
    });
  };

  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, labelValue } = this.props;
    this.handleCancel();
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const params = {
        id: labelValue.editObject.id,
      };
      dispatch({
        type: 'labelValue/deleteLabelValue',
        payload: params,
        callback: res => {
          if (res.code === 0) {
            this.getLabelList();
          }
        },
      });
      this.editLabelValue({}, false);
    });
    form.resetFields();
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelValue/showModal',
      visible: false,
    });
  };

  render() {
    const { labelValue, loading, form } = this.props;
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
        href: '/result/tags',
      },
      {
        title: '标签值',
      },
    ];
    const { getFieldDecorator } = form;
    const extraContent = (
      <div>
        <Link
          to="/result/tags"
          style={{ color: 'black', marginRight: '88%', marginBottom: 14, cursor: 'pointer' }}
        >
          返回
        </Link>
        <Search
          className={styles.bgColor}
          style={{ width: 250 }}
          placeholder="请输入标签值名称查询"
          onSearch={this.search}
        />
      </div>
    );

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div>
        <Modal
          title="提示"
          visible={labelValue.visible}
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

              {labelValue.searchValue ? (
                labelValue.searchValue.map(d => (
                  <div className={styles.projectItem} key={d.id}>
                    {d.value}
                    <a
                      onClick={() => {
                        this.editLabelValue(d, true);
                      }}
                    >
                      <Icon type="edit" />
                    </a>
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
                  this.editLabelValue({}, false);
                }}
              >
                新增标签值
              </Button>
              <Button style={{ float: 'right' }} type="primary">
                导入标签值
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
                  <FormItem label="标签值名称">
                    {getFieldDecorator('value', {
                      initialValue: labelValue.editObject.value,
                      rules: [
                        {
                          required: true,
                          message: '请输入标签值名称',
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
                        placeholder="请输入标签值名称"
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
                      {labelValue.showEdit ? '确认修改' : '确认新增'}
                    </Button>
                    <Button
                      className={`${styles.buttonStyle} ${
                        labelValue.showEdit ? styles.formShow : styles.formHide
                      }`}
                      type="primary"
                      onClick={this.showModal}
                    >
                      删除标签值
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
