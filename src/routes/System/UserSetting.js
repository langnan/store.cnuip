import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Input,
  Row,
  Col,
  Button,
  Icon,
  Spin,
  Form,
  Select,
  Tree,
  Upload,
  Modal,
  notification,
  DatePicker,
  Cascader,
  List,
  Pagination,
} from 'antd';
import CKEditor from 'react-ckeditor-component';
import moment from 'moment';
import styles from './UserSetting.less';
import PageHeader from '../../components/PageHeader';
import PictureWall from '../../components/Upload/PicturesWall';

const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const directionList = [
  { id: 1, name: '农业' },
  { id: 2, name: '林业' },
  { id: 3, name: '畜牧业' },
  { id: 4, name: '渔业' },
  { id: 5, name: '农、林、牧、渔服务业' },
  { id: 6, name: '煤炭开采和洗选业' },
  { id: 7, name: '洗选业' },
  { id: 8, name: '石油和天然气开采业' },
  { id: 9, name: '黑色金属矿采选业' },
  { id: 10, name: '有色金属矿采选业' },
  { id: 11, name: '非金属矿采选业' },
  { id: 12, name: '开采辅助活动' },
  { id: 13, name: '其他采矿业' },
  { id: 14, name: '农副食品加工业 ' },
  { id: 15, name: '食品制造业 ' },
  { id: 16, name: '酒、饮料和精制茶制造业' },
  { id: 17, name: '烟草制品业' },
  { id: 18, name: '纺织业' },
  { id: 20, name: ' 纺织服装、服饰业' },
  { id: 21, name: '皮革、毛皮、羽毛及其制品和制鞋业' },
  { id: 22, name: '木材加工和木、竹、藤、棕、草制品业 ' },

  { id: 23, name: '家具制造业 ' },
  { id: 24, name: '造纸和纸制品业 ' },
  { id: 25, name: '印刷和记录媒介复制业' },
  { id: 26, name: '文教、工美、体育和娱乐用品制造业 ' },
  { id: 27, name: '石油加工、炼焦和核燃料加工业' },
  { id: 28, name: '化学原料和化学制品制造业' },
  { id: 29, name: ' 医药制造业 ' },
  { id: 30, name: '化学纤维制造业' },
  { id: 31, name: '橡胶和塑料制品业' },
  { id: 32, name: '非金属矿物制品业 ' },
  { id: 33, name: '黑色金属冶炼和压延加工业' },
  { id: 34, name: ' 有色金属冶炼和压延加工业 ' },
  { id: 35, name: '金属制品业 通用设备制造业 ' },
  { id: 36, name: '专用设备制造业 汽车制造业' },
  { id: 37, name: '铁路、船舶、航空航天和其他运输设备制造业' },
  { id: 38, name: '电气机械和器材制造业' },
  { id: 39, name: '计算机、通信和其他电子设备制造业' },
  { id: 40, name: '仪器仪表制造业' },
  { id: 41, name: '其他制造业 ' },
  { id: 42, name: '废弃资源综合利用业' },
  { id: 43, name: '金属制品、机械和设备修理业' },

  { id: 44, name: '电力、热力生产和供应业' },
  { id: 45, name: '燃气生产和供应业' },
  { id: 46, name: '水的生产和供应业' },
  { id: 47, name: '房屋建筑业' },
  { id: 48, name: '土木工程建筑业' },
  { id: 49, name: '建筑安装业' },
  { id: 50, name: '建筑装饰和其他建筑业' },

  { id: 51, name: '电信、广播电视和卫星传输服务' },
  { id: 52, name: '互联网和相关服务' },
  { id: 53, name: '软件和信息技术服务业' },
  { id: 54, name: '机动车、电子产品和日用产品修理业' },
];
@connect(({ userSetting, loading }) => ({
  userSetting,
  loading: loading.effects['userSetting/getUserList'],
  regUserLoading: loading.effects['userSetting/getRegisterUser'],
}))
@Form.create()
export default class UserSetting extends React.Component {
  state = {
    searchValue: '',
    editUser: {
      powersName: '',
    },
  };

