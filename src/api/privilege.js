import axios from '@/libs/api.request'

export default {
  // 获取所有路由
  getAllUrl: () => {
    return axios.get('/privilege/getAllUrl/1')
  },
  // 查询菜单列表//type:1模块；2子模块；3页面；4功能点；
  listPrivilege: () => {
    return axios.get('/privilege/listPrivilege/1')
  },
  // 查询菜单对应的页面以及功能点
  listPrivilegeById: (id) => {
    return axios.get('/privilege/listPrivilegeById/' + id)
  },
  // 添加
  privilegeAdd: (data) => {
    return axios.post('/privilege/add', data)
  },
  // 更新
  privilegeUpdate: (data) => {
    return axios.post('/privilege/update', data)
  },
  // 删除
  privilegeDelete: (privilegeId) => {
    return axios.post('/privilege/delete/' + privilegeId)
  }
}
