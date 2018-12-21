import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Card, Spin } from 'antd';
import bg from '../../assets/images/result/bg.png';
import styles from './Common.less';
import PageHeader from '../../components/PageHeader';

const maturityList = [
  {
    id: 1,
    type: 'SAMPLE',
    value: '已有样品',
  },
  {
    id: 2,
    type: 'SMALL_TEST',
    value: '通过小试',
  },
  {
    id: 3,
    type: 'PILOT_TEST',
    value: '通过中试',
  },
  {
    id: 4,
    type: 'BATCH_PRODUCTION',
    value: '可以量产',
  },
];

@connect(({ result, loading }) => ({
  result,
  loading: loading.effects['result/getResultDetail'],
}))
@Form.create()
export default class extends React.Component {
  componentDidMount() {
    this.getCurrentDetail();
  }

  getCurrentDetail = () => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'result/getResultDetail',
      payload: {
        resultId: match.params.id,
      },
    });
  };

  filterMaturity = text => {
    let value1 = '';
    maturityList.forEach(ele => {
      if (ele.type === text) {
        const { value } = ele;
        value1 = value;
      }
    });
    return value1;
  };

  render() {
    const {
      result: { resultDetail },
    } = this.props;
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
        title: '成果列表',
        href: '/result/list',
      },
      {
        title: '成果详情',
      },
    ];
    const titleSpan = 24;

    const { loading } = this.props;

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        {loading && <Spin size="large" className={styles.loader} />}
        <div className={styles.mainBox}>
          <div className={styles.main} style={{ background: `url(${bg}) no-repeat top center` }}>
            <Row>
              <Col span={titleSpan}>
                <p className={styles.itemTitle} style={{ lineHeight: '32px' }}>
                  {resultDetail.title}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className={styles.intro}>
                  <img src={resultDetail.imageUrl} alt="成果图片" />
                  <div className={styles.right}>
                    <p>成果摘要：</p>
                    <p className={styles.introduction}>{resultDetail.introduction || '-'}</p>
                    <div>
                      <p>关联项目组： {resultDetail.teamName || '无'}</p>
                      <p>成熟度： {this.filterMaturity(resultDetail.maturity)}</p>
                      <p>
                        成果附件：
                        {resultDetail.patentResultAttachmentList
                          ? resultDetail.patentResultAttachmentList.map(e => {
                              return (
                                <a key={e.id} href={e.url}>
                                  附件下载{e.id}
                                </a>
                              );
                            })
                          : '无'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={styles.title}>专利情况</p>
                <div className={styles.item}>{resultDetail.patentContent || '-'}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={styles.title}>成果内容</p>
                <div className={styles.item}>{resultDetail.content || '-'}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={styles.title}>成果标签</p>
                <div className={styles.item}>
                  {resultDetail.labelValueList &&
                    resultDetail.labelValueList.map(e => {
                      if (e.isDelete === 'NO') {
                        return <span key={e.id}>{e.value};</span>;
                      } else {
                        return '-';
                      }
                    })}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
