import React from 'react';
import { message, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/getTiikongToken'],
}))
export default class Retrieval extends React.Component {
  state = {
    token: null,
  };

  componentDidMount() {
    console.log('mounted');
    this.getTiikongToken();
  }

  getTiikongToken = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getTiikongToken',
      callback: res => {
        if (res.code === 0) {
          const token = res.result;
          this.setState({
            token,
          });
          console.log(token);
          // window.location.replace(
          //   `http://test.tiikong.com/patent/query/index.do?user_token=${token}`
          // );
          document.getElementById('tiikongLink').click();
          dispatch(routerRedux.replace('/'));
        } else {
          message.error(`获取token失败：${res.message}`);
        }
      },
    });
  };

  render() {
    const { loading } = this.props;
    const { token } = this.state;
    const iframeHeight = window.innerHeight - 74;
    return (
      <div>
        {loading && <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />}
        {/* {token && (
          // <iframe
          //   title="tiikong"
          //   style={{
          //     width: '100%',
          //     height: iframeHeight,
          //     border: 'none',
          //     marginTop: '5px',
          //   }}
          //   src={`http://test.tiikong.com/patent/query/index.do?user_token=${token}`}
          // />
        )} */}
        <a
          href={`http://test.tiikong.com/patent/query/index.do?user_token=${token}`}
          id="tiikongLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
        </a>
      </div>
    );
  }
}
