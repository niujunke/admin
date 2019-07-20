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
          <template v-for="(parent, index) in parentList">
            <Option :value="parent.id" :key="index">{{parent.name}}</Option>
          </template>
        </Select>
      </Form-item>
      <Form-item :label="privilegeNameTitle+'：'" required prop="name">
        <Input v-model="privilege.name" :placeholder="'请输入'+privilegeNameTitle"></Input>
      </Form-item>
      <Form-item label="功能Key：" required prop="routerKey">
        <Input v-model="privilege.routerKey" placeholder="请输入功能Key"></Input>
      </Form-item>
      <Form-item v-if="privilege.type == 4" label="Url：">
        <Select v-model="privilege.urlArray" multiple filterable>
          <Option v-for="(item,index) in urlList" :value="item.name" :key="index" :label="item.url">
            <span>{{item.url}}</span>
            <span style="float:right;color:#ccc">{{item.comment}}</span>
          </Option>
        </Select>
      </Form-item>
      <Form-item label="类型：">
        <Select v-if="type==2 || type==3" v-model="privilege.type" :disabled="typeDisabled">
          <Option :value="2">子模块</Option>
          <Option :value="3">页面</Option>
        </Select>
        <Select v-else v-model="privilege.type" :disabled="typeDisabled">
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
      <Button type="primary" @click="submitForm">保存</Button>
      <Button type="default" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import { addMenu, editMenu, getAllUrl, privilegeApi } from '@/api/privilege'
import api from "@/api/privilege";
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
    type: Number,
    urlList:Array
  },
  data () {
    return {
      scope: 1, // 权限划分 1管理端权限 2web端权限 ,
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        routerKey: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      privilegeNameTitle: '菜单名称'
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
    type (val) {
      if (val == 4) {
        this.privilegeNameTitle = '功能点名称'
      } else {
        this.privilegeNameTitle = '菜单名称'
      }
    }
  },
  mounted(){
    console.log(this.urlList)
  },
  methods: {
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
