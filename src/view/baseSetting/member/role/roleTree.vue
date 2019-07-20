<template>
  <!--功能权限部分-->
  <div id="tree">
    <Row>
      <Col span="16" style="margin:20px 0;font-size: 15px;color: #95a5a6;">设置角色对应的功能操作、后台管理权限</Col>
      <Col span="8" class="button_style">
        <Button
          type="primary"
          @click.native="saveChange()"
          v-privilege="'updateRole'"
          style="margin-right: 20px;"
        >保存</Button>
      </Col>
    </Row>

    <CheckboxGroup v-model="checkedData" @on-change>
      <Row>
        <Col span="24" class="stair" style="height: 540px;overflow-y: scroll; padding: 10px 20px">
          <!--循环得到模块-->
          <Row
            style="border-bottom: 1px solid #f0f0f0;font-size: 20px;font-weight: 400;"
            v-for="(module,moduleIndex) in tree"
            :key="module.id"
          >
            <Col style="border-bottom: 1px solid #f0f0f0;padding: 10px 0" span="24">
              <Checkbox
                :label="module.id"
                @click.prevent.native="selectCheckbox(tree,moduleIndex)"
              >{{module.name}}</Checkbox>
            </Col>
            <!--循环得到子模块-->
            <Row
              style="border-bottom: 1px solid #f0f0f0;font-size: 20px;font-weight: 400;"
              v-for="(childrenModule,childrenModuleIndex) in module.childrenModule"
              :key="childrenModule.id"
            >
              <!--一个空栅格-->
              <Col :xs="1" :sm="1" :md="1" :lg="1">&nbsp;</Col>
              <Col span="23" style="border-bottom: 1px solid #f0f0f0;padding: 10px 0">
                <Checkbox
                  :label="childrenModule.id"
                  @click.prevent.native="selectCheckbox(module.childrenModule,childrenModuleIndex,tree)"
                >{{childrenModule.name}}</Checkbox>
              </Col>
              <!--循环得到页面-->
              <Row
                style="border-bottom: 1px solid #f0f0f0;font-size: 20px;font-weight: 400;"
                v-for="(pages,pagesIndex) in childrenModule.pages"
                :key="pages.id"
              >
                <!--两个空栅格-->
                <Col :xs="2" :sm="2" :md="2" :lg="2">&nbsp;</Col>
                <Col
                  :xs="8"
                  :sm="6"
                  :md="4"
                  :lg="3"
                  style="border-bottom: 1px solid #f0f0f0;padding: 10px 0"
                >
                  <Checkbox
                    :label="pages.id"
                    @click.prevent.native="selectCheckbox(childrenModule.pages,pagesIndex,module.childrenModule)"
                  >{{pages.name}}</Checkbox>
                </Col>
                <!--循环得到功能点-->
                <Col :xs="14" :sm="16" :md="18" :lg="19" style="border-left: 1px solid #f0f0f0;">
                  <div
                    style="float: left;margin: 10px 10px;text-align: center"
                    v-for="(points,pointsIndex) in pages.points"
                    :key="points.id"
                  >
                    <Checkbox
                      :label="points.id"
                      @click.prevent.native="selectCheckbox(pages.points,pointsIndex,childrenModule.pages,module.childrenModule)"
                    >{{points.name}}</Checkbox>
                  </div>
                </Col>
              </Row>
            </Row>
          </Row>
        </Col>
      </Row>
    </CheckboxGroup>
  </div>
</template>
<script>
// import {
//   getlistPowerList, // 获取角色可选的功能权限
//   getRolePower, // 更新角色权限
//   roleApi } from '@/api/role'

