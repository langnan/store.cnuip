import { Table, Input, Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { relative } from 'upath';


class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        const { patents } = props;
        this.state = {
            dataSource: patents,
            count: 2,
        };
    }

    handleDelete = (key) => {
        const { deletePatents } = this.props;
        deletePatents(key);
    }

    changePrice=(an,price)=>{
        const { changePrice } = this.props;
        changePrice(an,price);
    }

    columns = [
        {
            title: '专利申请号',
            dataIndex: 'an',
        }, {
            title: '专利名称',
            dataIndex: 'ti',
        }, {
            title: '委托价格',
            dataIndex: 'price',
            width: '30%',
            render:(price,record)  => (
                <div>
                    <span style={{ position: 'relative', zIndex: 2 }}>¥</span>
                    <Input
                        ref={node => (this.input = node)}
                        defaultValue={price}
                        placeholder='请输入价格'
                        onChange={(e)=>{
                            this.changePrice(record.key,e.target.value);
                        }}
                        style={{ position: 'relative', zIndex: 1, width: "90%", paddingLeft: 20, left: -16 }}
                    />
                </div>
            ),
            editable: true,
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    this.props.patents.length >= 1
                        ? (
                            <Popconfirm title="确定删除此专利吗？" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="javascript:;">删除</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

    render() {
        const { dataSource } = this.state;
        return (
            <div>
                <Table
                    //components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={this.props.patents}
                    columns={this.columns}
                />
            </div>
        );
    }
}


EditableTable.propTypes = {
    patents: PropTypes.array,
    deletePatents: PropTypes.func,
    changePrice:PropTypes.func
};

EditableTable.defaultProps = {
    patents: [],
    deletePatents: () => { },
    changePrice: () => { },
};


export default EditableTable;