import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NodeItems from './NodeItems';
import nodeConnector from '../../assets/images/system/node-connector.png';

import styles from './index.less';

export default class FlowNodes extends PureComponent {
  render() {
    const { nodes, onCloseBtnClick, onAddItemClick, onAddNodeClick } = this.props;
    return (
      <div>
        <ul className={styles.nodeList}>
          <li className={styles.node}>
            开始
            <img src={nodeConnector} className={styles.leftConnector} alt="left" />
            <img src={nodeConnector} className={styles.rightConnector} alt="right" />
          </li>
          {nodes &&
            nodes.map((node, index) => (
              <li className={styles.node} key={node.id || node.key}>
                <p className={styles.nodeTitle}>节点配置</p>
                <NodeItems
                  value={node.tmplProcessTaskDepartmentVoList}
                  node={node}
                  metadata={{ nodeIndex: index }}
                  addBtnText="设置"
                  onCloseBtnClick={onCloseBtnClick}
                  onAddItemClick={onAddItemClick}
                />
                <img src={nodeConnector} className={styles.leftConnector} alt="left" />
                <img src={nodeConnector} className={styles.rightConnector} alt="right" />
              </li>
            ))}
          <li className={styles.node}>
            <a className={styles.addNodeBtn} onClick={onAddNodeClick}>
              + 增加节点
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

FlowNodes.propTypes = {
  // nodes: PropTypes.array,
  // onChange: PropTypes.func,
  onCloseBtnClick: PropTypes.func,
  onAddItemClick: PropTypes.func,
  onAddNodeClick: PropTypes.func,
};

FlowNodes.defaultProps = {
  // onChange: () => {},
  onCloseBtnClick: () => {},
  onAddItemClick: () => {},
  onAddNodeClick: () => {},
};
