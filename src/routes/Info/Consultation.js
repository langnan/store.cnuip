import React from 'react';
import { Button, Input, Form, List, Radio, Tabs } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';
import { replyConsultation } from '../../services/info';
import styles from './Consultation.less';

const { TabPane } = Tabs;
const breadcumbInit = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '专利资讯',
    href: '/',
  },
  {
    title: '企业咨询',
    href: '/info/consultation',
  },
];
@connect(({ consultation, loading }) => ({
  consultation,
  loading: loading.effects['consultation/fetch'],
}))
@Form.create({})
export default class Consultation extends React.Component {
  state = {
    tabKey: 1,
    breadcrumbList: [...breadcumbInit, { title: '商品咨询' }],
  };

  componentDidMount() {
    this.fetchConsultations({
      pageSize: 20,
      pageNum: 1,
    });
  }

  fetchConsultations = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'consultation/fetch',
      payload,
    });
  };

  fetchShops = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'consultation/fetchShop',
      payload,
    });
  };

  callback = key => {
    const { consultation } = this.props;
    switch (key) {
      case '1':
        this.setState(state => {
          return {
            tabKey: key,
            breadcrumbList: [
              ...breadcumbInit,
              {
                title: '商品咨询',
              },
            ],
          };
        });
        this.fetchConsultations({
          pageSize: 20,
          pageNum: 1,
        });
        break;
      case '2':
        this.setState(state => {
          return {
            tabKey: key,
            breadcrumbList: [
              ...breadcumbInit,
              {
                title: '店铺咨询',
              },
            ],
          };
        });
        this.fetchShops({ pageSize: 20, pageNum: 1 });
        break;
      default:
        console.log('暂无数据');
        break;
    }
  };

  render() {
    const { form, consultation, loading, dispatch } = this.props;
    const { breadcrumbList } = this.state;
    const { tabKey } = this.state;
    return (
      <div>
        <PageHeader tabActiveKey={tabKey} breadcrumbList={breadcrumbList} />
        <div className={styles.tabHeader}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="商品咨询" key="1">
              <List
                loading={loading}
                className={styles.consultationList}
                grid={{ gutter: 16, column: 4 }}
                dataSource={consultation.data.list}
                pagination={{
                  ...consultation.data.pagination,
                  onChange: page => {
                    this.fetchConsultations({ pageNum: page, pageSize: 20 });
                  },
                  showQuickJumper: true,
                }}
                renderItem={item => {
                  const replied = !!item.replyContent;
                  // const requirementType = requirementTypes.find(t => t.value === item.requirementType);
                  // const enterpriseType = enterpriseTypes.find(t => t.value === item.enterpriseType);
                  return (
                    <List.Item className={styles.consultationItem}>
                      <div
                        className={styles.consultationContent}
                        onClick={() => {
                          dispatch(
                            routerRedux.push(`/info/consultation-detail/${item.id}`, {
                              state: item,
                            })
                          );
                        }}
                      >
                        <div className={replied ? styles.repliedLabel : styles.unrepliedLabel}>
                          {replied ? '已回复' : '未回复'}
                        </div>
                        <p className={styles.consultationTitle}>
                          {item.reviewContent && item.reviewContent.length > 50
                            ? `${item.reviewContent.slice(0, 50)}...`
                            : item.reviewContent}
                        </p>

                        <div className={styles.itemSpliter}>
                          <div className={styles.leftDot} />
                          <div className={styles.centerLine} />
                          <div className={styles.rightDot} />
                        </div>
                        <div className={styles.itemMetaData}>
                          <p className={styles.updateDate}>
                            {moment(item.updatedTime).format('YYYY-MM-DD')}
                          </p>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </TabPane>
            <TabPane tab="店铺咨询" key="2">
              <List
                loading={loading}
                className={styles.consultationList}
                grid={{ gutter: 16, column: 4 }}
                dataSource={consultation.data.shopList}
                pagination={{
                  ...consultation.data.pagination,
                  onChange: page => {
                    this.fetchShops({ pageNum: page, pageSize: 20 });
                  },
                  showQuickJumper: true,
                }}
                renderItem={item => {
                  const replied = !!item.replyContent;

                  return (
                    <List.Item className={styles.consultationItem}>
                      <div
                        className={styles.consultationContent}
                        onClick={() => {
                          dispatch(
                            routerRedux.push(`/info/consultation-shop-detail/${item.id}`, {
                              state: item,
                            })
                          );
                        }}
                      >
                        <div className={replied ? styles.repliedLabel : styles.unrepliedLabel}>
                          {replied ? '已回复' : '未回复'}
                        </div>
                        <p className={styles.consultationTitle}>
                          {item.reviewContent.length > 50
                            ? `${item.reviewContent.slice(0, 50)}...`
                            : item.reviewContent}
                        </p>

                        <div className={styles.itemSpliter}>
                          <div className={styles.leftDot} />
                          <div className={styles.centerLine} />
                          <div className={styles.rightDot} />
                        </div>
                        <div className={styles.itemMetaData}>
                          <p className={styles.updateDate}>
                            {moment(item.updatedTime).format('YYYY-MM-DD')}
                          </p>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
