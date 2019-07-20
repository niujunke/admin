<template>
  <div style="height: 330px;">
    <Row>
      <Col span="24">
        <Input
          v-model="searchKeywords"
          @on-change="filterEmployee"
          placeholder="请输入员工名称"
          style="max-width: 300px"
          v-else
        />
        <Tree :data="treeData"></Tree>
      </Col>
    </Row>
  </div>
</template>

<script>
import { departmentApi } from '@/api/department'
import SelectorItem from './SelectorItem.vue'
import Vue from 'vue'

export default {
  name: 'DepartmentEmployeeSelector',
  props: {
    department: {
      type: Boolean
    }
  },
  components: {
    SelectorItem
  },
  data () {
    return {
      originalData: [],
      searchKeywords: '',
      buttonProps: {
        type: 'ghost',
        size: 'small'
      },
      eventbus: new Vue(),
      currentSelect: null,
      treeData: []
    }
  },
  methods: {
    reset () {
      this.searchKeywords = ''
      this.fetchData()
    },
    getSelect () {
      return this.currentSelect
    },

    filterEmployee () {
      this.originalData.forEach(department => {
        this.recursionFilterEmployee(department)
      })
      this.generateTreeData()
    },
    recursionFilterEmployee (department) {
      if (department.employees) {
        department.employees.forEach(e => {
          if (this.searchKeywords === '' || e.name.indexOf(this.searchKeywords) > -1) {
            e.show = true
          } else {
            e.show = false
          }
        })
      }

      if (department.children) {
        department.children.forEach(item => {
          this.recursionFilterEmployee(item)
        })
      }
    },
    filterDepartment () {
      this.originalData.forEach(department => {
        this.recursionFilterDepartment(department)
      })
      this.generateTreeData()
    },
    recursionFilterDepartment (department) {
      if (department.children) {
        department.children.forEach(e => {
          e.show = true
          this.recursionFilterDepartment(e)
        })
      }
    },
    async fetchData () {
      try {
        let res = await departmentApi.listDepartmentEmployee()
        if (res.success) {
          this.originalData = res.data
          if (!this.type) {
            this.filterEmployee()
          } else {
            this.filterDepartment()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    generateTreeData () {
      let tree = []
      this.originalData.forEach(department => {
        let icon = department.type == 1 ? 'md-cube' : 'md-menu'
        let obj = Object.assign({}, {
          title: department.name,
          expand: true,
          children: this.constractTree(department),
          render: (h, { root, node, data }) => {
            return h(SelectorItem, {
              props: {
                type: this.type,
                itemData: {
                  title: department.name,
                  icon: icon,
                  isEmployee: false,
                  id: department.id,
                  selectFunction: (obj) => {
                    if (this.type == 1) {
                      this.currentSelect = obj
                      this.eventbus.$emit('select', obj)
                      this.$emit('on-select', obj)
                    }
                  }
                }
              },
              style: {
                cursor: 'pointer'
              }
            })
          }
        })
        tree.push(obj)
      })
      this.treeData = tree
    },

    constractTree (department) {
      let children = []
      if (department.children) {
        department.children.forEach(departmentChild => {
          if (this.type && !departmentChild.show) {
            return
          }
          let icon = departmentChild.type == 1 ? 'md-cube' : 'md-menu'
          let obj = Object.assign({}, {
            title: departmentChild.name,
            expand: true,
            disabled: false,
            children: this.constractTree(departmentChild),
            render: (h, { root, node, data }) => {
              return h(SelectorItem, {
                props: {
                  type: this.type,
                  itemData: {
                    title: departmentChild.name,
                    icon: icon,
                    isEmployee: false,
                    id: departmentChild.id,
                    selectFunction: (obj) => {
                      this.currentSelect = obj
                      this.eventbus.$emit('select', obj)
                      this.$emit('on-select', obj)
                    }
                  }
                },
                style: {
                  cursor: 'pointer'
                }
              })
            }
          })
          children.push(obj)
        })
      }
      if (!this.type && department.employees) {
        department.employees.forEach(employeeItem => {
          if (employeeItem.show) {
            let obj = Object.assign({}, {
              title: employeeItem.actualName,
              render: (h, { root, node, data }) => {
                return h(SelectorItem, {
                  props: {
                    type: this.type,
                    itemData: {
                      title: employeeItem.actualName,
                      icon: 'md-person',
                      isEmployee: true,
                      selected: false,
                      id: employeeItem.id,
                      eventbus: this.eventbus,
                      selectFunction: (obj) => {
                        this.currentSelect = obj
                        this.eventbus.$emit('select', obj)
                        this.$emit('on-select', obj)
                      }
                    }
                  },
                  style: {
                    cursor: 'pointer'
                  }
                })
              }
            })
            children.push(obj)
          }
        })
      }
      return children
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {}
}
</script>
