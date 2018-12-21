let projectName = [
  { id: 1, name: '项目组名称1' },
  { id: 2, name: '项目组名称2' },
  { id: 3, name: '项目组名称3' }
]

//查询列表
const getProjectList = () => {
  return projectName;
}

//新增、编辑列表
const addProjectName = (payload) => {
  const arr = []
  if (payload.id) {
    projectName = [
      ...projectName.slice(0, projectName.map(p => p.id).indexOf(payload.id)),
      payload,
      ...projectName.slice(projectName.map(p => p.id).indexOf(payload.id) + 1)
    ]
    for (let i = 0; i < projectName.length; i++) {
      if (projectName[i].id == payload.id) {
        projectName[i].name == payload.name;
      }
    }
    console.log(projectName)
    projectName = [
      ...projectName,
      {}
    ]
  } else {
    if (typeof payload.id === 'undefined') {
      payload.id = 5;
    }
    projectName = [
      ...projectName,
      payload
    ]
  }
}


//删除项目组
const deleteName = (payload) => {
  const newProjectName = projectName.filter(p => {
    return payload.id !== p.id;
  })

  projectName = [
    ...newProjectName
  ]

}
export { getProjectList, addProjectName, deleteName }
