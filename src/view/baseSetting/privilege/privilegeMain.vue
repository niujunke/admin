<template>
  <Row :gutter="10">
    <!--菜单管理-->
    <Col :lg="6" :md="8">
      <Card class="warp-card">
        <div slot="title" class="card-title">
          <Icon type="ios-switch"></Icon>菜单管理
        </div>
        <div slot="extra">
          <Button
            @click="addPrivilege(1,0)"
            icon="md-add"
            type="primary"
            size="small"
            v-privilege="'add'"
          >添加</Button>
        </div>
        <Menu
          width="100%"
          ref="defineSelect"
          @on-select="loadPrivilegeTableData"
          :active-name="activeName"
        >
          <!--遍历得到模块-->
          <template v-for="item in menus">
            <Submenu :name="item.id" :key="item.id">
              <template slot="title">
                <Tooltip placement="right">
                  <span>{{item.name}}</span>
                  <div slot="content">
                    <a
                      style="color:#FFFFFF;margin-right: 5px;margin-left: 5px"
                      @click.stop="addPrivilege(2,item.id)"
                      v-privilege="'add'"
                    >新建</a>
                    <a
                      style="color:#FFFFFF;margin-right: 5px"
                      @click.stop="changePrivilege(1,item)"
                      v-privilege="'update'"
                    >修改</a>
                    <a
                      style="color:#FFFFFF"
                      @click.stop="deletePrivilege(1,item.id)"
                      v-privilege="'delete'"
                    >删除</a>
                  </div>
                </Tooltip>
              </template>
              <!--遍历得到子模块-->
              <template v-for="children in item.children">
                <Submenu :name="children.id" :key="children.id" v-if="children.type==2">
                  <template slot="title">
                    <Tooltip placement="right">
                      <span>{{children.name}}</span>
                      <div slot="content">
                        <a
                          style="color:#FFFFFF;margin-right: 5px;margin-left: 5px"
                          @click.stop="addPrivilege(3,children.id,item.children)"
                          v-privilege="'add'"
                        >新建</a>
                        <a
                          style="color:#FFFFFF;margin-right: 5px"
                          @click.stop="changePrivilege(2,children)"
                          v-privilege="'update'"
                        >修改</a>
                        <a
                          style="color:#FFFFFF"
                          @click.stop="deletePrivilege(2,children.id)"
                          v-privilege="'delete'"
                        >删除</a>
                      </div>
                    </Tooltip>
                  </template>
                  <!--遍历得到子模块页面-->
                  <template v-for="childrenPages in children.children">
                    <MenuItem :name="childrenPages.id" :key="childrenPages.id">
                      <Tooltip placement="right" :key="childrenPages.id">
                        {{childrenPages.name}}
                        <div slot="content">
                          <!--                                      <a style="color:#FFFFFF;margin-right: 15px;margin-left: 15px"-->
                          <!--                                         @click="addPrivilege(3,childrenPages.parentId,item.children)"-->
                          <!--                                          v-privilege="'add'">新建</a>-->
                          <a
                            style="color:#FFFFFF;margin-right: 15px"
                            @click.stop="changePrivilege(3,childrenPages,item.children)"
                            v-privilege="'update'"
                          >修改</a>
                          <a
                            style="color:#FFFFFF"
                            @click.stop="deletePrivilege(3,childrenPages.id)"
                            v-privilege="'delete'"
                          >删除</a>
                        </div>
                      </Tooltip>
                    </MenuItem>
                  </template>
                </Submenu>
                <MenuItem :name="children.id" v-if="children.type==3" :key="children.id">
                  <Tooltip placement="right" :key="children.id">
                    {{children.name}}
                    <div slot="content">
                      <!--                                  <a style="color:#FFFFFF;margin-right: 15px;margin-left: 15px"-->
                      <!--                                         @click="addPrivilege(3,children.parentId,item.children)"-->
                      <!--                                           v-privilege="'add'">新建</a>-->
                      <a
                        style="color:#FFFFFF;margin-right: 15px"
                        @click.stop="changePrivilege(3,children,menus)"
                        v-privilege="'update'"
                      >修改</a>
                      <a
                        style="color:#FFFFFF"
                        @click.stop="deletePrivilege(3,children.id)"
                        v-privilege="'delete'"
                      >删除</a>
                    </div>
                  </Tooltip>
                </MenuItem>
              </template>
            </Submenu>
          </template>
        </Menu>
      </Card>
    </Col>
    <Col :lg="18" :md="16">
      <Card class="warp-card" style="margin-bottom:100px">
        <div slot="title" class="card-title">
          <Icon type="ios-cog"></Icon>功能点
        </div>
        <div slot="extra">
          <Button
            icon="md-add"
            type="primary"
            size="small"
            @click="addFunctionPrivilege()"
            v-privilege="'add'"
          >增加--功能点</Button>
        </div>
        <Row>
          <Table :columns="privilegeTableColumn" :data="privilegeTableData"></Table>
        </Row>
      </Card>
    </Col>
    <Col span="24">
      <privilege-form
        @updateMenuSuccess="updateSucesss"
        @closeModal="closeModal"
        :show="form.show"
        :title="form.title"
        :parentList="form.parentList"
        :isCreate="form.isCreate"
        :privilege="form.privilege"
        :type="form.type"
        :typeDisabled="typeDisabled"
        :urlList="urlList"
      ></privilege-form>
    </Col>
  </Row>
