import axios from '@/libs/api.request'
export default{
  // 员工管理查询
  query: (data) => {
    return axios.post('/admin/employee/query', data)
  },
  // 添加员工
  addEmployee: (data) => {
    return axios.post('/admin/employee/add', data)
  },
  // 更新员工信息
  updateEmployee: (data) => {
    return axios.post('/admin/employee/update', data)
  },
  // 禁用启用单个员工
  updateStatus: (employeeId, status) => {
    return axios.get('/admin/employee/updateStatus/' + employeeId + '/' + status)
  },
  // 批量禁用
  batchUpdateStatus: (data) => {
    return axios.post('/admin/employee/batchUpdateStatus', data)
  },
  // 单个员工角色授权
  updateRoles: (data) => {
    return axios.post('/admin/employee/updateRoles', data)
  },
  // 修改密码
  updatePwd: (data) => {
    return axios.post('/employee/updatePwd', data)
  },
  // 重置密码
  resetPwd: (employeeId) => {
    return axios.get('/employee/resetPasswd/' + employeeId)
  },
  // 通过部门id获取当前部门的人员&没有部门的人
  listEmployeeByDeptId: (departmentId) => {
    return axios.get('/employee/listEmployeeByDeptId/' + departmentId)
  },
  // 删除员工
  deleteEmployee: (employeeId) => {
    return axios.post('/admin/employee/delete/' + employeeId)
  }
}
