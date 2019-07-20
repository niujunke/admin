<template>
  <div>
    <Col :md="16" :lg="19">
      <Card class="warp-card">
        <Row type="flex" justify="space-between">
          <Col>
            <Input
              v-model="searchConName"
              @on-change="handleSearchByName"
              icon="md-search"
              placeholder="请输入姓名搜搜..."
              style="width: 200px"
            />
            <Input
              v-model="searchDepartment"
              @on-change="handleSearchByDepartment"
              icon="md-search"
              placeholder="请输入部门名称搜搜..."
              style="width: 200px;margin-left: 5px;"
            />
          </Col>
          <Col>
            <Button
              type="warning"
              @click="lookStaffInfo(1)"
              v-privilege="'search'"
              v-show="currentDisabled"
            >查看已禁用用户</Button>
            <Button
              type="success"
              @click="lookStaffInfo(0)"
              v-privilege="'search'"
              v-show="currentDisabled"
            >查看已启用用户</Button>
            <Button
              type="primary"
              @click="onStaffFlag"
              icon="md-add"
              v-privilege="'addEmployee'"
              style="margin-left: 5px;"
            >添加成员</Button>
          </Col>
        </Row>
        <Row style="padding-top:10px; ">
          <Table border :columns="columns1" :data="staffTable" @on-selection-change="singleSelect"></Table>
        </Row>
        <Row type="flex" justify="end" class="page" style="position: relative;margin-top: 10px;">
          <Button
            type="warning"
            @click="GroupDisable(1)"
            style="left:0px;position: absolute;"
            v-privilege="'batch'"
            v-show="!currentDisabled"
          >批量禁用</Button>
          <Button
            type="success"
            @click="GroupDisable(0)"
            style="left:0px;position: absolute;"
            v-privilege="'batch'"
            v-show="currentDisabled"
          >批量启用</Button>
          <Page
            :total="totalPage"
            :current="pageNum"
            :page-size="pageSize"
            show-elevator
            @on-change="changePage"
          ></Page>
        </Row>
      </Card>
    </Col>
    <AddStaff ref="addStaff" :selectDepartment="selectDepartment" @addSuccess="query"></AddStaff>
    <Modal title="角色管理" v-model="roleFlag" class-name="vertical-center-modal" @on-ok="makeSureRole">
      <RadioGroup v-model="employeeRole">
        <Radio v-for="roleItem in roleList" :label="roleItem.id">{{roleItem.roleName}}</Radio>
      </RadioGroup>
    </Modal>
    <employeeDetail ref="employeeDetail"></employeeDetail>
  </div>
</template>

<style lang="less" scoped>
.ivu-tree-children {
  cursor: pointer;
}

.option_department {
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
}

.searchable-table-con1 {
  min-height: 350px !important;
}

.option_department:hover {
  background-color: rgba(5, 170, 250, 0.2);
}
</style>
<script>
// import { departmentApi } from '@/api/department'
// import { employeeApi } from '@/api/employee'
import AddStaff from './components/addStaff.vue'
import employeeDetail from './components/employeeDetail.vue'

