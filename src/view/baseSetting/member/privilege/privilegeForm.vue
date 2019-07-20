<template>
  <Modal
    v-model="show"
    :title="title"
    @on-ok="submitForm()"
    :mask-closable="false"
    :closable="false"
  >
    <Form :label-width="100" ref="privilegeFormRef" :model="privilege" :rules="ruleValidate">
      <Form-item label="父级菜单：" required v-if="parentList && parentList.length > 0" prop="parentId">
        <Select v-model="privilege.parentId" filterable>
          <template v-for="parent in parentList">
            <Option :value="parent.id">{{parent.name}}</Option>
          </template>
        </Select>
      </Form-item>
      <Form-item label="菜单名：" required prop="name">
        <Input v-model="privilege.name" placeholder="请输入菜单名称"></Input>
      </Form-item>
      <Form-item label="功能Key：" required prop="routerKey">
        <Input v-model="privilege.routerKey" placeholder="请输入功能Key"></Input>
      </Form-item>
      <Form-item v-if="privilege.type == 4" label="Url：">
        <Select v-model="privilege.urlArray" multiple filterable>
          <Option v-for="item in urlList" :value="item.url" :key="item.key">{{ item.name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="类型：">
        <Select v-model="privilege.type" :disabled="typeDisabled">
          <Option :value="1">模块</Option>
          <Option :value="2">子模块</Option>
          <Option :value="3">页面</Option>
          <Option :value="4">功能点</Option>
        </Select>
      </Form-item>
      <Form-item label="是否显示：">
        <i-switch v-model="privilege.isShow" size="large">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </Form-item>
    </Form>

    <div slot="footer">
      <Button type="primary" size="small" @click="submitForm">保存</Button>
      <Button type="default" size="small" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import { addMenu, editMenu, getAllUrl, privilegeApi } from '@/api/privilege'

export default {
  name: 'privilegeForm',
  props: {
    typeDisabled: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    parentList: Array,
    title: String,
    isCreate: Boolean,
    privilege: Object,
    type: Number
  },
  data () {
    return {
      scope: 1, // 权限划分 1管理端权限 2web端权限 ,
      urlList: [],
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        routerKey: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    privilege (val) {
      if (val && val.id) {
        this.$nextTick(() => {
          this.$refs['privilegeFormRef'].validateField('name')
          this.$refs['privilegeFormRef'].validateField('routerKey')
        })
      }
    },
    urlList (val) {
      console.log(val)
    }
  },
  mounted () {
    this.getAllUrl()
  },
  methods: {
    getAllUrl () {
      this.$Spin.show()
      console.log(this.scope)
      privilegeApi.getAllUrl(this.scope).then(res => {
        if (res.success) {
          let key = 1
          let data = res.data
          this.urlList = data.map(e => Object.assign({}, { key: key++ }, e))
        }
        this.$Spin.hide()
      })
    },
    cancel () {
      this.$emit('closeModal')
    },
    submitForm () {
      this.$refs['privilegeFormRef'].validate((valid) => {
        if (valid) {
          let { id, name, parentId, routerKey, type, url } = this.privilege
          try {
            let postData = Object.assign({}, //
              { id, name, parentId, routerKey, type, url }, //
              { seq: 0 },
              { scope: 1 }, // 管理端权限
              { isShow: this.privilege.isShow ? 1 : 0 }, //
              { isEnable: this.privilege.isEnable ? 1 : 0 } //
            )
            if (this.privilege.urlArray && this.privilege.urlArray.length == 0) {
              postData.url = ''
            } else {
              postData.url = this.privilege.urlArray.join(',')
            }

            if (this.isCreate) {
              postData.id = null
            }
            this.ajaxSaveData(postData)
          } catch (e) {
            console.log(e)
          }
        } else {
          this.$Message.error('请检查内容是否填写完整参数!')
        }
      })
    },
    async ajaxSaveData (prames) {
      try {
        this.$Spin.show()
        let result = null
        if (this.isCreate) {
          result = await privilegeApi.addMenu(prames)
        } else {
          result = await privilegeApi.editMenu(prames)
        }
        if (result.success) {
          if (prames.id) {
            this.$Message.success('修改成功')
          } else {
            this.$Message.success('添加成功')
          }
        }
        this.$Spin.hide()
        this.$emit('updateMenuSuccess', this.type)
      } catch (e) {
        console.log(e)
        this.$Spin.hide()
      }
    }
  }

}

</script>
