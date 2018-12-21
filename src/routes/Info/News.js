import React from 'react';
import { List } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';

import styles from './News.less';

@connect(({ news, loading }) => ({
  news,
  loading: loading.effects['news/fetch'],
}))
export default class News extends React.Component {
  componentDidMount() {
    this.fetchNews();
  }

  fetchNews = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetch',
      payload: params,
    });
  };

  render() {
    const { news, loading } = this.props;

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
      },
    ];

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <List
          loading={loading}
          className={styles.newsList}
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              this.fetchNews({ pageNum: page });
            },
            ...news.data.pagination,
            showQuickJumper: true,
          }}
          dataSource={news.data.list}
          renderItem={item => (
            <div
              className={styles.itemContent}
              key={item.id}
              onClick={() => {
                const { dispatch } = this.props;
                dispatch(routerRedux.push(`/info/news-detail/${item.id}`));
              }}
            >
              <img src={item.imageUrl} className={styles.thumbnail} alt={item.title} />
              <div className={styles.itemRight}>
                <p className={styles.newsTitle}>{item.title}</p>
                <p className={styles.newsIntro}>{item.introduction}</p>
                <p className={styles.newsDate}>{moment(item.createdTime).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}
