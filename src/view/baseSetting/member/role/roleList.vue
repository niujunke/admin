<template>
  <!--tab切换成员列表部分-->
  <div>
    <!--<Modal-->
    <!--title="添加成员"-->
    <!--v-model="tog"-->
    <!--class-name="vertical-center-modal">-->
    <!--<Transfer></Transfer>-->
    <!--</Modal>-->
    <Row>
      <Col span="16" style="margin:20px 0;font-size: 15px;color: #95a5a6;">管理拥有当前角色权限的人员列表</Col>
      <Col span="8" style="margin:20px 0; text-align: right;">
        <Button type="primary" @click="render" v-privilege="'addEmployee'" size="large">添加成员</Button>
      </Col>
    </Row>
    <Table
      border
      ref="selection"
      :columns="columns"
      :data="data"
      @on-selection-change="selectChange"
    ></Table>
    <Row type="flex" justify="end" class="page">
      <Col span="6" order="1" style="margin:20px 0;">
        <Button
          type="error"
          size="large"
          @click="removeSome()"
          v-privilege="'batchRemoveEmployee'"
        >移除</Button>
      </Col>
      <Col span="18" order="2" style="text-align: right;">
        <Page
          :total="total"
          :page-size="pageSize"
          :current="currentPage"
          @on-change="changePage"
          show-elevator
        ></Page>
      </Col>
    </Row>
    <!--穿梭框-->
    <modal
      title="添加成员"
      v-model="showEmployeeModal"
      style="min-width:1800px"
      @on-ok="addEmployeeTrue()"
    >
      <Row style="position: relative;">
        <Col span="10" style=" border:2px solid #f0f0f0;border-radius: 10px;">
          <Row>
            <Col
              span="24"
              style="border-radius:10px;font-size: 20px;background:#a2a2a2;color: #fff;text-align: center"
            >员工列表</Col>
          </Row>
          <Row>
            <Col
              span="24"
              id="goRight"
              style="height: 290px;overflow-y:scroll"
              @dblclick.native="getCharge"
            >
              <DepartmentEmployeeSelector ref="DepartmentEmployeeSelector"></DepartmentEmployeeSelector>
            </Col>
          </Row>
        </Col>
        <Col span="4" style="text-align: center;">
          <Icon
            type="md-arrow-round-forward"
            size="50"
            style="line-height: 300px"
            @click.native="getCharge"
          ></Icon>
        </Col>
        <Col span="10" style="border:2px solid #f0f0f0;border-radius: 10px;height: 330px;">
          <Row>
            <Col
              span="24"
              style="border-radius:10px;font-size: 20px;background:#a2a2a2;color: #fff;text-align: center"
            >成员列表</Col>
            <Col span="24" style="overflow-y:scroll;height: 290px;text-align: center">
              <Row v-for="(item,index) in manageAdd" :key="index">
                <Col span="24" style="font-size: 15px;text-align: center;">
                  <icon type="ios-people"></icon>
                  {{item.manageName}}
                  <Button @click.native="catCharge(index)" type="text" icon="md-close"></Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </modal>
  </div>
</template>
<script>
import DepartmentEmployeeSelector
  from '../department/components/department-employee-selector/DepartmentEmployeeSelector'
// import { roleApi } from '@/api/role'

