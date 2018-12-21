import React from 'react';
import styles from './index.less';
import {
    Card,
    Input,
    Row,
    Col,
    Button,
    Icon,
    Spin,
    Form,
    Modal,
    Tree,
    Menu,
    message,
    Dropdown,
    Cascader,
} from 'antd';

// 树
var TreeNode = Tree.TreeNode;
const RenderTreeNodes = function (dataTree) {
    console.log(dataTree);
    //data=['2','3'];
    return dataTree.map(item => {
        if (item.childrenNode) {
            return (
                <TreeNode title={item.name} key={item.id} icon={() => { }}>
                    {RenderTreeNodes(item.childrenNode)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.name} key={item.id} />;
    });
};

export default ({ style ,datatree }) => (
    <div>
        <Tree className="departmentTree" >
            {RenderTreeNodes({datatree})}
        </Tree>
    </div>
)