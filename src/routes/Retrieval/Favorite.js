import React from 'react';
import { Table, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';

import styles from './Favorite.less';

@connect(({ favorite, user, loading }) => ({
  user,
  favorite,
  loading: loading.effects['favorite/fetch'],
}))
export default class List extends React.Component {
  componentDidMount() {
    this.fetchFavorites();
  }

  fetchFavorites = payload => {
    const { dispatch, user } = this.props;
    if (user.currentUser.id) {
      this.getFavorites(user.currentUser.id, payload);
    } else {
      dispatch({
        type: 'user/fetchCurrent',
        callback: u => {
          this.getFavorites(u.id, payload);
        },
      });
    }
  };

  getFavorites = (userId, payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'favorite/fetch',
      payload: {
        userId,
        ...payload,
      },
    });
  };

  deleteFavorite = favorite => {
    const { dispatch } = this.props;
    dispatch({
      type: 'favorite/delete',
      payload: {
        favoriteId: favorite.id,
      },
      callback: res => {
        console.log(res);
        const resJson = JSON.parse(res);
        if (resJson.code === 0) {
          message.success('删除收藏成功', 1, this.fetchFavorites);
        } else {
          message.error(`删除收藏失败：${resJson.message}`);
        }
      },
    });
  };

  render() {
    const { loading, favorite } = this.props;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利检索',
      },
      {
        title: '专利收藏',
      },
    ];
    const columns = [
      {
        title: '申请号',
        dataIndex: 'an',
      },
      {
        title: '专利名称',
        dataIndex: 'ti',
      },
      {
        title: '专利类型',
        dataIndex: 'type',
      },
      {
        title: '权利人',
        dataIndex: 'pa',
      },
      {
        title: '年费状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Button
            onClick={e => {
              e.stopPropagation();
              this.deleteFavorite(record);
            }}
          >
            取消收藏
          </Button>
        ),
      },
    ];

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Table
          loading={loading}
          className={styles.patentTable}
          rowClassName={styles.tableRow}
          rowKey="an"
          columns={columns}
          dataSource={favorite.data.list}
          pagination={{
            onChange: page => {
              this.fetchFavorites({ pageNum: page });
            },
            ...favorite.data.pagination,
            showQuickJumper: true,
          }}
          onRow={patent => {
            const { dispatch } = this.props;
            return {
              onClick: () => {
                dispatch(routerRedux.push(`/patent/detail/${patent.an}`));
              },
            };
          }}
        />
      </div>
    );
  }
}
