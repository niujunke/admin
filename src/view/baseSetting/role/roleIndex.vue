<template>
  <!--角色管理-->
  <Row :gutter="10">
    <Col :md="8" :lg="5">
      <Card class="warp-card">
        <p slot="title">角色列表</p>
        <div slot="extra">
          <Button type="primary" size="small" @click="addRole()" v-privilege="'add'">添加</Button>
        </div>
        <Menu
          :active-name="0"
          ref="side_menu"
          class="left"
          style="height: 666px;overflow-y: scroll;width:100%;"
        >
          <MenuItem
            v-for="(item,index) in roleList"
            :key="item.id"
            :name="index"
            @click.native="roleChange(item,index)"
          >
            <Row>
              <Col span="24">
                {{item.roleName}}
                <Tooltip content="删除" :transfer="true" style="float:right;">
                  <Button
                    v-privilege="'delete'"
                    type="text"
                    shape="circle"
                    icon="ios-trash"
                    @click="deleteRule(item)"
                  ></Button>
                </Tooltip>
                <Tooltip content="编辑" :transfer="true" style="float:right;">
                  <Button
                    v-privilege="'update'"
                    type="text"
                    shape="circle"
                    icon="ios-create"
                    @click="redactRole(item)"
                  ></Button>
                </Tooltip>
                <!--                                <Tooltip v-privilege="'disabled'" v-if="!item.isDisabled" content="禁用" :transfer="true" style="float:right;">-->
                <!--                                  <Button type="text" shape="circle" icon="ios-pause"-->
                <!--                                          @click.navite="updateDisabled(item.id,1)"></Button>-->
                <!--                                </Tooltip>-->
                <!--                                <Tooltip v-privilege="'disabled'" v-if="item.isDisabled" content="启用" :transfer="true" style="float:right;">-->
                <!--                                  <Button type="text" shape="circle" icon="ios-play"-->
                <!--                                          @click.navite="updateDisabled(item.id,0)"></Button>-->
                <!--                                </Tooltip>-->
              </Col>
            </Row>
          </MenuItem>
        </Menu>
        <!--添加角色-->
        <Modal v-model="addRoleShow" title="添加角色">
          <Form :model="ruleDetail" label-position="left" :label-width="100">
            <FormItem label="角色名称" required>
              <Input
                v-model="ruleDetail.name"
                placeholder="请输入角色名称..."
                @on-keydown="ruleDetail.name=ruleDetail.name.replace(/^ +| +$/g,'')"
                @on-keyup="ruleDetail.name=ruleDetail.name.replace(/^ +| +$/g,'')"
              ></Input>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="ruleDetail.detail" placeholder="请输入备注"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="submitRule">确认</Button>
            <Button @click="editRule(false)">返回</Button>
          </div>
        </Modal>
        <!--修改角色-->
        <Modal v-model="redactRoleShow" title="修改角色">
          <Form :model="ruleDetail" label-position="left" :label-width="100">
            <FormItem label="角色名称" required>
              <Input
                v-model="ruleDetail.name"
                placeholder="请输入角色名称..."
                @on-keydown="ruleDetail.name=ruleDetail.name.replace(/^ +| +$/g,'')"
                @on-keyup="ruleDetail.name=ruleDetail.name.replace(/^ +| +$/g,'')"
              ></Input>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="ruleDetail.detail" placeholder="请输入备注"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="edittoRule">确认</Button>
            <Button @click="editRule(true)">返回</Button>
          </div>
        </Modal>
        <!--删除角色-->
        <Modal
          v-model="trueRemoveShow"
          title="删除角色"
          @on-ok="trueDelate()"
          @on-cancel="noDelate()"
        >确定删除"{{ruleDetail.name}}"这个角色吗？</Modal>
      </Card>
    </Col>
    <!--Tab切换部分-->
    <Col :md="16" :lg="19">
      <Card class="warp-card">
        <div slot="title" class="card-title">功能列表</div>
        <Menu mode="horizontal" @on-select="power" :active-name="displayTab" style="z-index: 1">
          <MenuItem :name="1">
            <Icon type="ios-hammer" />功能权限
          </MenuItem>
          <MenuItem :name="2">
            <Icon type="ios-paper" />数据范围
          </MenuItem>
          <MenuItem :name="3">
            <Icon type="ios-people" />成员管理
          </MenuItem>
        </Menu>
        <!--功能权限-->
        <role-tree :roleId="roleId" v-if="displayTab==1"></role-tree>
        <!--数据范围-->
        <role-data-scope :roleId="roleId" v-if="displayTab==2"></role-data-scope>
        <!--成员管理-->
        <role-list :roleId="roleId" v-if="displayTab==3"></role-list>
      </Card>
    </Col>
  </Row>
