<template>
  <div>
    <!--员工管理-->
    <Row :gutter="10">
      <Col :md="8" :lg="5">
        <Card class="warp-card">
          <p slot="title">公司组织</p>
          <Row>
            <Input placeholder="输入部门名称" @on-change="departmentNameChange" v-model="departmentName"/>
          </Row>
          <Tree
            :data="departmentGroup"
            :render="renderdepartment"
            style="height: 540px;overflow-y: scroll"
          ></Tree>
        </Card>
      </Col>
      <departmentStaff :selectDepartment="selectDepartment" :departments="departmentGroup"></departmentStaff>
      <Modal
        :title="departmentModalTitle"
        v-model="operationModal"
        @on-visible-change="operationModalChange"
      >
        <Form :label-width="80">
          <FormItem label="名称" required>
            <Input
              v-model="departmentParam.name"
              @on-keydown="departmentParam.name=departmentParam.name.replace(/^ +| +$/g,'')"
              @on-keyup="departmentParam.name=departmentParam.name.replace(/^ +| +$/g,'')"
            ></Input>
          </FormItem>
          <FormItem label="负责人" class="selectClass">
            <Input
              v-model="departmentParam.managerName"
              placeholder="请选择负责人"
              @click.native="showTree"
              readonly
            >
              <Icon type="ios-arrow-down" slot="suffix" v-if="!treeShow"/>
              <Icon type="ios-arrow-up" slot="suffix" v-else/>
            </Input>
            <div class="departmentWrap">
              <DepartmentEmployeeSelector
                @on-select="depEmpSelect"
                :selectEmployeeId="selectEmployeeId"
                ref="DepartmentEmployeeSelector"
              ></DepartmentEmployeeSelector>
            </div>
          </FormItem>
          <FormItem label="上级部门" required>
            <Input v-model="departmentParam.parentName" disabled/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" @click="operationDepartment()">确定</Button>
          <Button type="error" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal title="删除确认" v-model="isDelete">
        <p style="font-size: 16px;">
          确定要将
          <span style="color: red;font-size: 16px;">{{departmentParam.name}}</span>
          部门删除吗？
        </p>
        <div slot="footer">
          <Button type="primary" size="large" @click="deleteAjax">确定</Button>
          <Button type="error" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal title="公司设置" v-model="showHeadOffice">
        <Form :label-width="80">
          <FormItem label="公司名称" required>
            <Input
              v-model="departmentParam.name"
              @on-keydown="departmentParam.name=departmentParam.name.replace(/^ +| +$/g,'')"
              @on-keyup="departmentParam.name=departmentParam.name.replace(/^ +| +$/g,'')"
              :disabled="!headUpdate && departmentParam.id!=null"
            />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button
            type="primary"
            size="large"
            @click="operationDepartment()"
            v-if="headUpdate || !departmentParam.id"
          >确定</Button>
          <Button type="error" size="large" @click="cancelHead">取消</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>
<style lang="less" scoped>
.ivu-tree-children {
  cursor: pointer;
  width: 100%;
}

.option_department {
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
}

.option_department:hover {
  background-color: rgba(5, 170, 250, 0.2);
}
</style>
<script>
import api from '@/api/department'
import departmentStaff from './department'
import $ from 'jquery'
import DepartmentEmployeeSelector
  from './components/department-employee-selector/DepartmentEmployeeSelector'

