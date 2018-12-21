import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '专利检索',
    path: 'retrieval',
    children: [
      {
        name: '专利查询',
        path: 'https://www.tiikong.com/patent/query/index.do',
        // path: 'tiikong',
      },
      {
        name: '专利收藏',
        path: 'favorite',
      },
    ],
  },
  {
    name: '专利管理',
    path: 'patent',
    children: [
      {
        name: '专利列表',
        path: 'list',
      },
      {
        name: '价值分析',
        path: 'value',
      },
      // {
      //   name: '年费预警',
      //   path: 'fee-warning',
      // },
      // {
      //   name: '专利统计',
      //   path: 'statistics',
      // },
    ],
  },
  {
    name: '提案管理',
    path: 'proposal',
    children: [
      {
        name: '由我审核',
        path: 'my-audit',
      },
      {
        name: '提案列表',
        path: 'list',
      },
      {
        name: '新增提案',
        path: 'create',
      },
      {
        name: '抄送给我',
        path: 'copy-me',
      },
    ],
  },
  {
    name: '科技成果',
    path: 'result',
    children: [
      {
        name: '成果列表',
        path: 'list',
      },
      {
        name: '新增成果',
        path: 'create',
      },
      {
        name: '成果标签',
        path: 'tags',
      },
      {
        name: '成果统计',
        path: 'statistics',
      },
    ],
  },
  {
    name: '专利交易',
    path: 'transaction',
    children: [
      {
        name: '专利委托',
        path: 'list',
      },
      {
        name: '新增委托',
        path: 'create',
      },
    ],
  },
  {
    name: '专利资讯',
    path: 'info',
    children: [
      {
        name: '专利知事',
        path: 'news',
        // cnuip2.0 article
      },
      {
        name: '需求管理',
        path: 'requirement',
        // cnuip2.0 user/requirement
      },
      {
        name: '企业咨询',
        path: 'consultation',
        // cnuip2.0 goods/goods-comment, shop/shop-comment
      },
      {
        name: '系统通知',
        path: 'message',
        // cnuip2.0 user/system-message
      },
    ],
  },
  {
    name: '系统管理',
    path: 'system',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