export default {
  name: 'roleTree',
  props: ['roleId'],
  components: {},
  // 父级组件数据传递
  data () {
    return {
      tog: 'ios-arrow-down',
      datajson: [],
      tree: [],
      loading: false,
      RolePower: {
        privilegeIdList: [],
        roleId: ''
      },
      changeList: [],
      checkedData: []
    }
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    roleId (newVal) {
      if (newVal) {
        this.getlistPowerListFunc(newVal)
      }
    }
  },
  methods: {
    selectCheckbox (currentModuleList, moduleIndex, upOneModuleList, upTwoModuleList) {
      let module = currentModuleList[moduleIndex]
      let findIndex = this.checkedData.indexOf(module.id) // 勾选
      if (findIndex == -1) {
        // 选中子级所有checkBox
        this.addCheck(module)
        // 选中上级组件
        if (module.parentId) {
          if (this.checkedData.indexOf(module.parentId) == -1) {
            this.checkedData.push(module.parentId)
          }
        }
        // 选中上上级组件
        if (upOneModuleList) {
          let upOneFindIndex = upOneModuleList.findIndex(e => e.id === module.parentId)
          let upOneFind = upOneFindIndex == -1 ? null : upOneModuleList[upOneFindIndex]
          if (upOneFind && this.checkedData.indexOf(upOneFind.parentId) == -1) {
            this.checkedData.push(upOneFind.parentId)
          }
          // 选中上上上级组件
          if (upTwoModuleList) {
            let upTwoFindIndex = upTwoModuleList.findIndex(e => e.id === upOneFind.parentId)
            let upTwoFind = upTwoFindIndex == -1 ? null : upTwoModuleList[upTwoFindIndex]
            if (upTwoFind && this.checkedData.indexOf(upTwoFind.parentId) == -1) {
              this.checkedData.push(upTwoFind.parentId)
            }
          }
        }
      } else {
        // 取消勾选
        // 取消选中子级所有checkBox
        this.spliceCheck(module)
        // 取消的上级ID
        // 判断同级是否全部已取消勾选
        let currentLevelAllUnchecked = this.cancelThisLevelChecked(currentModuleList)
        if (currentLevelAllUnchecked && upOneModuleList) {
          // 判断上级是否全部已取消勾选
          let upOneLevelAllUnchecked = this.cancelThisLevelChecked(upOneModuleList)
          if (upOneLevelAllUnchecked && upTwoModuleList) {
            // 判断上上级是否全部已取消勾选
            this.cancelThisLevelChecked(upTwoModuleList)
          }
        }
      }
    },
    cancelThisLevelChecked (moduleList) {
      let thisLevelAllUnchecked = true
      moduleList.forEach(e => {
        let brotherIndex = this.checkedData.indexOf(e.id)
        if (brotherIndex != -1) {
          thisLevelAllUnchecked = false
        }
      })
      if (thisLevelAllUnchecked) {
        let number = this.checkedData.findIndex(e => e == moduleList[0].parentId)
        if (number != -1) {
          this.checkedData.splice(number, 1)
        }
      }
      return thisLevelAllUnchecked
    },
    addCheck (module) {
      let findIndex = this.checkedData.indexOf(module.id)
      if (findIndex == -1) {
        this.checkedData.push(module.id)
      }
      if (module.childrenModule) {
        module.childrenModule.forEach((e) => {
          this.addCheck(e)
        })
      }
      if (module.pages) {
        module.pages.forEach(e => {
          this.addCheck(e)
        })
      }
      if (module.points) {
        module.points.forEach(e => {
          this.addCheck(e)
        })
      }
    },
    spliceCheck (module) {
      let findIndex = this.checkedData.indexOf(module.id)
      if (findIndex != -1) {
        this.checkedData.splice(findIndex, 1)
      }
      if (module.childrenModule) {
        module.childrenModule.forEach(e => {
          this.spliceCheck(e)
        })
      }
      if (module.pages) {
        module.pages.forEach(e => {
          this.spliceCheck(e)
        })
      }
      if (module.points) {
        module.points.forEach(e => {
          this.spliceCheck(e)
        })
      }
    },
    saveChange () {
      this.RolePower.roleId = this.roleId
      this.RolePower.privilegeIdList = this.checkedData.concat()
      this.getRolePowerFunc(this.RolePower)
    },
    // 更新角色功能权限方法
    getRolePowerFunc (data) {
      this.$Spin.show()
      roleApi.getRolePower(data).then(res => {
        if (res.code) {
          this.$Message.info('保存成功')
          this.RolePower.privilegeIdList = []
          this.getlistPowerListFunc(this.roleId)
        } else {
          this.$Message.error(res.msg)
        }
        this.$Spin.hide()
      })
    },
    // 获取角色可选的功能权限
    getlistPowerListFunc (id) {
      this.$Spin.show()
      roleApi.getlistPowerList(id).then(res => {
        if (res.code) {
          let datas = res.data
          this.tree = datas.privilege
          this.checkedData = datas.selectedIds
        } else {
          this.$Message.error(res.msg)
        }
        this.$Spin.hide()
      })
    }
  }
}
</script>

<style scoped>

    #tree{
        border: 1px solid #f0f0f0;
    }
    .button_style{
        margin: 20px 0 20px 0;
        padding-left:20px;
        text-align: right;
    }
    .check_right{
        margin-right: 20px;
    }
    .row_border{
        border:1px solid #f0f0f0;
    }
    .col_border{
        line-height: 50px;
        padding-left: 20px;
        border-right: 1px solid #f0f0f0;
    }
    .col_left{
        line-height: 50px;
        padding-left: 40px;
        border-right: 1px solid #f0f0f0;
    }
    .col_right{
        padding-left: 20px;
        border-right: 1px solid #f0f0f0;
    }
    .stair{
        font:"宋体";
    }
</style>
<style lang="less" scoped>
.ivu-tree ul li {
  white-space: normal;
}
.ivu-tree {
  > ul {
    > li {
      > ul {
        > li {
          .ivu-tree-title {
            vertical-align: middle;
            font-weight: bold;
          }
          > ul {
            display: inline-block;
            .ivu-tree-title {
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}
</style>
