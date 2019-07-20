<template>
  <div>
    <Tree :data="treeData"></Tree>
  </div>
</template>

<script>
import { departmentApi } from '@/api/department'
    import departmentItem from './departmentItem.vue'
    import Vue from 'vue'

    export default {
  name: 'DepartmentSelect',
  components: {
    departmentItem
  },
  data () {
    return {
      originalData: [],
      searchEmployeeName: '',
      buttonProps: {
        type: 'ghost',
        size: 'small'
      },
      eventbus: new Vue(),
      currentSelectDepartment: null,
      treeData: []
    }
  },
  props: {
    clickSelect: Function
  },
  methods: {
    selectDepart () {
      return this.currentSelectDepartment
            },
    async fetchData () {
      try {
        let res = await departmentApi.loadDepartment()
                    if (res.success) {
          this.originalData = res.data.data
                        this.generateTreeData()
                    }
      } catch (e) {
        console.log(e)
                }
    },
    generateTreeData () {
      let tree = []
                this.originalData.forEach(department => {
        let obj = Object.assign({}, {
          title: department.name,
          expand: true,
          selected: false,
          children: this.constractTree(department),
          render: (h, { root, node, data }) => {
            return h(departmentItem, {
              props: {
                itemData: {
                  title: department.name,
                  icon: 'md-menu',
                  id: department.id,
                  selected: false,
                  eventbus: this.eventbus,
                  selectDepart: (obj) => {
                    this.currentSelectDepartment = obj
                                            this.eventbus.$emit('select', obj)
                    this.clickSelect()
                  }
                }
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
          let obj = Object.assign({}, {
            title: departmentChild.name,
            expand: true,
            disabled: false,
            selected: false,
            children: this.constractTree(departmentChild),
            render: (h, { root, node, data }) => {
              return h(departmentItem, {
                props: {
                  itemData: {
                    title: departmentChild.name,
                    icon: 'md-menu',
                    id: departmentChild.id,
                    selected: false,
                    eventbus: this.eventbus,
                    selectDepart: (obj) => {
                      this.currentSelectDepartment = obj
                                                this.eventbus.$emit('select', obj)
                      this.clickSelect()
                    }
                  }
                }
              })
                            }
          })
                        children.push(obj)
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