</template>
<script>
import RoleTree from "./roleTree";
import RoleList from "./roleList";
import RoleDataScope from "./roleDataScope";
import api from "@/api/role";

export default {
  components: { RoleTree, RoleList, RoleDataScope },
  name: "roleIndex",
  data() {
    return {
      roleList: {},
      roleId: 0,
      trueRemoveShow: false, // 删除角色对话框隐藏
      redactRoleShow: false, // 修改角色对话框隐藏
      addRoleShow: false, // 增加角色对话框隐藏
      conIndex: 0,
      formLeft: {},
      ruleDetail: {
        // 增加角色信息
        name: "",
        id: "",
        detail: ""
      },
      tree: [],
      smailTree: [],
      displayTab: 1,
      first: 0
    };
  },
  computed: {},
  // 自动加载钩子
  mounted() {
    this.loadList();
    //this.smailTree = this.tree[0]
  },
  methods: {
    // 初始化加载数据方法
    async loadList() {
      try {
        let result = await api.getAllRole();
        this.roleList = result.data;
        if (this.roleList && this.roleList.length > 0) {
          this.roleId = this.roleList[0].id;
          this.$nextTick(() => {
            this.$refs.side_menu.updateOpened()
            this.$refs.side_menu.updateActiveName();
          });
        }
      } catch (e) {}
    },
    // 增加角色方法
    addloadRole(roleDesc, roleName) {
      this.$Spin.show();
      roleApi.addRole(roleDesc, roleName).then(res => {
        if (res.success) {
          this.editRule(false);
          this.loadList(); // 刷新
        }
        this.$Spin.hide();
      });
    },
    // 提交添加角色
    submitRule() {
      // 添加
      if (this.ruleDetail.name != "" && this.ruleDetail.name.length <= 20) {
        this.addloadRole(this.ruleDetail.detail, this.ruleDetail.name);
      } else {
        this.$Message.warning("请先完善角色信息");
      }
    },
    // 编辑角色方法
    editRolefun(id, roleDesc, roleName) {
      this.$Spin.show();
      roleApi.updateRole(id, roleDesc, roleName).then(res => {
        if (res.success) {
          this.roleList = res.data;
          this.editRule(true);
          this.loadList(); // 刷新
        }
        this.$Spin.hide();
      });
    },
    // 编辑
    edittoRule() {
      this.editRolefun(
        this.ruleDetail.id,
        this.ruleDetail.detail,
        this.ruleDetail.name
      );
    },
    // 删除角色方法
    deleteRolefun(id) {
      this.$Spin.show();
      roleApi.deleteRole(id).then(res => {
        if (res.success) {
          this.$Message.success("删除成功");
          this.loadList(); // 刷新
        }
        this.$Spin.hide();
      });
    },
    // 删除单个角色
    deleteRule(item) {
      this.trueRemoveShow = true;
      this.ruleDetail.id = item.id;
      this.ruleDetail.name = item.roleName;
    },
    // 编辑角色页面
    redactRole(item) {
      console.log(item);
      this.redactRoleShow = true;
      this.ruleDetail.id = item.id;
      this.ruleDetail.name = item.roleName;
      this.ruleDetail.detail = item.remark;
    },
    // updateDisabled (id, isDisabled) {
    //   this.$Spin.show()
    //   roleApi.disabled(id, isDisabled).then(res => {
    //     if (res.success) {
    //       let msg = '禁用成功'
    //       if (!isDisabled) {
    //         msg = '启用成功'
    //       }
    //       this.$Message.success(msg)
    //       this.loadList()// 刷新
    //     }
    //     this.$Spin.hide()
    //   })
    // },
    // 添加角色页面
    addRole() {
      this.addRoleShow = true;
      this.ruleDetail.name = "";
      this.ruleDetail.detail = "";
    },
    // 取消添加角色操作
    editRule(update) {
      if (update) {
        this.redactRoleShow = false;
      } else {
        this.addRoleShow = false;
      }
    },
    // 功能选择
    power(name) {
      this.displayTab = name;
    },
    // 角色选择
    roleChange(item, index) {
      this.conIndex = index;
      this.roleId = item.id;
      this.smailTree = item;
    },
    // 确定删除
    trueDelate() {
      this.deleteRolefun(this.ruleDetail.id);
      this.trueRemoveShow = false;
    },
    // 取消删除
    noDelate() {
      this.trueRemoveShow = false;
    }
  }
};
</script>
