import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Card, Spin, Table, } from 'antd';
import styles from './Transaction.less';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';

@connect(({ transaction, loading }) => ({
    transaction,
    //loading: loading.effects['result/getResultDetail'],
}))
@Form.create()
export default class extends React.Component {
    componentDidMount() {
        this.getTransactionDetail();
    }

    getTransactionDetail = () => {
        const { dispatch, match } = this.props;
        console.log(match.params.id);
        dispatch({
            type: 'transaction/getTranscationDetail',
            payload: {
                authorizeId: match.params.id,
            },
        });
    };



    render() {
        const breadcrumbList = [
            {
                title: '首页',
                href: '/',
            },
            {
                title: '专利交易',
            },
            {
                title: '专利委托',
            },
            {
                title: '委托详情',
            },
        ];

        const { loading } = this.props;

        const columns = [{
            title: '专利申请号',
            dataIndex: 'an',
            key: 'an',
        }, {
            title: '专利名称',
            dataIndex: 'ti',
            key: 'ti',
        }, {
            title: '委托价格',
            dataIndex: 'price',
            key: 'price',
        }];

        return (
            <div>
                <PageHeader breadcrumbList={breadcrumbList} />
                <Row>
                    <Col span={24}>
                        <div className={styles.topSearch}>
                            {/* <Button
                                type='primary'
                                style={{ marginRight: 15, textAlign: 'center', width: 90, height: 40 }}
                                onClick={() => console.log(this.props.transaction.transactionDetail)}
                            >
                                查询
                    </Button> */}
                            <div style={{marginBottom:30}}>
                                <span>委托编号</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>{this.props.transaction.transactionDetail.no}</span>
                            </div>
                            <div style={{marginBottom:30}}>
                                <span>委托专利</span>
                                <Table 
                                columns={columns} 
                                dataSource={this.props.transaction.transactionDetail.authorizePatentList}
                                style={{width:1000,position:'relative',left:75,top:-18}}
                                pagination={false}
                                 />
                            </div>
                            <div style={{marginBottom:30}}>
                                <span>委托期限</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>{moment(this.props.transaction.transactionDetail.endTime).format('YYYY-MM-DD')}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
