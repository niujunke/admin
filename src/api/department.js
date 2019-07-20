import axios from '@/libs/api.request'
export default {
  // 加载所有的部门子部门
  loadDepartment: () => {
    return axios.get('/department/list')
  },
  // 查询部门及员工列表
  listDepartmentEmployee: () => {
    return axios.get('/department/listEmployee')
  },
  // 添加部门
  addDepartment: (data) => {
    return axios.post('/department/add', data)
  },
  // 编辑部门
  updateDepartment: (data) => {
    return axios.post('/department/update', data)
  },
  // 删除部门
  deleteDepartment: (data) => {
    return axios.post('/department/delete/' + data)
  },
  // 根据id获取部门信息
  getDepartmentById: (data) => {
    return axios.get('/department/query/' + data)
  },
  // 查询部门列表
  listAll: () => {
    return axios.get('/department/listAll')
  },
  listEmployeeByDepartmentName: (departmentName) => {
    return axios.get('/department/listEmployeeByDepartmentName?departmentName=' + departmentName)
  },
  // 上下移动
  upOrDown: (departmentId, swapId) => {
    return axios.get('/department/upOrDown/' + departmentId + '/' + swapId)
  },
  // 升级
  upgrade: (departmentId) => {
    return axios.get('/department/upgrade/' + departmentId)
  },
  // 降级
  downgrade: (departmentId, preId) => {
    return axios.get('/department/downgrade/' + departmentId + '/' + preId)
  }
}
