import React from 'react';
import { Button, Input, Form, List, Radio, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';
import { requirementTypes, enterpriseTypes, replyTypes, timeRanges } from '../../services/info';
import styles from './Requirement.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ requirement, loading }) => ({
  requirement,
  loading: loading.effects['requirement/fetch'],
}))
@Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const { dispatch } = props;
    let startTime;
    const { timeRange } = allValues;
    if (timeRange !== undefined) {
      startTime = moment()
        .subtract(timeRange, 'days')
        .format('YYYY-MM-DD');
    }
    const queryOptions = {
      ...allValues,
      startTime,
    };
    dispatch({
      type: 'requirement/setQueryOptions',
      payload: queryOptions,
    });
    dispatch({
      type: 'requirement/fetch',
    });
  },
})
export default class Requirement extends React.Component {
  componentDidMount() {
    this.fetchRequirements();
    this.fetchClassifies();
  }

  fetchRequirements = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirement/fetch',
      payload,
      callback: res => {
        if (res.code !== 0) {
          message.error(`获取需求列表失败：${res.message}`);
        }
      },
    });
  };

  fetchClassifies = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirement/fetchClassifies',
      payload,
    });
  };

  render() {
    const { form, requirement, loading, dispatch } = this.props;
    console.log(requirement);
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 21,
      },
    };
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利咨讯',
      },
      {
        title: '需求管理',
      },
    ];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <div className={styles.searchBar}>
          <Input
            placeholder="输入名称查询"
            className={styles.searchInput}
            onChange={e => {
              dispatch({
                type: 'requirement/setQueryOptions',
                payload: {
                  title: e.target.value,
                },
              });
            }}
          />
          <Button
            type="primary"
            className={styles.searchBtn}
            onClick={e => {
              this.fetchRequirements();
            }}
          >
            搜索
          </Button>
        </div>
        <Form className={styles.queryForm}>
          <FormItem {...formItemLayout} label="需求分类">
            {getFieldDecorator('code', {
              intialValue: requirement.queryOptions.requirement_type,
            })(
              // <RadioGroup options={requirementTypes} />
              <RadioGroup
                options={[
                  { label: '全部', value: undefined },
                  ...requirement.classifies.map(c => ({ label: c.name, value: c.code })),
                ]}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="企业类型">
            {getFieldDecorator('enterpriseType', {
              intialValue: requirement.queryOptions.enterprise_type,
            })(<RadioGroup options={enterpriseTypes} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="回复状态">
            {getFieldDecorator('isReply', {
              intialValue: requirement.queryOptions.isReply,
            })(<RadioGroup options={replyTypes} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间">
            {getFieldDecorator('timeRange', {
              intialValue: requirement.queryOptions.timeRange,
            })(<RadioGroup options={timeRanges} />)}
          </FormItem>
        </Form>
        <List
          loading={loading}
          className={styles.requirementList}
          grid={{ gutter: 16, column: 4 }}
          dataSource={requirement.data.list}
          pagination={{
            ...requirement.data.pagination,
            onChange: page => {
              this.fetchRequirements({ pageNum: page });
            },
            showQuickJumper: true,
          }}
          renderItem={item => {
            const replied = !!item.replyContent;
            const requirementType = requirementTypes.find(t => t.value === item.requirementType);
            const enterpriseType = enterpriseTypes.find(t => t.value === item.enterpriseType);
            return (
              <List.Item className={styles.requirementItem}>
                <div
                  className={styles.requirementContent}
                  onClick={() => {
                    dispatch(routerRedux.push(`/info/requirement-detail/${item.id}`));
                  }}
                >
                  <div className={replied ? styles.repliedLabel : styles.unrepliedLabel}>
                    {replied ? '已回复' : '未回复'}
                  </div>
                  <p className={styles.requirementTitle}>
                    {item.title.length > 12 ? `${item.title.slice(0, 12)}...` : item.title}
                  </p>
                  <p className={styles.requirementDetail}>
                    {item.content.length > 50 ? `${item.content.slice(0, 50)}...` : item.content}
                  </p>
                  <div className={styles.itemSpliter}>
                    <div className={styles.leftDot} />
                    <div className={styles.centerLine} />
                    <div className={styles.rightDot} />
                  </div>
                  <div className={styles.itemMetaData}>
                    <p>
                      {`需求分类：${item.classifyThree || item.classifyTwo || item.classifyOne}`}
                    </p>
                    <p>{`需求类型：${(requirementType && requirementType.label) || ''}`}</p>
                    <p>{`企业类别：${enterpriseType && enterpriseType.label}`}</p>
                    <p>{`需求标签：${item.labels ? item.labels.join('，') : ''}`}</p>
                    <p className={styles.updateDate}>
                      {item.updatedTime && moment(item.updatedTime).format('YYYY-MM-DD')}
                    </p>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}
