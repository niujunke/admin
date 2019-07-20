<template>
  <div>
    <Modal
      :title="formValidate.id?'编辑成员':'添加成员'"
      @on-visible-change="closeModel"
      v-model="Flag"
      :style="{top: '20px'}"
      :mask-closable="false"
    >
      <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="登录名" prop="loginName">
            <Input
              :disabled="formValidate.id!=null"
              :maxlength="30"
              class="formWidth"
              v-model="formValidate.loginName"
              placeholder="请输入登录名"
              @on-keydown="formValidate.loginName=formValidate.loginName.replace(/^ +| +$/g,'')"
              @on-keyup="formValidate.loginName=formValidate.loginName.replace(/^ +| +$/g,'')"
            />
          </FormItem>
          <FormItem label="姓名" prop="actualName">
            <Input
              class="formWidth"
              :maxlength="30"
              v-model="formValidate.actualName"
              placeholder="请输入姓名"
              @on-keydown="formValidate.actualName=formValidate.actualName.replace(/^ +| +$/g,'')"
              @on-keyup="formValidate.actualName=formValidate.actualName.replace(/^ +| +$/g,'')"
            />
          </FormItem>
          <FormItem label="别名">
            <Input
              v-model="formValidate.nickName"
              :maxlength="30"
              placeholder="请输入别名"
              class="formWidth"
              @on-keyup="formValidate.nickName=formValidate.nickName.replace(/^ +| +$/g,'')"
            />
          </FormItem>
          <FormItem label="身份证">
            <Input
              v-model="formValidate.idCard"
              placeholder="请输入身份证信息"
              class="formWidth"
              @on-blur="changeIdCard(formValidate.idCard)"
              @on-keyup="formValidate.idCard=formValidate.idCard.replace(/^ +| +$/g,'')"
            ></Input>
          </FormItem>
          <FormItem label="手机" prop="phone">
            <Input
              class="formWidth"
              v-model="formValidate.phone"
              placeholder="请输入手机号"
              @on-keyup="formValidate.phone=formValidate.phone.replace(/^ +| +$/g,'')"
            ></Input>
          </FormItem>
          <FormItem label="E-mail" prop="email">
            <Input
              class="formWidth"
              type="email"
              v-model="formValidate.email"
              placeholder="请输入邮箱地址"
            ></Input>
          </FormItem>
          <FormItem label="部门" prop="departmentName" class="selectClass">
            <Input
              class="formWidth"
              v-model="formValidate.departmentName"
              @click.native="showTree"
              placeholder="请选择部门"
              readonly
            >
              <Icon type="ios-arrow-down" slot="suffix" v-if="!treeShow"/>
              <Icon type="ios-arrow-up" slot="suffix" v-else/>
            </Input>
            <div class="departmentWrap">
              <DepartmentEmployeeSelector
                @on-select="depEmpSelect"
                :type="1"
                ref="DepartmentEmployeeSelector"
              ></DepartmentEmployeeSelector>
            </div>
          </FormItem>
          <FormItem label="出生日期" prop="birthday">
            <DatePicker
              class="formWidth"
              type="date"
              :value="formValidate.birthday"
              @on-change="birthDateChange"
              :options="birthDate"
              placeholder="请选择出生日期"
            ></DatePicker>
          </FormItem>
          <FormItem label="密码" v-if="!formValidate.id" prop="loginPwd">
            <Input
              type="password"
              v-model="formValidate.loginPwd"
              placeholder="请输入密码"
              class="formWidth"
              @on-keydown="formValidate.loginPwd=formValidate.loginPwd.replace(/^ +| +$/g,'')"
              @on-keyup="formValidate.loginPwd=formValidate.loginPwd.replace(/^ +| +$/g,'')"
            />
          </FormItem>
          <FormItem label="密码确认" v-if="!formValidate.id" prop="passwordAgain">
            <Input
              type="password"
              v-model="formValidate.passwordAgain"
              placeholder="请输入确认密码"
              class="formWidth"
              @on-keydown="formValidate.passwordAgain=formValidate.passwordAgain.replace(/^ +| +$/g,'')"
              @on-keyup="formValidate.passwordAgain=formValidate.passwordAgain.replace(/^ +| +$/g,'')"
            />
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
import $ from 'jquery'
import departmentApi  from '@/api/department'
import employeeApi  from '@/api/employee'
import  roleApi  from '@/api/role'
// import { dateFormat, utils } from '@/libs/util'
import departmentEmployeeComponents from '@/view/components/employee-department/departmentEmployeeComponents'
import DepartmentEmployeeSelector
  from './department-employee-selector/DepartmentEmployeeSelector'
