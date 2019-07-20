<template>
    <div>
        <Modal :title="formValidate.id?'编辑成员':'添加成员'" @on-visible-change="closeModel" v-model="Flag"
               :style="{top: '20px'}" :width="1000">
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
                  <FormItem label="姓名" prop="name">
                      <Input class="formWidth" v-model="formValidate.name" placeholder="请输入姓名"
                             @on-keydown="formValidate.name=formValidate.name.replace(/^ +| +$/g,'')"
                             @on-keyup="formValidate.name=formValidate.name.replace(/^ +| +$/g,'')"
                      />
                  </FormItem>
                  <FormItem label="登录名" prop="loginName">
                    <Input class="formWidth" v-model="formValidate.loginName" placeholder="请输入登录名"></Input>
                  </FormItem>
                  <FormItem label="别名">
                    <Input class="formWidth" v-model="formValidate.nickname" placeholder="请输入登录名"></Input>
                  </FormItem>
                  <FormItem label="部门">
                    <departmentEmployeeComponents ref="department" class="formWidth" ></departmentEmployeeComponents>
                  </FormItem>
                  <FormItem label="手机" prop="phone">
                    <Input class="formWidth" v-model="formValidate.phone" placeholder="请输入手机"></Input>
                  </FormItem>
                  <FormItem label="身份证">
                    <Input class="formWidth" v-model="formValidate.idCard" placeholder="请输入登录名"></Input>
                  </FormItem>
                  <FormItem label="出生日期" prop="birthday">
                    <DatePicker type="date" v-model="formValidate.birthday" :options="birthDate"
                                placeholder="请输入出生日期" style="width: 100%"></DatePicker>
                  </FormItem>
                  <FormItem label="电子邮箱" prop="email">
                    <Input class="formWidth" v-model="formValidate.email" placeholder="请输入邮箱"></Input>
                  </FormItem>
                  <FormItem label="密码" prop="loginPwd">
                    <Input type="password" class="formWidth" v-model="formValidate.loginPwd" placeholder="请输入密码"></Input>
                  </FormItem>
                  <FormItem label="状态" required>
                    <RadioGroup v-model="formValidate.isDisabled">
                      <Radio :label="0">启用</Radio>
                      <Radio :label="1">禁用</Radio>
                    </RadioGroup>
                  </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long class="newBtn" @click="onPut">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { departmentApi } from '@/api/department'
import { roleApi } from '@/api/role'
import { dateFormat, utils } from '@/libs/util'
import departmentEmployeeComponents from '@/view/components/employee-department/departmentEmployeeComponents'

export default {
  props: {
    selectDepartment: {
      type: Object,
      required: true
    }
  },
  components: {
    departmentEmployeeComponents
  },
  data () {
    return {
      Flag: false,
      roleList: [],
      formValidateBackup: {},
      formValidate: {
        actualName: '',
        loginName: '',
        nickname: '',
        departmentName: '',
        departmentId: '',
        isDisabled: '',
        phone: '',
        idCard: '',
        birthday: '',
        loginPwd: '',
        email: ''
      },
      ruleValidate: {
        name: [
          // { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        // roleId: [
        //   {
        //     validator (rule, value, callback, source, options) {
        //       var errors = []
        //       if (!value) {
        //         callback('角色不能为空')
        //       }
        //       callback(errors)
        //     }
        //   }
        // ],
        email: [
          { required: false, message: '' },
          { type: 'email', message: '请输入正确邮箱格式', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '手机不能为空', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机号格式错误', trigger: 'change' }
        ]
      },
      birthDate: {
        shortcuts: [
          {
            text: '今天',
            value () {
              return new Date()
            },
            onClick: (picker) => {
              this.$Message.info('你选择的是今天')
            }
          },
          {
            text: '昨天',
            value () {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              return date
            },
            onClick: (picker) => {
              this.$Message.info('你选择的是昨天')
            }
          },
          {
            text: '一周前',
            value () {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              return date
            },
            onClick: (picker) => {
              this.$Message.info('你选择的是一周前')
            }
          }
        ]
      }
    }
  },
  mounted () {
    let dateStr = utils.getDateStr(0, dateFormat.YMDHM)
    this.formValidate.createDate = dateStr
    Object.assign(this.formValidateBackup, this.formValidate)
    this.loadRole()
  },
  methods: {
    closeModel (value) {
      if (!value) {
        this.formValidate = Object.assign({}, this.formValidateBackup)
      }
    },
    // 打开Modal
    onModal (row) {
      this.$refs['formValidate'].resetFields()
      if (row && Object.keys(row).length > 0) {
        this.formValidate = Object.assign({}, row)
      } else {
        if (Object.keys(this.selectDepartment).length > 0) {
          if (this.selectDepartment.type == 1) {
            this.formValidate.departmentId = null
            this.formValidate.departmentName = null
            this.formValidate.organizationId = this.selectDepartment.id
            this.formValidate.organizationName = this.selectDepartment.name
          } else {
            this.formValidate.departmentId = this.selectDepartment.id
            this.formValidate.departmentName = this.selectDepartment.name
            this.formValidate.organizationId = this.selectDepartment.organizationId
            this.formValidate.organizationName = this.selectDepartment.organizationName
          }
        }
      }
      this.Flag = true
    },
    onPut () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if (this.formValidate.id) {
            this.updateStaff(this.formValidate)
          } else {
            this.newStaff(this.formValidate)
          }
        }
      })
    },
    async updateStaff (data) {
      try {
        let result = await departmentApi.updateEmployee(data)
        if (result.success) {
          this.Flag = false
          this.$Message.success('修改成员成功')
          this.$emit('addSuccess')
          this.$refs['formValidate'].resetFields()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 添加新用户接口
    async newStaff (param) {
      try {
        let result = await departmentApi.addStaffs(param)
        if (result.success) {
          this.Flag = false
          this.$Message.success('添加成员成功')
          this.$emit('addSuccess')
          this.$refs['formValidate'].resetFields()
        }
      } catch (e) {
        console.log(e)
      }
    },
    nameChange () {
      if (!this.formValidate.name) {

      }
    },
    async loadRole () {
      try {
        let result = await roleApi.getAllRole()
        if (result.success) {
          this.roleList = result.data
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
    .formWidth {
      width: 200px;
    }
</style>
