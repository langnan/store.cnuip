import React from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Row,
  Col,
  Button,
  notification,
  Spin,
  Form,
  Modal,
  Tree,
  Checkbox,
} from 'antd';

import styles from './Authority.less';
import PageHeader from '../../components/PageHeader';
import Empty from './Empty';

const { Search } = Input;
const FormItem = Form.Item;

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects['authority/fetchCurrent'],
  listLoading: loading.effects['authority/getAllAuthority'],
}))
@Form.create()
export default class extends React.Component {
  componentDidMount() {
    this.getAuthorityList();
    this.getAllAuthority();
  }

  getAuthorityList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/fetchCurrent',
    });
  };

  getAllAuthority = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/getAllAuthority',
    });
  };

  addAuthority = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'authority/editAuthority',
      payload: {},
      flag: false,
      showEmpty: false,
    });
    this.getAllAuthority();
    form.resetFields();
  };

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/showModal',
      visible: true,
    });
  };

  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, authority } = this.props;
    this.handleCancel();
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (authority.editObject.id) {
        fieldsValue.id = authority.editObject.id;
      }
      form.resetFields();
      const params = {
        ...fieldsValue,
      };
      dispatch({
        type: 'authority/deleteRole',
        payload: params,
        callback: res => {
          const response = JSON.parse(res);
          if (response.code === 0) {
            notification.success({
              message: '删除角色成功！',
            });
            this.getAuthorityList();
          } else {
            notification.error({
              message: '删除角色出错！',
              description: response.message,
            });
          }
        },
      });
      this.addAuthority();
      this.getAllAuthority();
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/showModal',
      visible: false,
    });
  };

  onSubmit = () => {
    const { authority, dispatch, form } = this.props;
    const obj = {};
    const newAuthorityVos = [];
    authority.editObject.authorityVos.forEach(ele => {
      if (ele.is_checked && !ele.children) {
        newAuthorityVos.push({ id: ele.id });
      }
      if (ele.children) {
        const parent = ele;
        parent.children.forEach(ee => {
          if (ee.is_checked) {
            newAuthorityVos.push({ id: ee.id });
          }
        });
      }
    });
    if (!newAuthorityVos.length) {
      notification.warning({
        message: '至少选择一项权限！',
      });
      return;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      Object.assign(obj, authority.editObject, { authorityVos: newAuthorityVos }, fieldsValue);
      dispatch({
        type: 'authority/saveEdit',
        payload: obj,
      });
      this.addAuthority();
    });
  };

  search = e => {
    const { dispatch } = this.props;
    if (e) {
      dispatch({
        type: 'authority/search',
        payload: {
          query: e,
        },
      });
    } else {
      this.getAuthorityList();
      this.getAllAuthority();
    }
  };

  render() {
    const extraContent = (
      <div>
        <Search style={{ width: 250 }} placeholder="请输入管理组名称查询" onSearch={this.search} />
      </div>
    );

    const { form } = this.props;

    const { getFieldDecorator } = form;

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
        title: '权限设置',
      },
    ];

    const { authority, loading } = this.props;

    const authorityVosObj = {
      authorityVos: authority.authorityVos,
    };

    const changeCheck = (parent, child, checked) => {
      let flag = true;
      if (!authority.editObject.id) {
        authority.editObject = Object.assign(authority.editObject, authorityVosObj);
        flag = false;
      }
      const { dispatch } = this.props;
      if (parent.id === child.id) {
        parent.is_checked = !checked;
      } else {
        authority.editObject.authorityVos.forEach(item => {
          if (item.id === parent.id) {
            const ii = item;
            ii.children.forEach(t => {
              if (t.id === child.id) {
                t.is_checked = !checked;
              }
            });
          }
        });
      }
      dispatch({
        type: 'authority/editAuthority',
        payload: authority.editObject,
        flag,
      });
    };

    // 树
    const { TreeNode } = Tree;
    const RenderTreeNodes = data => {
      return data.map(item => {
        return <TreeNode title={item.name} key={item.id} nodeData={item} />;
      });
    };
    const onSelect = (i, t) => {
      if (i.length > 0) {
        const { dispatch } = this.props;
        dispatch({
          type: 'authority/fetchEdit',
          payload: {
            id: t.selectedNodes[0].key,
            subAuthorityVos: {
              authorityVos: authority.authorityVos,
            },
          },
          flag: true,
          showEmpty: false,
        });
      }
    };

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Modal
          title="提示"
          visible={authority.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>是否确定保存?</p>
        </Modal>
        <Row>
          <Col sm={6}>
            <Card
              bordered={false}
              style={{ width: 290 }}
              bodyStyle={{ padding: '30px 32px 40px 32px' }}
              extra={extraContent}
            >
              {loading && <Spin style={{ margin: '0 auto', display: 'block' }} size="large" />}
              <Tree defaultExpandAll className="departmentTree" onSelect={onSelect}>
                {RenderTreeNodes(authority.result.list)}
              </Tree>
            </Card>
            <Card bordered={false} style={{ width: 290 }} bodyStyle={{ paddingTop: '0' }}>
              <Button
                onClick={() => {
                  this.addAuthority();
                }}
                className={styles.buttonStyle}
                style={{ float: 'none', margin: '0 auto', display: 'block' }}
                type="primary"
              >
                新增管理组
              </Button>
            </Card>
          </Col>
          <Col sm={16}>
            {!authority.result.list.length && authority.showEmpty ? (
              <Empty title="管理组" onClick={this.addAuthority} />
            ) : (
              <Card
                bordered={false}
                style={{ paddingTop: 95, width: 900 }}
                bodyStyle={{ padding: '0 0 40px 195px' }}
              >
                <div>
                  <Form>
                    <FormItem>
                      <p>管理组名称</p>
                      {getFieldDecorator('name', {
                        initialValue: authority.editObject.name,
                        rules: [
                          {
                            required: true,
                            message: '请输入管理组名称',
                          },
                        ],
                      })(<Input style={{ width: 250, height: 40 }} size="large" />)}
                    </FormItem>
                    <FormItem>
                      <Row gutter={24}>
                        <Col lg={18}>
                          <div>
                            <p className={styles.p}>管理组权限：</p>
                          </div>
                          {authority.editObject &&
                          authority.editObject.authorityVos &&
                          authority.editObject.authorityVos.length
                            ? authority.editObject.authorityVos.map((item, index) => {
                                return (
                                  <Col className={styles.aItem} lg={24} key={item.id}>
                                    <h3>{item.title}</h3>
                                    <div className={styles.item}>
                                      <Row gutter={24}>
                                        {item.children &&
                                          item.children.length &&
                                          item.children.map(sub => {
                                            return (
                                              <div key={sub.id}>
                                                <Col lg={6}>
                                                  <Checkbox
                                                    className={styles.checkBox}
                                                    name={sub.name}
                                                    checked={sub.is_checked}
                                                    value={sub.name}
                                                    id={`${sub.id}`}
                                                    onChange={e => {
                                                      changeCheck(item, sub, sub.is_checked);
                                                    }}
                                                  >
                                                    {sub.title}
                                                  </Checkbox>
                                                </Col>
                                              </div>
                                            );
                                          })}
                                        {!item.children ? (
                                          <div key={item.id}>
                                            <Col lg={6}>
                                              <Checkbox
                                                className={styles.checkBox}
                                                name={item.name}
                                                checked={item.is_checked}
                                                value={item.name}
                                                id={`${item.id}`}
                                                onChange={e => {
                                                  changeCheck(item, item, item.is_checked);
                                                }}
                                              >
                                                {item.title}
                                              </Checkbox>
                                            </Col>
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                      </Row>
                                    </div>
                                    {index === authority.authorityVos.length - 1 ? (
                                      <div className={styles.line} />
                                    ) : null}
                                  </Col>
                                );
                              })
                            : authority.authorityVos.map((item, index) => {
                                return (
                                  <Col className={styles.aItem} lg={24} key={item.id}>
                                    <h3>{item.title}</h3>
                                    <div className={styles.item}>
                                      <Row gutter={24}>
                                        {item.children &&
                                          item.children.length &&
                                          item.children.map(sub => {
                                            return (
                                              <div key={sub.id}>
                                                <Col lg={6}>
                                                  <Checkbox
                                                    className={styles.checkBox}
                                                    name={sub.name}
                                                    checked={sub.is_checked}
                                                    value={sub.name}
                                                    id={`${sub.id}`}
                                                    onChange={e => {
                                                      changeCheck(item, sub, sub.is_checked);
                                                    }}
                                                  >
                                                    {sub.title}
                                                  </Checkbox>
                                                </Col>
                                              </div>
                                            );
                                          })}
                                        {!item.children ? (
                                          <div key={item.id}>
                                            <Col lg={6}>
                                              <Checkbox
                                                className={styles.checkBox}
                                                name={item.name}
                                                checked={item.is_checked}
                                                value={item.name}
                                                id={`${item.id}`}
                                                onChange={e => {
                                                  changeCheck(item, item, item.is_checked);
                                                }}
                                              >
                                                {item.title}
                                              </Checkbox>
                                            </Col>
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                      </Row>
                                    </div>
                                    {index === authority.authorityVos.length - 1 ? (
                                      <div className={styles.line} />
                                    ) : null}
                                  </Col>
                                );
                              })}
                        </Col>
                      </Row>
                    </FormItem>
                    <br />
                    <FormItem style={{ textAlign: 'center' }}>
                      <Button
                        style={{ marginRight: 28 }}
                        className={styles.buttonStyle}
                        type="primary"
                        disabled={authority.showEdit && authority.editObject.name === 'ROLE_ADMIN'}
                        onClick={() => {
                          this.onSubmit();
                        }}
                      >
                        确认{authority.showEdit ? '修改' : '新增'}
                      </Button>
                      <Button
                        className={`${styles.buttonStyle} ${
                          authority.showEdit ? styles.show : styles.hide
                        }`}
                        disabled={authority.showEdit && authority.editObject.name === 'ROLE_ADMIN'}
                        onClick={this.showModal}
                        type="primary"
                      >
                        删除管理组
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