export default {
  name: 'department',
  components: {
    departmentStaff, DepartmentEmployeeSelector
  },
  data () {
    return {
      departmentName: '',
      treeShow: false,
      selectDepartment: {},
      operationModal: false,
      isDelete: false,
      headUpdate: false,
      departmentParam: {
        id: '',
        name: '',
        managerId: null,
        managerName: '',
        parentName: '',
        parentId: '',
        type: 1
      },
      selectEmployeeId: null,
      departmentParamBackup: {},
      departmentModalTitle: '添加部门',
      showHeadOffice: false,
      departmentGroup: [
        {
          name: '',
          expand: true,
          render: (h, { root, node, data }) => {
            let newName = data.name

            if (newName.length > 8) {
              newName = data.name.substring(0, 8) + '...'
            }
            if (!data || Object.keys(data).length == 0 || !data.id) {
              return h('span', '')
            }
            return h('Tooltip', {
              props: {
                placement: 'right'
              },
              style: { fontSize: '12px' }
            }, [
              h('span', {
                style: {
                  display: 'inline-block'
                }
              }, [
                h('span', [
                  h('div', {
                    props: {
                      // content:'123',
                      // placement: 'top'
                    },
                    style: { fontSize: '12px' }
                  },
                  [h('Icon', {
                    props: {
                      type: 'md-cube'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('Button', {
                    props: Object.assign({}),
                    'class': [
                      'departmentSelect'
                    ],
                    style: {
                      border: 'none',
                      background: '#ffffff',
                      padding: '4px 5px'
                    },
                    on: {
                      click: (event) => {
                        this.loadStaffTable(event, root, node, data)
                      }
                    }
                  }, newName)
                  ])
                ])
              ]),
              h('div', {
                slot: 'content'
              }, [
                h('a', {
                  props: {},
                  style: {
                    color: '#fff',
                    margin: '0 5px 5px'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'addDepartment'
                    }
                  ],
                  on: {
                    click: () => {
                      this.requireDepartment(data, false)
                    }
                  }
                }, '添加')
              ]),
              h('div', {
                slot: 'content'
              }, [
                h('a', {
                  props: {},
                  style: {
                    color: '#fff',
                    margin: '0 5px 5px'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'updateDepartment'
                    }
                  ],
                  on: {
                    click: () => {
                      data.parentId = 0
                      this.requireDepartment(data, true)
                    }
                  }
                }, '编辑')
              ])
            ])
          },
          children: []
        }
      ],
      buttonProps: {
        type: 'ghost',
        size: 'small'
      },
      departentPeopleList: []

    }
  },
  computed: {
  },
  mounted () {
    Object.assign(this.departmentParamBackup, this.departmentParam)
    this.query()
    let _this = this
    $('.selectClass').click(event => {
      event = event || window.event
      event.stopPropagation()
    })

    // 点击层外，隐藏这个层。由于层内的事件停止了冒泡，所以不会触发这个事件
    $(document).click(function (e) {
      _this.treeShow = false
      $('.departmentWrap').hide()
    })
  },
  methods: {
    // 初始化加载数据
    async query () {
      try {
        let result = await api.listEmployeeByDepartmentName(this.departmentName)
        console.log(123)
        if (result.success) {
          let data = result.data
          this.departmentGroup[0].id = null
          this.departmentGroup[0].name = ''
          this.departmentGroup[0].children = []
          this.departmentGroup[0].organizationId = []
          this.departmentGroup[0].organizationName = []
          this.departmentGroup[0].type = 1
          if (data && data[0]) {
            let dateFirst = data[0]
            this.departmentGroup[0].id = dateFirst.id
            this.departmentGroup[0].name = dateFirst.name
            this.departmentGroup[0].children = dateFirst.children
            this.departmentGroup[0].organizationId = dateFirst.organizationId
            this.departmentGroup[0].organizationName = dateFirst.organizationName
            this.departmentGroup[0].type = dateFirst.type
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 渲染部门树形图功能按钮
    renderdepartment (h, { root, node, data }) {
      let newName = data.name

      if (newName.length > 8) {
        newName = data.name.substring(0, 8) + '...'
      }
      let icon = ''
      if (data.type == 1) {
        icon = 'md-cube'
      } else {
        icon = 'md-menu'
      }
      let buttonList = [
        h('div', {
          style: {
            margin: '0 5px 5px 5px'
          }
        }, [h('a', {
          props: {},
          style: {
            color: '#fff',
            margin: '0 5px 5px'
          },
          directives: [
            {
              name: 'privilege',
              value: 'updateDepartment'
            }
          ],
          on: {
            click: () => {
              this.requireDepartment(data, true)
            }
          }
        }, '编辑')]),
        h('div', { style: {
          margin: '0 5px 5px 5px'
        } }, [h('a', {
          props: {},
          style: {
            color: '#fff',
            margin: '0 5px 5px'
          },
          directives: [
            {
              name: 'privilege',
              value: 'addDepartment'
            }
          ],
          on: {
            click: () => {
              this.departentPeopleList = []
              this.requireDepartment(data, false)
            }
          }
        }, '添加')]),
        h('div', { style: {
          margin: '0 5px 5px 5px'
        } }, [h('a', {
          props: {},
          style: {
            color: '#fff',
            margin: '0 5px 5px'
          },
          directives: [
            {
              name: 'privilege',
              value: 'deleteDepartment'
            }],
          on: {
            click: () => {
              this.showDeleteModal(data)
            }
          }
        }, '删除')])]

      if (data.preId) {
        buttonList.push(
          h('div', { style: {
            margin: '0 5px 5px 5px'
          } }, [h('a', {
            props: {},
            style: {
              color: '#fff',
              margin: '0 5px 5px'
            },
            directives: [
              {
                name: 'privilege',
                value: 'deleteDepartment'
              }],
            on: {
              click: () => {
                this.upOrDown(data.id, data.preId)
              }
            }
          }, '上移')]))
      }
      if (data.nextId) {
        buttonList.push(
          h('div', { style: {
            margin: '0 5px 5px 5px'
          } }, [h('a', {
            props: {},
            style: {
              color: '#fff',
              margin: '0 5px 5px'
            },
            directives: [
              {
                name: 'privilege',
                value: 'deleteDepartment'
              }],
            on: {
              click: () => {
                this.upOrDown(data.id, data.nextId)
              }
            }
          }, '下移')]))
      }
      if (data.parentId && data.parentId != 1) {
        buttonList.push(
          h('div', { style: {
            margin: '0 5px 5px 5px'
          } }, [h('a', {
            props: {},
            style: {
              color: '#fff',
              margin: '0 5px 5px'
            },
            directives: [
              {
                name: 'privilege',
                value: 'deleteDepartment'
              }],
            on: {
              click: () => {
                this.upgrade(data.id)
              }
            }
          }, '升级')]))
      }

      if (data.preId) {
        buttonList.push(
          h('div', { style: {
            margin: '0 5px 5px 5px'
          } }, [h('a', {
            props: {},
            style: {
              color: '#fff',
              margin: '0 5px 5px'
            },
            directives: [
              {
                name: 'privilege',
                value: 'deleteDepartment'
              }],
            on: {
              click: () => {
                this.downgrade(data.id, data.preId)
              }
            }
          }, '降级')]))
      }
      return h('Tooltip', {
        props: {
          placement: 'right'
        },
        style: { fontSize: '12px' }
      }, [
        h('span', {
          style: {
            display: 'inline-block'
          }
        }, [
          h('span', [
            h('div', {
              props: {
                // content:'123',
                // placement: 'top'
              },
              style: { fontSize: '12px' }
            },
            [h('Icon', {
              props: {
                type: icon
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('Button', {
              props: Object.assign({}),
              'class': [
                'departmentSelect'
              ],
              style: {
                border: 'none',
                background: '#ffffff',
                padding: '4px 5px'
              },
              on: {
                click: (event) => {
                  console.log('11')
                  this.loadStaffTable(event, root, node, data)
                }
              }
            }, newName)
            ])
          ])
        ]),
        h('div', {
          slot: 'content'
        }, buttonList)
      ])
    },
    loadStaffTable (event, root, node, data) {
      $('.departmentSelect').css({ 'background': '#ffffff', 'color': 'black' })
      let target = event.target
      let tagName = target.tagName
      if (tagName != 'BUTTON') {
        target.parentNode.style.backgroundColor = '#5cadff'
        target.parentNode.style.color = '#ffffff'
      } else {
        target.style.backgroundColor = '#5cadff'
        target.style.color = '#ffffff'
      }
      this.selectDepartment = data
    },
    // 关闭模态框
    cancel () {
      this.isDelete = false
      this.operationModal = false
    },
    showHead (update) {
      this.headUpdate = update
      let headOffice = this.departmentGroup[0]
      this.departmentParam = {
        id: headOffice.id,
        name: headOffice.name,
        managerId: 0,
        managerName: '',
        parentName: '',
        parentId: 0
      }
      this.showHeadOffice = true
    },
    cancelHead () {
      this.showHeadOffice = false
    },
    operationDepartment () {
      if (!this.departmentParam.name) {
        this.$Message.error('名称不能为空')
        return
      }
      this.operationDepartmentAjax()
    },
    async operationDepartmentAjax () {
      try {
        let result
        if (this.departmentParam.id) {
          result = await departmentApi.updateDepartment(this.departmentParam)
        } else {
          result = await departmentApi.addDepartment(this.departmentParam)
        }
        if (result.success) {
          this.$Message.success('操作成功')
          this.query()
          this.cancel()
          this.cancelHead()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async deleteAjax () {
      try {
        let result = await departmentApi.deleteDepartment(this.departmentParam.id)
        if (result.success) {
          this.$Message.success('删除成功')
          this.query()
          this.cancelDeleteModal()
        }
      } catch (e) {
        console.log(e)
      }
    },
    requireDepartment (data, update) {
      this.selectEmployeeId = null
      if (update) {
        this.departmentParam = Object.assign({}, data)
        this.selectEmployeeId = data.managerId
      } else {
        this.departmentParam = {
          parentName: data.name,
          parentId: data.id,
          type: 1
        }
      }
      this.operationModal = true
    },
    showDeleteModal (val) {
      let data
      if (!val) {
        data = Object.assign({}, this.departmentGroup[0])
      } else {
        data = Object.assign({}, val)
      }
      this.departmentParam = {
        id: data.id,
        name: data.name
      }
      this.isDelete = true
    },
    cancelDeleteModal () {
      this.departmentParam = Object.assign({}, this.departmentParamBackup)
      this.isDelete = false
    },
    // 部门树形图的显示与隐藏
    showTree () {
      if (this.treeShow) {
        this.treeShow = false
        $('.departmentWrap').hide()
      } else {
        this.treeShow = true
        $('.departmentWrap').show()
        this.$refs.DepartmentEmployeeSelector.reset()
      }
    },
    depEmpSelect (emp) {
      this.$set(this.departmentParam, 'managerId', emp.id)
      this.$set(this.departmentParam, 'managerName', emp.name)
      this.treeShow = false
      $('.departmentWrap').hide()
    },
    operationModalChange (showStatus) {
      if (!showStatus) {
        this.treeShow = false
        $('.departmentWrap').hide()
        this.$refs.DepartmentEmployeeSelector.generateTreeData()
      }
    },
    departmentNameChange () {
      this.query()
    },
    // 部门上移或者下移
    async upOrDown (departmentId, swapId) {
      try {
        this.$Spin.show()
        let result = await departmentApi.upOrDown(departmentId, swapId)
        if (result.success) {
          this.$Message.success('操作成功')
          this.query()
        }
        this.$Spin.hide()
      } catch (e) {
        console.log(e)
        this.$Spin.hide()
      }
    },
    // 升级
    async upgrade (departmentId) {
      try {
        this.$Spin.show()
        let result = await departmentApi.upgrade(departmentId)
        if (result.success) {
          this.$Message.success('升级成功')
          this.query()
        }
        this.$Spin.hide()
      } catch (e) {
        this.$Spin.hide()
      }
    },
    // 降级
    async downgrade (departmentId, preId) {
      try {
        this.$Spin.show()
        let result = await departmentApi.downgrade(departmentId, preId)
        if (result.success) {
          this.$Message.success('降级成功')
          this.query()
        }
        this.$Spin.hide()
      } catch (e) {
        this.$Spin.hide()
      }
    }
  }
}

</script>
<style scoped>
  .departmentWrap {
    position: absolute;
    background-color: #ffffff;
    padding: 5px;
    border: 1px solid #dedede;
    width: 100%;
    z-index: 9;
    display: none;
    height: 250px;
    overflow-y: scroll;
  }
</style>
