import React from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import moment from 'moment';
import PageHeader from '../../components/PageHeader';

import styles from './NewsDetail.less';

@connect(({ loading }) => ({
  loading: loading.effects['news/getNewsDetail'],
}))
export default class NewsDetail extends React.Component {
  state = {
    newsDetail: {},
  };

  componentDidMount() {
    this.getPatentDetail();
  }

  getPatentDetail = () => {
    const { dispatch, match } = this.props;
    const newId = match.params.id;
    if (newId) {
      dispatch({
        type: 'news/getNewsDetail',
        payload: {
          id: newId,
        },
        callback: res => {
          this.setState({
            newsDetail: res.result,
          });
        },
      });
    }
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利咨讯',
      },
      {
        title: '专利知事',
        href: '/info/news',
      },
      {
        title: '知事详情',
      },
    ];
    const { loading } = this.props;
    const { newsDetail } = this.state;
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
            <p className={styles.newsTitle}>{newsDetail.title}</p>
            <p className={styles.createDate}>
              {moment(newsDetail.createdTime).format('YYYY-MM-DD')}
            </p>
            <p
              className={styles.newsContent}
              dangerouslySetInnerHTML={{ __html: newsDetail.content }}
            />
            <div className={styles.info}>
              <div style={{ float: 'left' }}>
                标签：
                {newsDetail.label &&
                  newsDetail.label.split(',').map(l => (
                    <span className={styles.label} key={l}>
                      {l}
                    </span>
                  ))}
              </div>
              <div style={{ float: 'right' }}>
                附件：
                {newsDetail.articleAttachments &&
                  newsDetail.articleAttachments.map((a, index) => (
                    <a href={a.url} key={a.id}>
                      附件{index + 1}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
