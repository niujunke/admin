import axios from '@/libs/api.request'
export default {
  // 添加角色
  addRole: (remark, roleName) => {
    const data = {
      remark: remark,
      roleName: roleName
    }
    return axios.post('/role/add', data)
  },
  // 删除角色
  deleteRole: (id) => {
    return axios.get('/role/delete/' + id)
  },
  // 修改角色
  updateRole: (id, remark, roleName) => {
    const data = {
      id: id,
      remark: remark,
      roleName: roleName
    }
    return axios.post('/role/update', data)
  },
  // 获取角色数据
  getRoleDetail: (id) => {
    return axios.get('/role/get/' + id)
  },
  // 加载角色列表
  getAllRole: () => {
    return axios.get('role/getAll')
  },
  // 根据角色名字获取对应成员列表
  getlistEmployee: (data) => {
    return axios.post('/role/listEmployee', data)
  },
  // 根据角色id获取角色成员-员工列表
  getAlllistEmployee: (id) => {
    return axios.get('/role/listAllEmployee/' + id)
  },
  // 从角色成员列表中移除员工
  removeEmployeeRole: (param) => {
    return axios.get('/role/removeEmployee?employeeId=' + param.employeeId + '&roleId=' + param.roleId)
  },
  // 从角色成员列表中批量移除员工
  removeEmployeeList: (data) => {
    return axios.post('/role/removeEmployeeList', data)
  },

  // 添加角色成员方法
  addEmployeeListRole: (data) => {
    return axios.post('/role/addEmployeeList', data)
  },
  // 通过员工id获取所有角色以及员工具有的角色
  getRoles: (id) => {
    return axios.get('/role/getRoles/' + id)
  },
  // 更新角色权限
  getRolePower: (data) => {
    return axios.post('/privilege/updateRolePrivilege', data)
  },
  // 获取角色可选的功能权限
  listPrivilegeByRoleId: (id) => {
    return axios.get('/privilege/listPrivilegeByRoleId/' + id)
  },
  // 数据权限列表
  dataScopeList: () => {
    return axios.get('/dataScope/list')
  },
  // 获取某角色所设置的数据范围
  getDataScopeByRoleId: (roleId) => {
    return axios.get('/dataScope/listByRole/' + roleId)
  },
  // 批量设置某角色数据范围
  dataScopeBatchSet: (data) => {
    return axios.post('/dataScope/batchSet', data)
  }
}
