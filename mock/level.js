let level = {
  result: [{ id: 1, name: '一级审批' }, { id: 2, name: '二级审批' }],
};

const getLevelList = () => {
  return level;
};

const saveLevel = (payload) => {
  level = {
    ...level,
    ...payload,
  };
};

export { getLevelList, saveLevel };
