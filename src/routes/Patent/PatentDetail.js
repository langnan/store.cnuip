import React from 'react';
import { connect } from 'dva';
import { Tabs, Row, Col, Spin, Icon, Table, message } from 'antd';
import PageHeader from '../../components/PageHeader';
import { patentTypeMap } from '../../models/patent/patentList';

import styles from './PatentDetail.less';

const { TabPane } = Tabs;

@connect(({ loading }) => ({
  loading: loading.effects['patentList/getPatentDetail'],
}))
export default class PatentDetail extends React.Component {
  state = {
    patentDetail: {},
    similarityPageNum: 1,
  };

  componentDidMount() {
    this.getPatentDetail();
  }

  fetchSimilarityInfo = (patentAn, params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/getPatentSimilarity',
      payload: {
        name: 'getSimilarityInfo',
        appNo: patentAn,
        ...params,
      },
      callback: res => {
        if (res.code === 0) {
          this.setState(state => {
            return {
              patentDetail: {
                ...state.patentDetail,
                similarityInfo: res.result,
              },
            };
          });
        } else {
          message.error(`获取专利相似度信息失败：${res.message}`);
        }
      },
    });
  };

  fetchQuoteInfo = (patentAn, params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/getPatentQuoteList',
      payload: {
        an: patentAn,
      },
      callback: res => {
        if (res.code === 0) {
          this.setState(state => {
            return {
              patentDetail: {
                ...state.patentDetail,
                citeInfo: res.result,
              },
            };
          });
        } else {
          message.error(`获取专利引证信息失败：${res.message}`);
        }
      },
    });
  };

  getPatentDetail = () => {
    const { dispatch, match } = this.props;
    const patentAn = match.params.an;
    // const patentAn = 'CN93103782.4';
    if (patentAn) {
      dispatch({
        type: 'patentList/getPatentDetail',
        payload: {
          an: patentAn,
        },
        callback: res => {
          if (res.code === 0) {
            this.setState({
              patentDetail: res.result,
            });
          } else {
            message.error(`获取专利详情失败：${res.message}`);
          }
        },
      });
      this.fetchSimilarityInfo(patentAn);
      this.fetchQuoteInfo(patentAn);
    }
  };

  render() {
    const { patentDetail, similarityPageNum } = this.state;
    const { loading } = this.props;
    const basicInfo = patentDetail.patentBase || {};
    const feeHistory = patentDetail.feeInfo || [];
    const lawStatus = patentDetail.legalstatusinfo || [];
    const tradeInfo = {
      transferinfo: patentDetail.transferinfo || [], // 专利转移
      exploitationinfo: patentDetail.exploitationinfo || [], // 实施许可
      preservationinfo: patentDetail.preservationinfo || [], // 质押保全
    };
    const citeInfo = patentDetail.citeInfo || {};
    console.log(citeInfo);
    const similarityInfo = patentDetail.similarityInfo || {};
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利管理',
      },
      {
        title: '专利列表',
        href: '/patent/list',
      },
      {
        title: '专利详情',
      },
    ];

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        {loading ? (
          <Spin
            size="large"
            className={styles.loader}
            indicator={<Icon type="loading" style={{ fontSize: 34 }} spin />}
          />
        ) : (
          <div className={styles.main}>
            <div className={styles.header}>
              <span className={styles.status}>{basicInfo.lastLegalStatus}</span>
              <span className={styles.title}>{basicInfo.ti}</span>
            </div>
            <Tabs
              defaultActiveKey="1"
              animated={false}
              tabBarStyle={{
                borderBottom: 'none',
                marginBottom: 20,
              }}
            >
              <TabPane tab="基本信息" key="1">
                <Row className={styles.basicInfoRow}>
                  <Col span={8}>专利类型：{patentTypeMap[basicInfo.sectionName]}</Col>
                  <Col span={8}>申请号：{basicInfo.an}</Col>
                  <Col span={8}>授权公告号：{basicInfo.pnm}</Col>
                </Row>
                <Row className={styles.basicInfoRow}>
                  <Col span={8}>专利保护年限：20年</Col>
                  <Col span={8}>申请日：{basicInfo.ad}</Col>
                  <Col span={8}>公告日：{basicInfo.pd}</Col>
                </Row>
                <Row className={styles.basicInfoRow}>
                  <Col span={8}>发明设计人：{basicInfo.pin}</Col>
                  <Col span={8}>申请人：{basicInfo.pa}</Col>
                  <Col span={8}>代理人：{basicInfo.agt}</Col>
                </Row>
                <Row className={styles.basicInfoRow}>
                  <Col span={8}>主分类号：{basicInfo.pic}</Col>
                  <Col span={8}>申请人地址：{basicInfo.ar}</Col>
                  <Col span={8}>代理机构：{basicInfo.agc}</Col>
                </Row>
                <div className={styles.spliter} />
                <div className={styles.paragraph}>
                  <span className={styles.paraDeco} />
                  <span className={styles.paraTitle}>摘要</span>
                  <p
                    className={styles.paraContent}
                    dangerouslySetInnerHTML={{ __html: basicInfo.ab }}
                  />
                </div>
                <div className={styles.spliter} />
                <div className={styles.paragraph}>
                  <span className={styles.paraDeco} />
                  <span className={styles.paraTitle}>权利要求</span>
                  <p
                    className={styles.paraContent}
                    dangerouslySetInnerHTML={{ __html: basicInfo.clm }}
                  />
                </div>
                <div className={styles.spliter} />
                <div className={styles.paragraph}>
                  <span className={styles.paraDeco} />
                  <span className={styles.paraTitle}>专利图片</span>
                  <div className={styles.imgListWrapper}>
                    <ul className={styles.imgList}>
                      {basicInfo.abPicPath && (
                        <li>
                          <img src={basicInfo.abPicPath} alt="专利图片" />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="缴费历史" key="2">
                <Table
                  rowKey="id"
                  dataSource={feeHistory}
                  pagination={false}
                  columns={[
                    {
                      title: '费用种类',
                      dataIndex: 'feeType',
                    },
                    {
                      title: '费用金额(单位: 元)',
                      dataIndex: 'fee',
                    },
                    {
                      title: '缴费人信息',
                      dataIndex: 'hkInfo',
                    },
                    {
                      title: '处理状态',
                      dataIndex: 'state',
                    },
                    {
                      title: '缴费日',
                      dataIndex: 'hkDate',
                    },
                  ]}
                />
              </TabPane>
              <TabPane tab="法律状态" key="3">
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: '法律状态变更日期',
                      dataIndex: 'strLegalStatusDay',
                    },
                    {
                      title: '法律状态',
                      dataIndex: 'strLegalStatus',
                    },
                    {
                      title: '法律状态变更内容',
                      dataIndex: 'strStatusInfo',
                      render: (text, record, index) => {
                        return <span dangerouslySetInnerHTML={{ __html: text }} />;
                      },
                    },
                  ]}
                  dataSource={lawStatus}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="交易信息" key="4">
                <div className={styles.tradeInfoContent}>
                  <div className={styles.tableTitle}>实施许可</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'ti',
                      },
                      {
                        title: '许可种类',
                        dataIndex: 'xukezhonglei',
                      },
                      {
                        title: '让与人',
                        dataIndex: 'rangyuren',
                      },
                      {
                        title: '受让人',
                        dataIndex: 'shourangren',
                      },
                      {
                        title: '当前受让',
                        dataIndex: 'currentAssignee',
                      },
                      {
                        title: '备案日',
                        dataIndex: 'beianri',
                      },
                      {
                        title: '变更日',
                        dataIndex: 'biangengri',
                      },
                      {
                        title: '解除日',
                        dataIndex: 'jiechuri',
                      },
                    ]}
                    dataSource={tradeInfo.exploitationinfo || []}
                    pagination={false}
                  />
                  <div className={styles.tableTitle}>质押保全</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'ti',
                      },
                      {
                        title: '质押保全类型',
                        dataIndex: 'type',
                      },
                      {
                        title: '出质人',
                        dataIndex: 'chuzhiren',
                      },
                      {
                        title: '质权人',
                        dataIndex: 'zhiquanren',
                      },
                      {
                        title: '当前质权人',
                        dataIndex: 'dangqianzqr',
                      },
                      {
                        title: '生效日',
                        dataIndex: 'shengxiaori',
                      },
                      {
                        title: '变更日',
                        dataIndex: 'biangengri',
                      },
                      {
                        title: '解除日',
                        dataIndex: 'jiechuri',
                      },
                    ]}
                    dataSource={tradeInfo.preservationinfo || []}
                    pagination={false}
                  />
                  <div className={styles.tableTitle}>专利转移</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'ti',
                      },
                      {
                        title: '转移信息类型',
                        dataIndex: 'type',
                      },
                      {
                        title: '变更前权利人',
                        dataIndex: 'beforeTransAp',
                      },
                      {
                        title: '变更后权利人',
                        dataIndex: 'afterTransAp',
                      },
                      {
                        title: '当前权利人',
                        dataIndex: 'currentAp',
                      },
                      {
                        title: '变更前地址',
                        dataIndex: 'beforeTransAddr',
                      },
                      {
                        title: '变更后地址',
                        dataIndex: 'afterTransAddr',
                      },
                      {
                        title: '当前地址',
                        dataIndex: 'currentAddr',
                      },
                      {
                        title: '生效日',
                        dataIndex: 'effectiveDate',
                      },
                    ]}
                    dataSource={tradeInfo.transferinfo || []}
                    pagination={false}
                  />
                </div>
              </TabPane>
              <TabPane tab="引证信息" key="5">
                <div className={styles.citeInfoContent}>
                  <div className={styles.tableTitle}>引证信息</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '申请号',
                        dataIndex: 'appNo',
                      },
                      {
                        title: '公开号',
                        dataIndex: 'pubNo',
                      },
                      {
                        title: '标题',
                        dataIndex: 'title',
                      },
                      {
                        title: '申请人',
                        dataIndex: 'assigneesName',
                        render: (ass, record) => ass && ass.join('，'),
                      },
                    ]}
                    dataSource={citeInfo.quoteData || []}
                    pagination={false}
                  />
                  <div className={styles.tableTitle}>被引证信息</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '申请号',
                        dataIndex: 'appNo',
                      },
                      {
                        title: '公开号',
                        dataIndex: 'pubNo',
                      },
                      {
                        title: '标题',
                        dataIndex: 'title',
                      },
                      {
                        title: '申请人',
                        dataIndex: 'assigneesName',
                        render: (ass, record) => ass && ass.join('，'),
                      },
                    ]}
                    dataSource={citeInfo.byQuoteData || []}
                    pagination={false}
                  />
                </div>
              </TabPane>
              <TabPane tab="相似度信息" key="6">
                <div className={styles.similarityInfoContent}>
                  <div className={styles.tableTitle}>相似度分析</div>
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'title',
                      },
                      {
                        title: '申请号',
                        dataIndex: 'appNo',
                        width: 200,
                      },
                      {
                        title: '公开号',
                        dataIndex: 'pubNo',
                        width: 200,
                      },
                      {
                        title: '申请人',
                        dataIndex: 'assigneesName',
                        render: (ass, record) => ass && ass.join('，'),
                      },
                      {
                        title: '相似度',
                        dataIndex: 'score',
                        width: 100,
                      },
                    ]}
                    dataSource={similarityInfo.data || []}
                    pagination={{
                      total: similarityInfo.total,
                      pageSize: 10,
                      current: similarityPageNum,
                      onChange: (pageIndex, pageSize) => {
                        this.setState({
                          similarityPageNum: pageIndex,
                        });
                        this.fetchSimilarityInfo(basicInfo.an, { pageIndex, pageSize });
                      },
                    }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    );
  }
}
