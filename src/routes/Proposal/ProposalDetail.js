import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Select, Spin, Icon, Modal } from 'antd';
import moment from 'moment';
import styles from './Common.less';
import PageHeader from '../../components/PageHeader';

const categoryList = [
  {
    type: 'DOMESTIC',
    value: '国内专利',
  },
  {
    type: 'INTERNATIONAL',
    value: '国际专利',
  },
];

const patentTypeList = [
  {
    type: 'INVENTION',
    value: '发明专利',
  },
  {
    type: 'APPEARANCE',
    value: '外观专利',
  },
  {
    type: 'UTILITY',
    value: '实用新型',
  },
];

const sourceList = [
  {
    type: 'SELF_MADE',
    value: '自拟课题',
  },
  {
    type: 'PROJECT',
    value: '计划项目',
  },
  {
    type: 'HORIZONTAL',
    value: '横向课题',
  },
  {
    type: 'OTHER',
    value: '其它',
  },
];

@connect(({ proposalList, loading }) => ({
  proposalList,
  loading: loading.effects['proposalList/fetchCurrent'],
}))
@Form.create()
export default class extends React.Component {

  state = {
    visible: false,
    obj: {},
  };

  componentDidMount() {
    this.getCurrentAccount();
  }

  getCurrentAccount = () => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'proposalList/getPorposalDetail',
      payload: {
        processId: match.params.id,
      },
    });
  };

  filterType = (list, text) => {
    let val = '';
    list.forEach(n => {
      if (n.type === text) {
        val = n.value;
      }
    });
    return val;
  };

  handleRemark = (obj) => {
    Modal.info({
      title: '审核意见',
      content: (
        <div>
          <p>{obj.remark || '暂无！'}</p>
        </div>
      ),
      onOk() {},
      okText: '确定',
    });
    // this.setState({
    //   visible: true,
    //   remark,
    // })
  };

  handleOk = () => {

  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
      obj: {},
    })
  };

  render() {
    const {
      proposalList: { proposalDetail },
    } = this.props;
    const { visible, obj } = this.state;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '提案管理',
        href: '/proposal/',
      },
      {
        title: '提案列表',
        href: '/proposal/list',
      },
      {
        title: '查看提案',
      },
    ];
    const titleSpan = 4;
    const contentSpan = 20;
    const { loading } = this.props;
    console.log(proposalDetail);
    // const { detail } = process;

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        {loading && <Spin size="large" className={styles.loader} />}
        <div className={styles.main}>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>
                提案编号：
              </p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.no}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>提案名称：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.name}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>创建时间：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{moment(proposalDetail.createdTime).format('YYYY-MM-DD')}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>申请类别：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{this.filterType(categoryList, proposalDetail.category)}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>专列类型：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{this.filterType(patentTypeList, proposalDetail.patentType)}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>申请人：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.pa}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>发明人：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.pin}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>项目来源：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{this.filterType(sourceList, proposalDetail.source)}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>关联项目组：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.teamName}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>提案内容：</p>
            </Col>
            <Col span={contentSpan}>
              <p>{proposalDetail.content}</p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>技术交底书：</p>
            </Col>
            <Col span={contentSpan}>
              <p>
                {proposalDetail.processAttachmentList
                  ? proposalDetail.processAttachmentList.map(e => {
                      return (
                        <a key={e.id} href={e.url}>
                          附件下载{e.id}
                        </a>
                      );
                    })
                  : '无'}
              </p>
            </Col>
          </Row>
          <Row>
            <Col span={titleSpan}>
              <p className={styles.itemTitle}>专利申请书：</p>
            </Col>
            <Col span={contentSpan}>
              <p>
                {proposalDetail.processRequisitionList
                  ? proposalDetail.processRequisitionList.map(e => {
                      return (
                        <a key={e.id} href={e.url}>
                          附件下载{e.id}
                        </a>
                      );
                    })
                  : '无'}
              </p>
            </Col>
          </Row>
        </div>
        <div className={styles.list}>
          <div className={`${styles.processList} ${styles.clearfix}`}>
            <div className={`${styles.item} ${styles.start}`}>
              <div className={styles.userDiv}>开始</div>
            </div>
            {proposalDetail.processTaskVoList &&
              proposalDetail.processTaskVoList.length &&
              proposalDetail.processTaskVoList.map(ele => {
                if (ele.processTaskDepartmentVoList && ele.processTaskDepartmentVoList.length) {
                  return (
                    <div key={ele.id} className={`${styles.item}`}>
                      {ele.processTaskDepartmentVoList.map(e => {
                        return (
                          <div key={e.id}>
                            {e.processTaskUserList &&
                              e.processTaskUserList.map(e2 => {
                                return (
                                  <div
                                    className={`${styles.userDiv} ${
                                      e.processTaskUserList.length > 1 ? '' : styles.singleUserDiv
                                    }`}
                                    key={e2.id}
                                    title={e2.examinName}
                                    onClick={() => {
                                      this.handleRemark(e2)
                                    }}
                                  >
                                    {e2.examinName}{' '}
                                    <Icon
                                      className={styles.icons}
                                      type={
                                        e2.isExamined === 'NO'
                                          ? 'close'
                                          : e2.isExamined === 'YES'
                                            ? 'check'
                                            : ''
                                      }
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            <div className={`${styles.item} ${styles.end}`}>
              <div className={styles.userDiv}>结束</div>
            </div>
            <div
              className={`${styles.item} ${styles.normal} ${
                proposalDetail.tmplProcessVo &&
                proposalDetail.tmplProcessVo.tmplProcessPersonList &&
                proposalDetail.tmplProcessVo.tmplProcessPersonList.length > 1
                  ? ''
                  : styles.single
              }`}
            >
              {proposalDetail.personList &&
                proposalDetail.personList.map(e => {
                  return (
                    <div className={styles.userDiv} key={e.personId} title={e.personName}>
                      {e.personName}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <Modal
          title='审核意见'
          visible={visible}
          destroyOnClose
          maskClosable={false}
          onOk={this.handleOk}
          onCancel={this.handleModalCancel}
        >
          <p>审核意见：{obj.remark || '暂无！'}</p>
          <p style={{display: `${obj.remark ? '' : 'none'}`}}>审核时间：{moment(obj.updatedTime).format('YYYY-MM-DD')}</p>
        </Modal>
      </div>
    );
  }
}
