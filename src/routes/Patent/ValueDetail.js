import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Card, Spin, Table, } from 'antd';
import PageHeader from '../../components/PageHeader';
import G2 from '@antv/g2';
import moment from 'moment';
import styles from './Value.less';
import { width } from 'window-size';
@connect(({ patentList, loading }) => ({
    patentList,
}))
@Form.create()
export default class extends React.Component {
    componentDidMount() {
        this.getValueDetail();
    }

    getValueDetail = () => {
        const { dispatch, match } = this.props;
        dispatch({
            type: 'patentList/getValueDetail',
            payload: {
                an: match.params.id,
            },
            callback: res => {
                const { loading, patentList } = this.props;
                const { valueDetail } = patentList;
                const { evaluation, labels, patent } = valueDetail;
                console.log(labels.legalValue && parseFloat(labels.legalValue * 100).toFixed(2));
                console.log(labels.technologicalValue && parseFloat(labels.technologicalValue * 100).toFixed(2));
                console.log(labels.economicValue && parseFloat(labels.economicValue * 100).toFixed(2));
                var data = [{
                    type: '法律价值',
                    percent: labels.legalValue && parseFloat(labels.legalValue * 100)
                }, {
                    type: '技术价值',
                    percent: labels.technologicalValue && parseFloat(labels.technologicalValue * 100)
                }, {
                    type: '经济价值',
                    percent: labels.economicValue && parseFloat(labels.economicValue * 100)
                }];
                var sum = 500;
                var ds = new DataSet();
                var dv = ds.createView().source(data);
                dv.transform({
                    type: 'map',
                    callback: function callback(row) {
                        row.value = parseInt(sum * row.percent);
                        return row;
                    }
                });
                var chart = new G2.Chart({
                    container: 'mountNode',
                    forceFit: true,
                    height: 400,
                    width: 900,
                    //padding: 'auto'
                });
                chart.source(dv);
                chart.tooltip(false);
                chart.legend({
                    position: 'right-center',
                    offsetX: -150,
                    offsetY: -25,
                    textStyle: {
                        fontSize: '14', 
                      }
                });
                chart.coord('theta', {
                    radius: 0.75,
                    innerRadius: 0.6
                });
                chart.intervalStack().position('percent').color('type', ['#f7cd17', '#13c3c3', '#427eea']).opacity(1).label('percent', {
                    //offset: -18,
                    textStyle: {
                        //fill: '#333',
                        fontSize: 12,
                        shadowBlur: 2,
                        shadowColor: 'rgba(0, 0, 0, .45)'
                    },
                    rotate: 0,
                    autoRotate: false,
                    formatter: function formatter(text, item) {
                        // return String(parseInt(item.point.percent * 100)) + '%';
                        return text;
                    }
                });
                chart.guide().html({
                    position: ['50%', '50%'],
                    html: '<div class="g2-guide-html" style= "text-align:center" ><p style= "color: #3b77e3 ;font-weight: bold; font-size: 20px;margin-bottom: 3px;">' + (labels.patentValue * 100).toFixed(2) + '</p><p style="font-size: 12px;font-weight: bold;color:#333">价值评估</p></div>'
                });
                chart.render();

                //
            },
        });
    };



    render() {
        console.log('_0_');
        console.log(this.props.patentList.valueDetail);
        const breadcrumbList = [
            {
                title: '首页',
                href: '/',
            },
            {
                title: '专利管理',
            },
            {
                title: '价值分析',
            },
            {
                title: '价值详情',
            },
        ];

        const { loading, patentList } = this.props;
        const { valueDetail } = patentList;
        const { evaluation, labels, patent } = valueDetail;

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
                            <p className={styles.title}>价值评估:</p>
                            <div id='mountNode' style={{ width: 900, height: 400 }}></div>

                            <div className={styles.assessmentTitle}>法律价值</div>
                            <div className={styles.assessmentContent} style={{ borderTop: 0 }}>
                                <span className={styles.assessmentLeft}>依赖性</span>
                                <span className={styles.assessmentRight}>非专利依赖度: {labels && (labels.nonPatentDependence * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>专利依赖度:{labels && (labels.patentDependence * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent}>
                                <span className={styles.assessmentLeft}>专利宽度</span>
                                <span className={styles.assessmentRight}>地域保护范围:{labels && (labels.gengraphicalCoverage * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>权利保护范围:{labels && (labels.scopeOfRightProtection * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent}>
                                <span className={styles.assessmentLeft}>专利稳定性</span>
                                <span className={styles.assessmentRight}>法律地位稳固度:{labels && (labels.stabilityOfLegalStatus * 100).toFixed(2)}</span>
                            </div>

                            <div className={styles.assessmentTitle}>经济价值</div>
                            <div className={styles.assessmentContent} style={{ borderTop: 0 }}>
                                <span className={styles.assessmentLeft}>市场竞争能力</span>
                                <span className={styles.assessmentRight}>市场竞争得分:{labels && (labels.marketCompetitivePower * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent}>
                                <span className={styles.assessmentLeft}>专利布局</span>
                                <span className={styles.assessmentRight}>专利族地域分布:{labels && (labels.patenteGeographuicalDistribution * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>专利族规模:{labels && (labels.patentFamilySize * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent}>
                                <span className={styles.assessmentLeft}>专利经济寿命</span>
                                <span className={styles.assessmentRight}>专利时限:{labels && (labels.timeLimitOfPatent * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>专利维持状态:{labels && (labels.patentMaintenance * 100).toFixed(2)}</span>
                            </div>

                            <div className={styles.assessmentTitle}>技术价值</div>
                            <div className={styles.assessmentContent} style={{ borderTop: 0 }}>
                                <span className={styles.assessmentLeft}>技术替代性</span>
                                <span className={styles.assessmentRight}>专利新颖度:{labels && (labels.patentNovelty * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent}>
                                <span className={styles.assessmentLeft}>技术先进性</span>
                                <span className={styles.assessmentRight}>技术交叉性:{labels && (labels.technicalCrossover * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>科学关联强度:{labels && (labels.scientificCorrelationStrength * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>团队影响力:{labels && (labels.groupInfluence * 100).toFixed(2)}</span>
                            </div>
                            <div className={styles.assessmentContent} style={{ borderBottom: `1px solid #dcdcdc` }}>
                                <span className={styles.assessmentLeft}>技术应用范围</span>
                                <span className={styles.assessmentRight}>技术覆盖度:{labels && (labels.technicalCoverage * 100).toFixed(2)}</span>
                                <span className={styles.assessmentRight}>技术专业度:{labels && (labels.technicalDegree * 100).toFixed(2)}</span>
                            </div>

                            <p className={styles.title}>标定说明:</p>
                            <div className={styles.tablabel}>法律价值</div>
                            <div className={styles.tabcontent}>{evaluation && evaluation.fljz}</div>
                            <div className={styles.tablabel}>经济价值</div>
                            <div className={styles.tabcontent}>{evaluation && evaluation.jjjz}</div>
                            <div className={styles.tablabel}>技术价值</div>
                            <div className={styles.tabContentBorder}>{evaluation && evaluation.jsjz}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