export default {
  name: 'departmentStaff',
  components: { AddStaff, employeeDetail },
  props: {
    selectDepartment: {},
    departments: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      employeeRole: '',
      roleList: [],
      roleId: '',
      mid: '', // 员工id
      totalPage: 0,
      pageSize: 10,
      pageNum: 1,
      roleFlag: false,
      searchConName: '',
      searchDepartment: '',
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          width: 80,
          align: 'center',
          key: 'id'
        },
        {
          key: 'name',
          width: 120,
          title: '名称',
          align: 'center'
        },
        {
          key: 'loginName',
          width: 200,
          title: '登录名',
          align: 'center'
        },
        {
          key: 'isDisabled',
          width: 120,
          title: '状态',
          align: 'center',
          render: (h, params) => {
            let disabled = params.row.isDisabled
            return h('span', disabled ? '禁用' : '启用')
          }
        },
        {
          key: 'phone',
          width: 120,
          title: '手机',
          align: 'center'
        },
        {
          key: 'email',
          width: 120,
          title: '电子邮箱',
          align: 'center'
        },
        {
          key: 'createDate',
          width: 150,
          title: '创建时间',
          align: 'center'
        },
        {
          title: '-'
        },
        {
          title: '操作',
          key: 'action',
          width: 230,
          fixed: 'right',
          align: 'center',
          className: 'action-hide',
          render: (h, params) => {
            let btnGroup = []
            let isSuper = params.row.super
            if (!isSuper) {
              btnGroup.push(
                h('Tooltip', {
                  props: {
                    content: '角色设置',
                    placement: 'top',
                    transfer: true
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'updateEmployeeRole'
                    }
                  ]
                }, [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'ios-construct'
                    },
                    on: {
                      click: () => {
                        this.roleManage(h, params)
                      }
                    }
                  }, '角色设置')
                ])
              )
            }
            btnGroup.push(
              h('Tooltip', {
                props: {
                  content: '详情',
                  placement: 'top',
                  transfer: true
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-document'
                  },
                  on: {
                    click: () => {
                      this.$refs['employeeDetail'].showModal(params.row)
                    }
                  }
                }, '详情')
              ])
            )
            if (params.row.isDisabled == 0 && !isSuper) {
              btnGroup.push(
                h('Tooltip', {
                  props: {
                    content: '编辑',
                    placement: 'top',
                    transfer: true
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'updateEmployee'
                    }
                  ]
                }, [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'md-create'
                    },
                    on: {
                      click: () => {
                        this.updataMsg(params.row)
                      }
                    }
                  }, '编辑')
                ])
              )
            }
            if (!isSuper) {
              if (params.row.isDisabled == 0) {
                var isDisableBtn = [
                  h('Tooltip', {
                    props: {
                      content: '禁用',
                      placement: 'top',
                      transfer: true
                    },
                    directives: [
                      {
                        name: 'privilege',
                        value: 'disabled'
                      }
                    ]
                  }, [
                    h('Button', {
                      props: {
                        type: 'error',
                        size: 'small',
                        icon: 'ios-pause'
                      },
                      on: {
                        click: () => {
                          this.disableSingle(h, params)
                        }
                      }
                    }, '禁用')
                  ])
                ]
              } else {
                let isDisableBtn = [
                  h('Tooltip', {
                    props: {
                      content: '启用',
                      placement: 'top',
                      transfer: true
                    },
                    directives: [
                      {
                        name: 'privilege',
                        value: 'disabled'
                      }
                    ]

                  }, [
                    h('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'ios-play'
                      },
                      on: {
                        click: () => {
                          this.disableSingle(h, params)
                        }
                      }
                    }, '启用')
                  ])
                ]
              }
              btnGroup.push(isDisableBtn)
            }
            if (!isSuper) {
              btnGroup.push(
                h('Tooltip', {
                  props: {
                    content: '密码重置',
                    placement: 'top',
                    transfer: true
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'resetPwd'
                    }
                  ]
                }, [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      icon: 'md-refresh'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '重置密码',
                          content: '是否将密码重置为123456',
                          onOk: () => {
                            this.resetPwdAjax(params.row.id)
                          }
                        })
                      }
                    }
                  }, '密码重置')
                ])
              )
            }
            if (params.row.isDisabled == 1 && !isSuper) {
              btnGroup.push(
                h('Tooltip', {
                  props: {
                    content: '删除',
                    placement: 'top',
                    transfer: true
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'deleteEmployee'
                    }
                  ]
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'md-trash'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '删除',
                          content: '确认删除？',
                          onOk: () => {
                            this.deleteAjax(params.row.id)
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              )
            }
            return h('div', btnGroup)
          }
        }
      ],
      staffTable: [],
      disableId: [],
      buttonProps: {
        type: 'ghost',
        size: 'small'
      },
      currentDisabled: 0,
      getRolesId: []
    }
  },
  computed: {

  },
  mounted () {
    this.query()
  },
  watch: {
    selectDepartment (newData) {
      this.selectDepartment = newData
      this.pageNum = 1
      this.query()
    }
  },
  methods: {
    changePage (pageNum) {
      this.pageNum = pageNum
      this.query()
    },
    query () {
      let param = {
        isDisabled: this.currentDisabled,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      if (this.selectDepartment.type == 1) {
        param.organizationId = this.selectDepartment.id
      }
      if (this.selectDepartment.type == 2) {
        param.departmentId = this.selectDepartment.id
      }
      this.departmentStaffInfo(param)
    },
    // 打开子组件的模态框
    onStaffFlag () {
      if (Object.keys(this.selectDepartment).length == 0) {
        this.$Message.error('请选择部门')
        return
      }
      this.$refs.addStaff.onModal()
    },
    lookStaffInfo (type) {
      this.currentDisabled = type
      this.pageNum = 1
      this.query()
    },
    // 复选框保存角色id
    changeRole (roleId) {
      this.roleId = roleId.join(',')
    },
    // 确定添加角色
    makeSureRole () {
      let roleList = [this.employeeRole]
      this.makeSureAddRole(Object.assign({
        employeeId: this.mid,
        roleIds: roleList
      }))
    },
    // 确认添加角色的后台数据接口
    async getRolesFunc (param) {
      try {
        let result = await departmentApi.getRoles(param)
        if (result.success) {
          this.roleList = result.data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 确认添加角色的后台数据接口
    async makeSureAddRole (param) {
      try {
        let result = await departmentApi.addStaffRole(param)
        if (result.success) {
          this.$Message.success('授权成功')
          this.query()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 点击打开员工角色选择框
    roleManage (h, param) {
      this.mid = param.row.id
      this.employeeRole = param.row.roleId
      this.roleFlag = true
      this.getRolesFunc(param.row.id)
    },
    // 修改员工信息
    updataMsg (detail) {
      this.$refs.addStaff.onModal(detail)
    },
    // 搜索内容匹配
    search (data, argumentObj) {
      let res = data
      let dataClone = data
      for (let argu in argumentObj) {
        if (argumentObj[argu].length > 0) {
          res = dataClone.filter(d => {
            return d[argu].indexOf(argumentObj[argu]) > -1
          })
          dataClone = res
        }
      }
      return res
    },
    // 点击搜索
    handleSearchByName () {
      this.pageNum = 1
      this.lookStaffInfo(0)
    },
    handleSearchByDepartment () {
      this.pageNum = 1
      this.lookStaffInfo(0)
    },
    // 表格左侧复选框，点击保存选中栏信息
    singleSelect (row) {
      this.disableId = row
    },
    // 批量禁用
    GroupDisable (type) {
      if (this.disableId.length == 0) {
        this.$Message.error('请最少选择一项')
        return false
      } else {
        this.currentDisabled = type
        let disableIds = this.disableId.map(e => e.id)
        this.muchDisable(Object.assign({ isDisabled: type, employeeIds: disableIds }))
      }
    },
    // 单个用户禁用
    disableSingle (h, params) {
      let id = params.row.id
      if (params.row.isDisabled == 0) {
        this.disable1(id, 1)// 启用变禁用
        this.lookStaffInfo(0)
      } else {
        this.disable1(id, 0)// 禁用变启用
        this.lookStaffInfo(1)
      }
    },
    // 根据部门ID查询部门员工
    async departmentStaffInfo (param) {
      try {
        param.name = this.searchConName
        param.deptName = this.searchDepartment
        let result = await departmentApi.queryDeportmentStaff(param)
        if (result.success) {
          this.totalPage = result.data.total
          this.staffTable = result.data.list
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 禁用/启用单个用户
    async disable1 (employeeId, status) {
      try {
        let result = await departmentApi.disableOne(employeeId, status)
        if (result.success) {
          if (status) {
            this.$Message.success('禁用成功')
            this.query()
          } else {
            this.$Message.success('启用成功')
            this.lookStaffInfo(1)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 批量禁用多个用户
    async muchDisable (param) {
      try {
        let result = await departmentApi.manyDisable(param)
        if (result.success) {
          this.$Message.success('操作成功')
          this.disableId = []
          this.lookStaffInfo(this.currentDisabled)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async resetPwdAjax (id) {
      try {
        let result = await employeeApi.resetPwd(id)
        if (result.success) {
          this.$Message.success('操作成功')
          this.lookStaffInfo(this.currentDisabled)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async deleteAjax (id) {
      try {
        let result = await employeeApi.deleteEmployee(id)
        if (result.success) {
          this.$Message.success('操作成功')
          this.lookStaffInfo(this.currentDisabled)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>