  componentDidMount() {
    this.getDepartmentList();
    this.getRoleList();
    this.getPowersList();
    this.getProjectList();
    this.getRegisterUser();
  }

  getUserList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getUserList',
      payload: params,
    });
  };

  getRegisterUser = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getRegisterUser',
      payload: params,
    });
  };

  getRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getRoleList',
      payload: {
        isDelete: 'NO',
        pageNum: 0,
        pageSize: 0,
      },
    });
  };

  getProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getProjectList',
      payload: {
        isDelete: 'NO',
      },
    });
  };

  getPowersList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getPowersList',
      payload: {
        isDelete: 'NO',
        pageSize: 0,
        pageNum: 0,
      },
    });
  };

  getDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getDepartmentList',
    });
  };

  // 部门归属
  getDepartmentCascader = (data, id) => {
    const option = [];
    for (const item in data) {
      // data.map(item => {
      if (data[item].children) {
        option.push(
          data[item].id === id
            ? {
                value: data[item].name,
                label: data[item].name,
                id: data[item].id,
              }
            : {
                value: data[item].name,
                label: data[item].name,
                id: data[item].id,
                children: this.getDepartmentCascader(data[item].children, id),
              }
        );
      } else {
        option.push({
          value: data[item].name,
          label: data[item].name,
          id: data[item].id,
        });
      }
    }
    return option;
  };

  // 获取cascader的value
  getDepartmentCascaderValue = (tree, target) => {
    let done = false;
    const path = [];

    function traverse(trees, targets) {
      for (let i = 0; i < trees.length; i += 1) {
        const node = trees[i];
        if (!done) {
          if (i > 0) {
            path.pop();
          }
          path.push(node.name);
          if (node.id === targets) {
            done = true;
            return;
          } else {
            const { children } = node;
            if (children) {
              traverse(children, targets);
            }
          }
        }
      }
      if (!done) {
        path.pop();
      }
    }
    traverse(tree, target);
    return path;
  };

  toDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/save',
      payload: {
        userList: [],
      },
    });
    this.setState({
      searchValue: '',
    });
  };

  editProject = (obj, flag) => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'userSetting/setEditObject',
      payload: obj,
      flag,
    });
  };

  // 模糊查询，传keyword调用后台接口
  search = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    this.setState({
      searchValue: value,
    });
    dispatch({
      type: 'userSetting/getUserList',
      payload: {
        realName: value,
        likeMode: 'ALL',
      },
    });
  };

  selectDepartment = (key, obj) => {
    const { form, dispatch, userSetting } = this.props;
    const { editObject } = userSetting;
    editObject.postName = '';
    form.resetFields(['postId']);
    editObject.departmentId = key.length !== 0 ? obj[obj.length - 1].id : '';
    editObject.departmentName = key.length !== 0 ? obj[obj.length - 1].value : '';
    this.selectPost(editObject.departmentId);
    const flag = userSetting.showEdit;
    dispatch({
      type: 'userSetting/setEditObject',
      payload: editObject,
      flag,
    });
  };

  selectPost = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getPostList',
      payload: {
        isDelete: 'NO',
        departmentId: id,
        pageNum: 0,
        pageSize: 0,
      },
    });
  };

  // 新增/修改
  doSubmit = () => {
    const {
      form,
      dispatch,
      userSetting: { editObject, postList },
    } = this.props;
    form.validateFields((err, values) => {
      const {
        editUser: { powersName },
      } = this.state;
      let pName = '';
      postList.forEach(e => {
        if (e.id === values.postId) {
          pName = e.name;
        }
      });

      const roles = [
        {
          id: values.roleId,
          name: values.roleName,
        },
      ];

      const newObj = {
        ...editObject,
        ...values,
        departmentId: editObject.departmentId,
        postId: values.postId,
        roles,
        teams: editObject.teams,
        postName: pName,
        birthday: values.birthday ? moment(values.birthday).format('YYYY-MM-DD') : null,
        imageUrl: values.imageUrl[0]
          ? values.imageUrl[0].response
            ? values.imageUrl[0].response[0].url
            : values.imageUrl[0].url
          : '',
        powersName,
        nickName: values.nickName,
        password: values.newPassword ? values.newPassword : values.password,
      };

      if (!editObject.id) {
        newObj.password = values.password;
      }
      // console.log(editObject,"000")
      // console.log(newObj,"11")
      // console.log(values.newPassword,"22")
      if (!err) {
        dispatch({
          type: 'userSetting/saveUser',
          payload: {
            user: newObj,
          },
          callback: res => {
            if (res.code === 0) {
              this.componentDidMount();
              this.editUser({}, false);
              form.resetFields();
            }
          },
        });
      }
    });
  };

  checkContent = (rule, value, callback) => {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(value)) {
      callback('您输入的手机号错误');
      return;
    }
    callback();
  };

  handleOk = e => {
    e.preventDefault();
    const { form, dispatch, userSetting } = this.props;

    this.handleCancel();
    const params = {
      id: userSetting.editObject.id,
      isDelete: userSetting.editObject.isDelete === 'YES' ? 'NO' : 'YES',
    };
    dispatch({
      type: 'userSetting/editUser',
      payload: params,
      callback: res => {
        if (res.code === 0) {
          this.toDepartment();
          this.editUser(params);
        }
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/showModal',
      visible: false,
    });
  };

  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/showModal',
      visible: true,
    });
  };

  editUser = (obj, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getUserByUserId',
      payload: obj,
      flag,
      callback: res => {
        if (res.code === 0) {
          const newResult = res.result;
          const arr = [];
          if (newResult.direction) {
            newResult.directions = newResult.direction.split(',');
            directionList.forEach(e => {
              newResult.directions.forEach(ele => {
                if (e.name === ele) {
                  arr.push(e);
                }
              });
            });
          }
          newResult.directions = arr;
          dispatch({
            type: 'userSetting/save',
            payload: {
              editObject: newResult,
            },
          });
        } else {
          notification.error({
            message: '获取用户详细信息失败！',
          });
        }
      },
    });
    if (flag) {
      this.selectPost(obj.departmentId);
    }
  };

  powersChange = (key, obj) => {
    this.setState({
      editUser: {
        powersName: obj.props.children,
      },
    });
  };

  updateIntroduction = e => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    editObject.introduction = e.editor.getData();
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  updateHonor = e => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    editObject.honor = e.editor.getData();
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  // 确定选择科研方向
  handleAddDirection = () => {
    const {
      dispatch,
      userSetting: { projectList, editObject },
      form,
    } = this.props;
    let hasExist = false;
    if (!editObject.directions) {
      editObject.directions = [];
    }
    editObject.directions.forEach(e => {
      if (e.id === editObject.directionId) {
        hasExist = true;
      }
    });
    if (hasExist) {
      notification.warn({
        message: '已选过该方向,请选择其他科研方向！',
      });
    } else {
      directionList.forEach(e => {
        if (e.id === editObject.directionId) {
          editObject.directions.push(e);
        }
      });
      const arr = [];
      editObject.directions.forEach(e => {
        arr.push(e.name);
      });
      editObject.direction = arr.join(',');
      dispatch({
        type: 'userSetting/save',
        payload: {
          editObject,
        },
      });
    }
  };

  handleChangeDirection = e => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    editObject.directionId = e;
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  // 删除科研方向
  handleDeleteDirection = index => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    const arr = [];
    editObject.directions.splice(index, 1);
    editObject.directions.forEach(e => {
      arr.push(e.name);
    });
    editObject.direction = arr.join(',');
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  // 确定选择项目组
  handleAddTeam = () => {
    const {
      dispatch,
      userSetting: { projectList, editObject },
      form,
    } = this.props;
    let hasExist = false;
    if (!editObject.teams) {
      editObject.teams = [];
    }
    editObject.teams.forEach(e => {
      if (e.id === editObject.teamId) {
        hasExist = true;
      }
    });
    if (hasExist) {
      notification.warn({
        message: '已选过该项目组,请选择其他项目组！',
      });
    } else {
      projectList.forEach(e => {
        if (e.id === editObject.teamId) {
          editObject.teams.push(e);
        }
      });
      dispatch({
        type: 'userSetting/save',
        payload: {
          editObject,
        },
      });
    }
  };

  handleChangeTeam = e => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    editObject.teamId = e;
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  // 删除项目组
  handleDeleteTeam = index => {
    const {
      dispatch,
      userSetting: { editObject },
    } = this.props;
    editObject.teams.splice(index, 1);
    dispatch({
      type: 'userSetting/save',
      payload: {
        editObject,
      },
    });
  };

  render() {
    const {
      loading,
      regUserLoading,
      userSetting,
      form,
      userSetting: { editObject },
    } = this.props;
    
    
    
    const { searchValue } = this.state;

    const { getFieldDecorator } = form;

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
        title: '用户设置',
      },
    ];

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    // 树
    const { TreeNode } = Tree;
    const DepartmentTreeNodes = data => {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id} nodeData={item}>
              {DepartmentTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} key={item.id} nodeData={item} />;
      });
    };
    const departmentSelect = (i, t) => {
      if (i.length > 0 && t.selectedNodes[0].props.nodeData.organizationId) {
        const departmentId = parseInt(i[0], 10);
        const departmentName = t.selectedNodes[0].props.nodeData.name;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.getUserList({
          departmentId,
          departmentName,
        });
      }
    };

    return (
      <div>
        <Modal
          title="提示"
          visible={userSetting.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{userSetting.editObject.isDelete === 'NO' ? '确定停用户吗' : '确定要启用户吗'}</p>
        </Modal>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col sm={6}>
            <div className={styles.left} style={{ width: 290 }}>
              <div
                className={userSetting.userList.length > 0 ? styles.show : styles.hide}
                style={{ marginBottom: 14, cursor: 'pointer' }}
                onClick={this.toDepartment}
              >
                返回
              </div>
              <Search
                className={styles.bgColor}
                style={{ width: 250 }}
                placeholder="请输入姓名查询"
                onChange={this.search}
                value={searchValue}
              />
              {loading && <Spin indicator={antIcon} className={styles.loader} />}

              {userSetting.userList.length > 0 ? (
                userSetting.userList[0].children.map(d => (
                  <div
                    className={styles.projectItem}
                    key={d.id}
                    title={d.realName + d.title + d.phone}
                  >
                    {(d.realName + d.title + d.phone).length > 5
                      ? `${(d.realName + d.title + d.phone).slice(0, 5)}...`
                      : d.realName - d.title - d.phone}
                    <a
                      onClick={() => {
                        this.editUser(d, true);
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                  </div>
                ))
              ) : (
                <Tree defaultExpandAll className="departmentTree" onSelect={departmentSelect}>
                  {DepartmentTreeNodes(userSetting.departmentList)}
                </Tree>
              )}
              {userSetting.userList && userSetting.userList.length > 0 ? (
                <div className={styles.pageStyle}>
                  <Pagination
                    size="small"
                    {...userSetting.userList[0].pagination}
                    onChange={page => {
                      this.getUserList({
                        pageNum: page,
                        departmentId: this.departmentId,
                        departmentName: this.departmentName,
                      });
                    }}
                  />
                </div>
              ) : null}
              <Button
                onClick={() => {
                  this.editUser({}, false);
                }}
                className={styles.buttonLeft}
                type="primary"
              >
                新增用户
              </Button>
              <Button className={styles.buttonRight} type="primary">
                导入用户
              </Button>
            </div>

            <div className={styles.leftBottom}>
              <div className={styles.userTitle}>注册用户信息列表</div>
              {regUserLoading && <Spin indicator={antIcon} className={styles.loader} />}

              {userSetting.userRegisterList.length &&
                userSetting.userRegisterList[0].children.map(d => (
                  <div className={styles.projectItem} key={d.id} title={d.realName + d.phone}>
                    {(d.realName + d.title + d.phone).length > 5
                      ? `${(d.realName + d.phone).slice(0, 5)}...`
                      : d.realName - d.title - d.phone}
                    <a
                      onClick={() => {
                        this.editUser(d, true);
                      }}
                    >
                      <Icon type="edit" />
                    </a>
                  </div>
                ))}

              {userSetting.userRegisterList && userSetting.userRegisterList.length > 0 ? (
                <div className={styles.pageStyle}>
                  <Pagination
                    size="small"
                    {...userSetting.userRegisterList[0].pagination}
                    onChange={page => {
                      this.getRegisterUser({
                        pageNum: page,
                      });
                    }}
                  />
                </div>
              ) : (
                <p>暂无数据</p>
              )}
            </div>
          </Col>
          <Col sm={18}>
            <div className={styles.right} style={{ width: 900, minHeight: 540 }}>
              <div>
                <Form>
                  <Row>
                    <Col span={8}>
                      <FormItem label="姓名:">
                        {getFieldDecorator('realName', {
                          initialValue: userSetting.editObject.realName,
                          rules: [
                            {
                              required: true,
                              message: '请输入姓名',
                            },
                          ],
                        })(
                          <Input
                            style={{ width: 163, height: 40 }}
                            size="small"
                            placeholder="请输入姓名"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="性别:">
                        {getFieldDecorator('sex', {
                          initialValue: userSetting.editObject.sex,
                        })(
                          <Select placeholder="选择性别" style={{ width: 163, height: 40 }}>
                            <Option value="女">女</Option>
                            <Option value="男">男</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="民族:">
                        {getFieldDecorator('nation', {
                          initialValue: userSetting.editObject.nation,
                        })(
                          <Input
                            style={{ width: 163, height: 40 }}
                            size="small"
                            placeholder="民族"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem label="籍贯:">
                        {getFieldDecorator('nativePlace', {
                          initialValue: userSetting.editObject.nativePlace,
                        })(
                          <Input
                            style={{ width: 163, height: 40 }}
                            size="small"
                            placeholder="请输入籍贯"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="出生日期:">
                        {getFieldDecorator('birthday', {
                          initialValue:
                            userSetting.editObject.birthday &&
                            userSetting.editObject.birthday.length > 0
                              ? moment(
                                  moment(userSetting.editObject.birthday).format('YYYY-MM-DD'),
                                  'YYYY-MM-DD'
                                )
                              : null,
                        })(
                          <DatePicker
                            placeholder="请选择出生日期"
                            style={{ width: 163, height: 40, background: '#f3f3fb' }}
                            size="large"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="昵称:">
                        {getFieldDecorator('nickName', {
                          initialValue: userSetting.editObject.nickName,
                        })(
                          <Input
                            style={{ width: 163, height: 40 }}
                            size="small"
                            placeholder="昵称"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="身份证号:">
                        {getFieldDecorator('idCardNo', {
                          initialValue: userSetting.editObject.idCardNo,
                        })(
                          <Input
                            style={{ width: 250, height: 40 }}
                            size="large"
                            placeholder="请输入身份证号"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="手机号码:">
                        {getFieldDecorator('phone', {
                          initialValue: userSetting.editObject.phone,
                          rules: [
                            {
                              required: true,
                              message: '请输入手机号',
                            },
                            {
                              validator: this.checkContent,
                            },
                          ],
                        })(
                          <Input
                            style={{ width: 250, height: 40 }}
                            size="small"
                            placeholder="请输入手机号码"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="绑定微信号:">
                        {getFieldDecorator('wchat', {
                          initialValue: userSetting.editObject.wchat,
                        })(
                          <Input
                            style={{ width: 250, height: 40 }}
                            size="small"
                            placeholder="请输入微信号码"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="归属部门:">
                        {getFieldDecorator('departmentId', {
                          initialValue: this.getDepartmentCascaderValue(
                            userSetting.departmentList,
                            userSetting.editObject.departmentId
                          ),
                          rules: [
                            {
                              required: true,
                              message: '请输入归属部门',
                            },
                          ],
                        })(
                          <Cascader
                            style={{ width: 250, height: 40, background: '#f3f3fb' }}
                            options={this.getDepartmentCascader(
                              userSetting.departmentList,
                              userSetting.editObject.departmentId
                            )}
                            placeholder="请选择归属部门"
                            expandTrigger="hover"
                            allowClear
                            onChange={(key, obj) => {
                              this.selectDepartment(key, obj);
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={12} lg={12}>
                      <FormItem label="归属岗位:">
                        {getFieldDecorator('postId', {
                          initialValue: userSetting.editObject.postId,
                          rules: [
                            {
                              required: true,
                              message: '请输入归属岗位',
                            },
                          ],
                        })(
                          <Select style={{ width: 250, height: 40 }} placeholder="请选择归属岗位">
                            <Select.Option value="">
                              {userSetting.postList && userSetting.postList.length > 0
                                ? '请选择岗位'
                                : '暂无岗位'}
                            </Select.Option>
                            {userSetting.postList &&
                              userSetting.postList.length > 0 &&
                              userSetting.postList.map(item => {
                                return (
                                  <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="归属角色:">
                        {getFieldDecorator('roleId', {
                          initialValue: userSetting.editObject.roles
                            ? userSetting.editObject.roles[0].id
                            : '请选择归属角色',
                          rules: [
                            {
                              required: true,
                              message: '请选择归属角色',
                            },
                          ],
                        })(
                          <Select
                            // placeholder=""
                            style={{ width: 250, height: 40, background: '#f3f3fb' }}
                          >
                            {userSetting.roleList.map(d => (
                              <Option value={d.id} key={d.id}>
                                {d.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="归属职级:">
                        {getFieldDecorator('powersId', {
                          initialValue: userSetting.editObject.powersId,
                          rules: [
                            {
                              required: true,
                              message: '请选择归属职级',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择归属职级"
                            style={{ width: 250, height: 40 }}
                            onChange={this.powersChange}
                          >
                            {userSetting.powersList.map(d => (
                              <Option value={d.id} key={d.id}>
                                {d.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="归属项目组:">
                        {getFieldDecorator('teamId', {
                          initialValue: '请选择归属项目组',
                        })(
                          <Select
                            placeholder="请选择归属项目组"
                            style={{ width: 250, height: 40 }}
                            onChange={this.handleChangeTeam}
                          >
                            {userSetting.projectList.map(d => (
                              <Option value={d.id} key={d.id}>
                                {d.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={this.handleAddTeam}
                        style={{
                          width: 59,
                          height: 40,
                          backgroundColor: '#f3f3fb',
                          fontSize: 25,
                          marginTop: 39,
                        }}
                      >
                        +
                      </Button>
                    </Col>
                  </Row>
                  <Row span={24}>
                    <FormItem label="已添加项目组:">
                      {userSetting.editObject &&
                        userSetting.editObject.teams &&
                        userSetting.editObject.teams.map((e, i) => {
                          return (
                            <Col key={e.id} span={8}>
                              <div className={styles.renderProjects}>
                                {e.name}
                                <a
                                  onClick={() => {
                                    this.handleDeleteTeam(i);
                                  }}
                                >
                                  <Icon type="close" style={{ fontSize: 14 }} />
                                </a>
                              </div>
                            </Col>
                          );
                        })}
                    </FormItem>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="证件照:">
                        {getFieldDecorator('imageUrl', {
                          initialValue: userSetting.editObject.imageUrl
                            ? [{ uid: 0, url: userSetting.editObject.imageUrl }]
                            : [],
                          valuePropName: 'fileList',
                          rules: [
                            {
                              required: true,
                              message: '请选择要上传的图片',
                            },
                          ],
                        })(<PictureWall maxCount={1} uploadTip="上传" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="科研方向:">
                        {getFieldDecorator('directionId', {
                          initialValue: directionList[0].name,
                          rules: [
                            {
                              required: true,
                              message: '请选择科研方向',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择科研方向"
                            style={{ width: 250, height: 40 }}
                            onChange={this.handleChangeDirection}
                          >
                            {directionList.map(d => (
                              <Option value={d.id} key={d.id}>
                                {d.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={this.handleAddDirection}
                        style={{
                          width: 59,
                          height: 40,
                          backgroundColor: '#f3f3fb',
                          fontSize: 25,
                          marginTop: 39,
                        }}
                      >
                        +
                      </Button>
                    </Col>
                  </Row>
                  <Row span={24}>
                    <FormItem label="已添加科研方向:">
                      {userSetting.editObject &&
                        userSetting.editObject.directions &&
                        userSetting.editObject.directions.map((e, i) => {
                          return (
                            <Col key={e.id} span={8}>
                              <div className={styles.renderProjects}>
                                {e.name}
                                <a
                                  onClick={() => {
                                    this.handleDeleteDirection(i);
                                  }}
                                >
                                  <Icon type="close" style={{ fontSize: 14 }} />
                                </a>
                              </div>
                            </Col>
                          );
                        })}
                    </FormItem>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="职称与头衔:">
                        {getFieldDecorator('title', {
                          initialValue: userSetting.editObject.title,
                          rules: [
                            {
                              required: true,
                              message: '请输入职称与头衔',
                            },
                          ],
                        })(
                          <Input
                            style={{ width: 250, height: 40 }}
                            size="small"
                            placeholder="请输入职称与头衔"
                          />
                        )}
                      </FormItem>
                    </Col>
                    {editObject.id ? (
                      <Col span={12}>
                        <FormItem label="更改登录密码:">
                          {getFieldDecorator('newPassword', {
                            initialValue: '',
                          })(
                            <Input
                              style={{ width: 250, height: 40 }}
                              size="small"
                              placeholder="请输入想要更改的密码"
                            />
                          )}
                        </FormItem>
                      </Col>
                    ) : (
                      <Col span={12}>
                        <FormItem label="登录密码:">
                          {getFieldDecorator('password', {
                            initialValue: userSetting.editObject.password,
                            rules: [
                              {
                                required: true,
                                message: '请输入登录密码',
                              },
                            ],
                          })(
                            <Input
                              style={{ width: 250, height: 40 }}
                              size="small"
                              placeholder="请输入登录密码"
                            />
                          )}
                        </FormItem>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem label="个人荣誉:">
                        {getFieldDecorator('honer', {
                          initialValue: userSetting.editObject.honor || '',
                        })(
                          <CKEditor
                            scriptUrl="https://cdn.bootcss.com/ckeditor/4.9.2/ckeditor.js"
                            content={userSetting.editObject.honor}
                            events={{
                              change: this.updateHonor,
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem label="个人简介:">
                        {getFieldDecorator('introduction', {
                          initialValue: userSetting.editObject.introduction || '',
                        })(
                          <CKEditor
                            scriptUrl="https://cdn.bootcss.com/ckeditor/4.9.2/ckeditor.js"
                            content={userSetting.editObject.introduction}
                            events={{
                              change: this.updateIntroduction,
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem>
                        <Button
                          style={{ marginRight: 28 }}
                          className={styles.buttonConfirm}
                          type="primary"
                          onClick={() => {
                            this.doSubmit();
                          }}
                        >
                          {userSetting.editObject.id ? '确认修改' : '确认新增'}
                        </Button>
                        <Button
                          className={`${styles.buttonDel} ${
                            userSetting.editObject.id ? styles.formShow : styles.formHide
                          }`}
                          type="primary"
                          htmlType="button"
                          onClick={this.showModal}
                        >
                          {userSetting.editObject.isDelete === 'NO' ? '停用用户' : '启用用户'}
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
