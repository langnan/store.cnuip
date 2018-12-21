var getDepartmentList = () => {
    console.log('will send getDepartmentList');
    return [
        {
            id: 1,
            name: '南京理工大学',
            childrenNode: [
                {
                    id: 3,
                    name: '化工学院',
                    childrenNode:[
                        {
                            id: 6,
                            name: '有机化学',  
                        },
                        {
                            id:7,
                            name: '无机化学',  
                            childrenNode:[
                                {
                                    id:8,
                                    name: '无机1组',  
                                },
                                {
                                    id:9,
                                    name: '无机2组',  
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    name: '计算机学院',
                },
                {
                    id: 5,
                    name: '理学院',
                }
            ]
        }
    ]
}
export { getDepartmentList };