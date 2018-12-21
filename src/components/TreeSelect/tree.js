import React from 'react';
import { Tree } from 'antd';
import { PropTypes } from 'prop-types';

const { TreeNode } = Tree;
class TreeSelect extends React.Component {
  state = {
    autoExpandParent: true,
    selectedKeys: [],
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onTreeSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
    const { onSelect } = this.props;
    onSelect(selectedKeys);
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };

  render() {
    const { expandedKeys, autoExpandParent, selectedKeys } = this.state;
    const { treeData, onSelect } = this.props;
    return (
      <Tree
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={this.onTreeSelect}
        selectedKeys={selectedKeys}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

TreeSelect.propTypes = {
  onSelect: PropTypes.func,
  treeData: PropTypes.array,
};

TreeSelect.defaultProps = {
  onSelect: () => {},
  treeData: [],
};

export default TreeSelect;