</template>
<script>
//type:1模块；2子模块；3页面；4功能点；
import api from "@/api/privilege";
import privilegeForm from "./privilegeForm";

export default {
  name: "privilegeMain",
  components: {
    privilegeForm
  },
  computed: {},
  data() {
    return {
      typeDisabled: true,
      activeName: 0,
      scope: 1, // 权限划分 1管理端权限 2web端权限 ,
      form: {
        show: false,
        title: "",
        isCreate: false,
        privilege: {},
        type: 1,
        parentList: []
      },
      menus: [],
      urlList:[],
      privilegeTableData: [],
      privilegeTableColumn: [
        {
          title: "名称",
          align: "center",
          key: "name"
        },
        {
          title: "routerKey",
          align: "center",
          key: "routerKey"
        },
        {
          title: "url",
          align: "center",
          key: "url"
        },
        {
          title: "操作",
          width: 120,
          align: "center",
          className: "action-hide",
          render: (h, params) => {
            let btns = [];
            btns.push(
              h(
                "Tooltip",
                {
                  props: {
                    content: "编辑",
                    placement: "top"
                  },
                  directives: [
                    {
                      name: "privilege",
                      value: "update"
                    }
                  ]
                },
                [
                  h("Button", {
                    props: {
                      type: "primary",
                      size: "small",
                      icon: "md-create"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.changePrivilege(
                          4,
                          params.row,
                          this.getPointPageList()
                        );
                      }
                    }
                  })
                ]
              )
            );
            btns.push(
              h(
                "Tooltip",
                {
                  props: {
                    content: "删除",
                    placement: "top"
                  },
                  directives: [
                    {
                      name: "privilege",
                      value: "delete"
                    }
                  ]
                },
                [
                  h("Button", {
                    props: {
                      type: "error",
                      size: "small",
                      icon: "ios-trash"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.deletePrivilege(4, params.row.id);
                      }
                    }
                  })
                ]
              )
            );
            return h("div", btns);
          }
        }
      ]
    };
  },
  mounted() {
    this.listPrivilege();
    this.getAllUrl()
    console.log(api)
   
  },
  methods: {
    //查询菜单列表/
    async listPrivilege() {
      try {
        let result = await api.listPrivilege();
           this.menus = result.data;
      } catch (e) {}
    },
    //获取所有路由
    async getAllUrl() {
      try {
        let result = await api.getAllUrl();
          this.urlList=result.data    
      } catch (e) {}
    },
    closeModal() {
      this.form.show = false;
    },
    changePrivilege(type, privilege, item) {
      if (type == 1) {
        this.form.parentList = [];
      } else if (type == 2) {
        this.form.parentList = this.menus.map(e1 =>
          Object.assign({}, { id: e1.id, name: e1.name })
        );
      } else {
        this.form.parentList = item
          .filter(e => e.type != 3)
          .map(e => Object.assign({}, { id: e.id, name: e.name }));
      }

      let title = "";
      switch (type) {
        case 1:
          title = "模块";
          break;
        case 2:
          title = "子模块/页面";
          break;
        case 3:
          title = "页面";
          break;
        case 4:
          title = "功能点";
          break;
      }
      this.form.title = "修改" + title;
      this.form.isCreate = false;
      this.form.type = type;
      let urlArray = [];
      if (privilege.url) {
        urlArray = privilege.url.split(",");
      } else {
        urlArray = [];
      }
      this.form.privilege = Object.assign(
        { urlArray: urlArray },
        privilege,
        { isEnable: privilege.isEnable == 1 },
        { isShow: privilege.isShow == 1 }
      );
      this.form.show = true;
    },

    addFunctionPrivilege() {
      if (this.activeName == 0) {
        this.$Message.error("请选择父级菜单");
        return;
      }
      this.addPrivilege(4, this.activeName, this.getPointPageList());
    },
    getPointPageList() {
      let pageList = null;
      this.menus.forEach(e => {
        // 判断是否是模块页面
        if (e.children) {
          e.children.forEach(item => {
            if (item.id == this.activeName && item.type == 3) {
              pageList = e.children;
            } else {
              if (item.children) {
                item.children.forEach(childrenPages => {
                  if (childrenPages.id == this.activeName) {
                    pageList = item.children;
                  }
                });
              }
            }
          });
        }
      });
      console.log(pageList);
      return pageList;
    },
    addPrivilege(type, parentId, item) {
      if (type == 1) {
        this.typeDisabled = true;
        this.form.parentList = [];
      } else if (type == 2) {
        this.typeDisabled = false;
        this.form.parentList = this.menus.map(e1 =>
          Object.assign({}, { id: e1.id, name: e1.name })
        );
      } else {
        this.typeDisabled = true;
        this.form.parentList = item.map(e =>
          Object.assign({}, { id: e.id, name: e.name })
        );
      }
      let title = "";
      switch (type) {
        case 1:
          title = "模块";
          break;
        case 2:
          title = "子模块/页面";
          break;
        case 3:
          title = "页面";
          break;
        case 4:
          title = "功能点";
          break;
      }
      this.form.title = "新建" + title;
      this.form.isCreate = true;
      this.form.type = type;
      this.form.privilege = Object.assign(
        {},
        { parentId: parentId },
        { urlArray: [] },
        { type: type, isShow: true, isEnable: true },
        { name: "", routerKey: "", url: "" }
      );
      this.form.show = true;
    },

    refreshData(type) {
      if (type < 4) {
        // 说明是左侧菜单
        this.$Spin.show();
        privilegeApi.getMenuList(this.scope).then(res => {
          if (res.success) {
            this.menus = res.data;
          }
          this.$Spin.hide();
        });
      } else {
        this.loadPrivilegeTableData(this.activeName);
      }
    },

    updateSucesss(type) {
      this.form.show = false;
      this.refreshData(type);
    },

    deletePrivilege(type, id) {
      this.$Modal.confirm({
        title: "友情提醒",
        content: "确定要删除吗？",
        onOk: () => {
          this.$Spin.show();
          privilegeApi.removeMenu(id).then(res => {
            if (res.success) {
              if (type < 4) {
                this.privilegeTableData = [];
                this.activeName = 0;
                this.refreshData(type);
              } else {
                this.refreshData(type);
              }
            }
            this.$Spin.hide();
          });
        }
      });
    },
    async listPrivilegeById(id) {
      try{
        this.$Spin.show()
        let result=await api.listPrivilegeById(id)
        let data=result.data
        if(data.childrenPoints){
           this.privilegeTableData =data.childrenPoints
        }else{
           this.privilegeTableData = []
        }
         this.$Spin.hide()
      }catch(e){}
    },
    loadPrivilegeTableData(id) {
      this.activeName = id;
      this.listPrivilegeById(id)  
    }
  }
};
</script>