export default {
  name: 'roleList',
  components: {
    DepartmentEmployeeSelector
  },
  props: {
    roleId: {
      type: Number,
      required: true
    }
  },

  computed: {
  },
  // 数据
  data () {
    return {
      showEmployeeModal: false,
      removeList: [],
      currentPage: 1,
      tog: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '登录名',
          key: 'loginName'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '手机号',
          key: 'mobilePhone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '机构',
          key: 'organizationName'
        },
        {
          title: '部门',
          key: 'departmentName'
        },
        {
          title: '操作',
          key: 'operation ',
          width: 100,
          align: 'center',
          className: 'action-hide',
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                content: '移除',
                placement: 'top'
              },
              directives: [
                {
                  name: 'privilege',
                  value: 'removeEmployee'
                }
              ]
            }, [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '移除')
            ])
          }
        }
      ],
      employeeData: {
        // orderby:'',
        roleId: '',
        pageNum: 1,
        pageSize: 10,
        sort: ''
      },
      listDepartmentEmployee: {},
      data: [],
      manageAdd: [],
      alert: false,
      manage: {
        employeeIds: [],
        roleId: 0
      },
      removeId: [],
      total: 0,
      pageSize: 0

    }
  },
  mounted () {
    this.employeeData.roleId = this.roleId
    this.getlistEmployeeFunc(this.employeeData)
  },
  methods: {
    // 批量删除
    removeSome: function () {
      let Obj = {}
      Obj.employeeIds = this.removeId.slice(0, this.removeId.length)
      Obj.roleId = this.roleId
      if (Obj.employeeIds.length <= 0) {
        this.$Message.error('请先选择要移除的成员')
      } else {
        this.removeEmployeeListFunc(Obj)// 删除
      }
    },
    catCharge (index) {
      this.manageAdd.splice(index, 1)
    },
    // 批量删除方法
    removeEmployeeListFunc (param) {
      this.$Spin.show()
      roleApi.removeEmployeeList(param).then(res => {
        if (res.success) {
          this.getlistEmployeeFunc(this.employeeData)// 刷新数据
        }
        this.$Spin.hide()
      })
    },
    // 选项框多选移除
    selectChange (selection) {
      this.removeId = []
      for (var i = 0; i < selection.length; i++) {
        this.removeId.push(selection[i].employeeId)
      }
      ;
      console.log(this.removeId)
    },
    // 移除当前项
    remove: function (index) {
      let Obj = {}

      Obj.employeeId = this.data[index].employeeId
      Obj.roleId = this.roleId
      this.emoveEmployeeRoleFunc(Obj)
    },
    // 删除角色成员方法
    emoveEmployeeRoleFunc (param) {
      this.$Spin.show()
      roleApi.removeEmployeeRole(param).then(res => {
        if (res.success) {
          this.currentPage = res.data.pageNum
          this.getlistEmployeeFunc(this.employeeData)
        }
        this.$Spin.hide()
      })
    },
    // 分页改变获取数据方法
    // 分页器
    changePage (num) {
      console.log(num)
      let Obj = {}
      Obj.roleId = this.roleId
      this.currentPage = num
      Obj.pageNum = num
      Obj.pageSize = this.pageSize
      Obj.sort = ''
      this.getlistEmployeeFunc(Obj)
    },
    // 确定添加角色成员
    addEmployeeTrue () {
      this.manage.employeeIds = []
      this.manageAdd.forEach((e) => {
        this.manage.employeeIds.push(e.manageId)
      })
      // if(this.manage.length<=0){
      //     this.$Message.warming('')
      // }
      this.manage.roleId = this.roleId
      this.addEmployeeListRoleFunc(this.manage)
      this.getlistEmployeeFunc(this.employeeData)// 刷新表格
    },
    // 添加角色成员方法
    addEmployeeListRoleFunc (param) {
      this.$Spin.show()
      roleApi.addEmployeeListRole(param).then(res => {
        if (res.success) {
          this.employeeData.roleId = this.roleId
          this.getlistEmployeeFunc(this.employeeData)
        }
        this.$Spin.hide()
      })
    },
    // 穿梭框穿梭方法
    getCharge () {
      let obj = this.$refs.DepartmentEmployeeSelector.getSelect()
      let Obj = {}
      var notHave = true
      Obj.manageName = obj.employeeName
      Obj.manageId = obj.employeeId
      for (var i = 0; i < this.manageAdd.length; i++) {
        if (this.manageAdd[i].manageId == Obj.manageId) {
          notHave = false
          break
        }
      }
      if (notHave == true) {
        notHave = false
        this.manage.employeeIds.push(Obj.manageId)
        this.manageAdd.push(Obj)
      }
    },
    // 获取角色id对应的成员列表方法
    getlistEmployeeFunc (param) {
      this.$Spin.show()
      roleApi.getlistEmployee(param).then(res => {
        if (res.success) {
          this.roleList = res.data
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.data = this.roleList.list
          this.getlistAllEmployeeFunc()
        }
        this.$Spin.hide()
      })
    },
    // 获取角色id对应的全部成员列表方法
    getlistAllEmployeeFunc () {
      this.$Spin.show()
      roleApi.getAlllistEmployee(this.roleId).then(res => {
        if (res.success) {
          let list = res.data
          this.manageAdd = []
          for (let i = 0; i < list.length; i++) {
            let Obj = {}
            Obj.manageName = list[i].name
            Obj.manageId = list[i].employeeId
            this.manageAdd.push(Obj)
          }
        }
        this.$Spin.hide()
      })
    },
    // 添加成员方法，
    render () {
      this.showEmployeeModal = true
      let obj = this.$refs.DepartmentEmployeeSelector.getSelect()
      this.getlistAllEmployeeFunc()
      this.tog = true
      this.manage.employeeIds = []
    }
  }
}
</script>

<style scoped>

</style>
