<template>
  <!--tab切换，数据范围部分-->
  <div>
    <Row>
      <Col span="16" style="margin:20px 0;font-size: 15px;color: #95a5a6;"></Col>
      <Col span="8" class="button_style">
        <Button
          type="primary"
          @click.native="updateDataScopeFunc"
          v-privilege="'saveDataScope'"
          style="margin-right: 20px;"
        >保存</Button>
        <Button type="warning" @click.native="getDataScopeFunc()" v-privilege="'search'">刷新</Button>
      </Col>
    </Row>
    <Row style="border-bottom: 1px solid #f2f2f2;font-weight: 600; margin: 10px 0px;">
      <Col span="4" class="tab_margin">业务单据</Col>
      <Col span="6" class="tab_data">查看数据范围</Col>
      <Col span="14" class="tab_margin"></Col>
    </Row>
    <div style="height:680px;overflow-y: scroll">
      <Row
        style="border-bottom: 1px solid #f2f2f2; margin: 10px 0px;"
        v-for="item in this.detail"
        :key="item.dataScopeType "
      >
        <Col span="4" style="line-height:100px; text-align: center">{{item.dataScopeTypeName}}</Col>
        <Col span="6" class="tab_data">
          <RadioGroup v-model="item.viewType" vertical>
            <Radio
              v-for="(scope,index) in item.viewTypeList"
              :key="index+'viewType'"
              :label="scope.viewType"
            >{{scope.viewTypeName }}</Radio>
          </RadioGroup>
        </Col>
        <Col span="14" style="text-indent:2rem;line-height:30px;font-size:16px;color: #a3a3a3;">
          <p style="padding: 30px 0;">{{item.dataScopeTypeDesc}}</p>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import api from '@/api/role'
export default {
  props: {
    roleId: {
      type: Number
    }
  },
  name: 'roleDataScope',
  data () {
    return {
      detail: {}
    }
  },
  mounted () {
    this.getDataScopeFunc()
  },
  methods: {
    async updateDataScopeFunc () {
      try {
        let data = {
          roleId: this.roleId,
          batchSetList: this.detail
        }
        let result = await api.dataScopeBatchSet(data)
        if (result.success) {
          this.$Message.success('保存成功')
          this.getDataScopeFunc(this.employeeId)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getDataScopeFunc () {
      try {
        let result = await api.dataScopeList()
        if (result.success) {
          this.detail = result.data
          this.getRoleDataScope()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getRoleDataScope () {
      try {
        let result = await api.getDataScopeByRoleId(this.roleId)
        if (result.success) {
          let data = result.data
          this.detail.forEach((item, i) => {
            let find = data.find(e => e.dataScopeType == item.dataScopeType)
            if (find) {
              this.$set(item, 'viewType', find.viewType)
            } else {
              this.$set(item, 'viewType', '')
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
  .button_style{
    margin: 20px 0 20px 0;
    padding-left:20px;
    text-align: right;
  }
  .tab_data{
    padding-left: 30px;
    margin: 10px 0px;
  }
  .tab_margin{
    text-align: center;
    margin: 10px 0px;
  }
</style>