export default {
  props: {
    selectDepartment: {
      type: Object,
      required: true
    }
  },
  components: {
    DepartmentEmployeeSelector,
    departmentEmployeeComponents
  },
  data () {
    return {
      Flag: false,
      roleList: [],
      treeShow: false,
      formValidateBackup: {},
      formValidate: {
        actualName: '',
        loginName: '',
        nickName: '',
        departmentName: '',
        departmentId: '',
        isDisabled: 0,
        phone: '',
        idCard: '',
        birthday: '',
        loginPwd: '',
        passwordAgain: '',
        email: ''
      },
      ruleValidate: {
        loginName: [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ],
        actualName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        idCard: [
          { required: false, message: '身份证不能为空', trigger: 'blur' },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '身份证格式错误',
            trigger:
              'blur'
          }
        ],
        email: [
          { required: false, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确邮箱格式', trigger: 'blur' }
        ],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'blur' },
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        birthday: [
          { required: false, message: '请选择出生日期', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^(13|14|15|16|17|18)\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
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
    //let dateStr = utils.getDateStr(0, dateFormat.YMDHM)
    //this.formValidate.createDate = dateStr
    Object.assign(this.formValidateBackup, this.formValidate)
    this.loadRole()
  },
  methods: {
    // 部门树形图的显示与隐藏
    showTree () {
      if (this.treeShow) {
        this.treeShow = false
        $('.departmentWrap').hide()
      } else {
        this.treeShow = true
        $('.departmentWrap').show()
      }
    },
    depEmpSelect (dept) {
      this.$set(this.formValidate, 'departmentId', dept.id)
      this.$set(this.formValidate, 'departmentName', dept.name)
      this.treeShow = false
      $('.departmentWrap').hide()
    },
    closeModel (value) {
      if (!value) {
        this.formValidate = Object.assign({}, this.formValidateBackup)
      }
    },
    birthDateChange (e) {
      this.formValidate.birthday = e
    },
    // 打开Modal
    onModal (row) {
      if (row == undefined) {
        this.ruleValidate.loginPwd = [
          { required: true, message: '密码长度至少为6位，不允许输入空格', trigger: 'blur', min: 6 },
          { pattern: /^[0-9]{6,10}$/, message: '密码格式错误', trigger: 'blur' }
        ]
        this.ruleValidate.passwordAgain = [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: this.loginPwd, trigger: 'blur'
          },
          { pattern: /^[0-9]{6,10}$/, message: '确认密码格式错误', trigger: 'blur' }
        ]
        this.ruleValidate.loginName = [
          { required: true, message: '登录名不能为空', trigger: 'blur' },
          {
            pattern: /^[A-Za-z]+[A-Za-z0-9]{5,17}$/,
            message: '请输入6位或6位字符以上(英文+数字)，第一个字符必须为英文字母',
            trigger:
                'blur'
          }
        ]
      } else {
        delete this.ruleValidate.loginPwd
        delete this.ruleValidate.passwordAgain
        this.ruleValidate.loginName = [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ]
      }
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
        if (!/^[A-Za-z]+[A-Za-z0-9]{5,17}$/.test(this.formValidate.loginName) && !this.formValidate.id) {
          this.$Message.error('登录名格式不正确！')
          return
        }
        if (this.formValidate.idCard) {
          if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.formValidate.idCard)) {
            this.$Message.error('身份证号码格式不正确！')
            return
          }
        }
        const reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        if (reg.test(this.formValidate.actualName)) {
          this.$Message.error('姓名中不能含有特殊字符！')
          return false
        }
        if (this.formValidate.passwordAgain != this.formValidate.loginPwd) {
          this.$Message.error('两次输入密码不一致，请重新输入！！')
          return
        }
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
        let result = await employeeApi.updateEmployee(data)
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
        let result = await employeeApi.addEmployee(param)
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
    },
    changeIdCard (value) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value)) {
        var data = value.slice(6, 14)
        var y = data.slice(0, 4)
        var m = data.slice(4, 6)
        var d = data.slice(6, 8)
        this.formValidate.birthday = y + '-' + m + '-' + d
      }
    }
  }
}
</script>
<style scoped>
    .formWidth {
      width: 300px;
    }
    .departmentWrap {
    position: absolute;
    background-color: #ffffff;
    padding: 5px;
    border: 1px solid #dedede;
    width: 300px;
    z-index: 9;
    display: none;
    height: 250px;
    overflow-y: scroll;
  }
  .selectClass{
    position: relative;
  }
</style>
