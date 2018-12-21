let flows = [
  {
    id: 0,
    name: '专利申请审批流程（通用模版）',
    type: 0,
    nodes: [
      [{ id: 0, name: '审核员' }, { id: 1, name: '审核组长' }],
      [{ id: 2, name: '审核长' }, { id: 1, name: '审核总长' }],
      [{ id: 3, name: '主席' }]
    ],
    copyTo: [{ id: 4, name: '习近平' }, { id: 5, name: '温家宝' }]
  }
];

const getAllFlows = () => {
  return flows;
}

const saveFlow = (payload) => {
  flows = {
    ...flows,
    payload
  }
}

export { getAllFlows, saveFlow }