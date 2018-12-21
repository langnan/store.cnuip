import React from 'react';
import { connect } from 'dva';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, Pagination } from 'antd';
import styles from './ProjectSetting.less';
import PageHeader from '../../components/PageHeader';

const { Search } = Input;
const FormItem = Form.Item;
@connect(({ projectSetting, loading }) => ({
  projectSetting,
  submitting: loading.effects['projectSetting/saveProjectName'],
  loading: loading.effects['projectSetting/getAll'],
}))
@Form.create()
export default class ProjectSetting extends React.Component {
  state = {
    value: '',
    isHide: true,
  };

  componentDidMount() {
    this.getProjectList();
  }

  // 查询项目列表
  getProjectList = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectSetting/getAll',
      payload: {
        name: '',
        pageNum: page || '',
        likeMode: '',
      },
    });
  };

  goBack = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectSetting/getAll',
      payload: {
        name: '',
        pageNum: '',
        likeMode: '',
      },
    });
    this.setState({
      value: '',
      isHide: true,
    });
  };

  // 模糊查询，传keyword调用后台接口

  search = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    this.setState({
      value,
      isHide: false,
    });
    dispatch({
      type: 'projectSetting/getAll',
      payload: {
        name: value,
        pageNum: '',
        likeMode: 'ALL',
      },
    });
  };

  editProject = (obj, flag) => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'projectSetting/setEditObject',
      payload: obj,
      flag,
    });
  };

  // 新增/修改
  doSubmit = () => {
    const { form, dispatch, projectSetting } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (projectSetting.editObject.id) {
        values.id = projectSetting.editObject.id;
      }
      if (!err) {
        form.resetFields();
        dispatch({
          type: 'projectSetting/saveProjectName',
          payload: {
            project: values,
          },
          callback: res => {
            if (res.code === 0) {
              this.getProjectList();
            }
          },
        });
        this.editProject({}, false);
      }
    });
  };

  checkContent = (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!reg.test(value)) {
      callback('内容只允许输入中文、字母、数字和下划线');
      return;
    }
    callback();
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '系统设置',
        href: '/system',
      },
      {
        title: '项目设置',
      },
    ];
    const { projectSetting, loading, form } = this.props;

    const { getFieldDecorator } = form;

    const { value, isHide } = this.state;
    const extraContent = (
      <div>
        <div
          className={isHide ? styles.hide : styles.show}
          style={{ marginBottom: 14, width: 30, cursor: 'pointer' }}
          onClick={this.goBack}
        >
          返回
        </div>
        <Search
          className={styles.bgColor}
          style={{ width: 250 }}
          placeholder="请输入项目组名称查询"
          onChange={this.search}
          value={value}
        />
      </div>
    );

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div>
        {/* <Modal
          title="提示"
          visible={projectSetting.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>确定要删除吗？</p>
        </Modal> */}
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
              {projectSetting.list &&
                projectSetting.list.map(d => (
                  <div className={styles.projectItem} key={d.id} title={d.name}>
                    {d.name.length > 5 ? `${d.name.slice(0, 5)}...` : d.name}
                    <a
                      onClick={() => {
                        this.editProject(d, true);
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                  </div>
                ))}
              {projectSetting.list && projectSetting.list.length > 0 ? (
                <div className={styles.pageStyle}>
                  <Pagination
                    size="small"
                    {...projectSetting.pagination}
                    onChange={page => {
                      this.getProjectList(page);
                    }}
                  />
                </div>
              ) : (
                <span>暂无找到此项目！！！</span>
              )}
            </Card>
            <Card bordered={false} style={{ width: 290 }}>
              <Button
                type="primary"
                className={styles.buttonStyle}
                onClick={() => {
                  this.editProject({}, false);
                }}
              >
                新增项目组
              </Button>
              <Button className={styles.buttonStyle} style={{ float: 'right' }} type="primary">
                导入项目组
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
                  <FormItem label="项目组名称">
                    {getFieldDecorator('name', {
                      initialValue: projectSetting.editObject.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入项目名称',
                        },
                        {
                          validator: this.checkContent,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: 250, height: 40 }}
                        size="large"
                        placeholder="请输入项目组名称"
                      />
                    )}
                  </FormItem>
                  {/* <FormItem label="备注">
                    {getFieldDecorator('remark', {
                      initialValue: projectSetting.editObject.remark,
                    })(
                      <Input
                        style={{ width: 250, height: 40 }}
                        size="large"
                        placeholder="请输入备注"
                      />
                    )}
                  </FormItem> */}
                  <FormItem>
                    <Button
                      style={{ marginRight: 28 }}
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={() => {
                        this.doSubmit();
                      }}
                    >
                      {projectSetting.showEdit ? '确认修改' : '确认新增'}
                    </Button>
                    {/* <Button
                      className={`${styles.buttonStyle} ${
                        projectSetting.showEdit ? styles.formShow : styles.formHide
                      }`}
                      type="primary"
                      onClick={this.showModal}
                    >
                      删除项目组
                    </Button> */}
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
