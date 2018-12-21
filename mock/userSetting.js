let userList =  [
    {
        id: 1,
        name: '南京理工大学',
        children: [
            {
                id: 11,
                name: '化工学院',
                children:[
                    {
                        id: 111,
                        name: '有机化学',  
                    },
                    {
                        id:112,
                        name: '无机化学',  
                        children:[
                            {
                                id:1111,
                                name: '无机1组',  
                            },
                            {
                                id:1112,
                                name: '无机2组',  
                            }
                        ]
                    }
                ]
            },
            {
                id: 12,
                name: '计算机学院',
            },
            {
                id: 13,
                name: '理学院',
            }
        ]
    }
]

 
//获取用户树节点
const getUserList = () => {
    return userList;
}


let userFormInfo = {
  voucherPhoto: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
}

const getFromInfo = () => {
    return userFormInfo;
}
export { getUserList,getFromInfo };