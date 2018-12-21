const authority = [
  {
    id: 1,
    name: '超级管理组',
    allAuthority : [
      {
        id: 1,
        name: '系统设置',
        subNodes: [
          {
            id: 3,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 4,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 5,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 6,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 10,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
      {
        id: 2,
        name: '其他设置',
        subNodes: [
          {
            id: 7,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 8,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 9,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '管理员2',
    allAuthority : [
      {
        id: 1,
        name: '系统设置',
        subNodes: [
          {
            id: 3,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 4,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 5,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 6,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 10,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
      {
        id: 2,
        name: '其他设置',
        subNodes: [
          {
            id: 7,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 8,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 9,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '管理员3',
    allAuthority : [
      {
        id: 1,
        name: '系统设置',
        subNodes: [
          {
            id: 3,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 4,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 5,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 6,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 10,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
      {
        id: 2,
        name: '其他设置',
        subNodes: [
          {
            id: 7,
            name: '部门设置',
            is_checked: false,
          },
          {
            id: 8,
            name: '部门设置',
            is_checked: true,
          },
          {
            id: 9,
            name: '部门设置',
            is_checked: false,
          },
        ],
      },
    ],
  },
];

const allAuthority = [
  {
    id: 1,
    name: '系统设置',
    subNodes: [
      {
        id: 3,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 4,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 5,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 6,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 10,
        name: '部门设置',
        is_checked: false,
      },
    ],
  },
  {
    id: 2,
    name: '其他设置',
    subNodes: [
      {
        id: 7,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 8,
        name: '部门设置',
        is_checked: false,
      },
      {
        id: 9,
        name: '部门设置',
        is_checked: false,
      },
    ],
  },
];

const getAuthorityList = () => {
  return authority;
};

const getAllAuthority = () => {
  return allAuthority;
};

export { getAuthorityList, getAllAuthority };
