<template>
  <div>
    <div
      class="demo-upload-list"
      style="width: auto;min-width: 30px;"
      v-for="(item,index) in selectData"
      :key="index"
    >
      <template>
        <div class="list-div">
          <Icon type="md-person" size="15"/>
          <span>{{item.name}}</span>
        </div>
        <div class="demo-upload-list-cover" v-if="!readOnly">
          <Icon type="ios-trash-outline" @click.native="remove(index)"></Icon>
        </div>
      </template>
    </div>
    <div class="selector-div selectClass" v-if="!readOnly">
      <div class="demo-upload-list" v-if="showAddBtn">
        <Icon type="md-person-add" size="30" @click="showSelector"></Icon>
      </div>
      <div class="department-list" v-if="isShow">
        <DepartmentEmployeeSelector @on-select="onSelect" :department="department"></DepartmentEmployeeSelector>
      </div>
    </div>
  </div>
</template>
<script>
import DepartmentEmployeeSelector
  from '@/view/baseSetting/department/components/department-employee-selector/DepartmentEmployeeSelector'
import $ from 'jquery'
export default {
  name: 'departmentEmployee',
  props: {
    value: {
      type: Array
    },
    department: {
      type: Boolean
    },
    single: {
      type: Boolean
    },
    readOnly: {
      type: Boolean
    }
  },
  components: {
    DepartmentEmployeeSelector
  },
  data () {
    return {
      isShow: false,
      selectData: []
    }
  },
  computed: {
    showAddBtn () {
      if (this.selectData && this.selectData.length > 0) {
        return !this.single
      }
      return true
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.selectData = val.concat()
      }
    }
  },
  mounted () {
    let _this = this
    $('.selectClass').click(event => {
      event = event || window.event
      event.stopPropagation()
    })

    // 点击层外，隐藏这个层。由于层内的事件停止了冒泡，所以不会触发这个事件
    $(document).click(function (e) {
      _this.isShow = false
    })
  },
  methods: {
    getSeletorList () {
      return this.selectData
    },
    showSelector () {
      if (!this.isShow) {
        this.$emit('cancelAllComponents')
      }
      this.isShow = !this.isShow
    },

    remove (index) {
      if (this.selectData) {
        this.selectData.splice(index, 1)
      }
      this.$emit('select')
    },
    onSelect (obj) {
      if (this.selectData) {
        let number = this.selectData.findIndex(e => e.id === obj.id)
        if (number != -1) {
          return
        }
      }
      this.selectData.push(obj)
      // 选择回调 可通过getSeletorList获取所有选择的职员
      this.$emit('select')
      // 选择回调 返回选择的当前职员
      this.$emit('on-select', obj)
      this.isShow = false
    },
    reset () {
      this.selectData = []
      this.isShow = false
    }
  }
}
</script>
<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 35px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 4px;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.4);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .department-list {
    width: 280px;
    height: 330px;
    display: inline-block;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    overflow-y: scroll;
    position: absolute;
    left: 24px;
    top: 24px;
    z-index: 10;
    background-color: #ffffff;
  }

  .selector-div {
    display: inline-block;
    position: relative;
  }

  .list-div {
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
    white-space:normal;
    word-break:break-all;
    word-wrap:break-word;
  }

</style>
