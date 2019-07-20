<template>
  <Modal title="职员详情" v-model="isShow" :width="700" :footer-hide="true">
    <Row :gutter="16" style="margin-top: 20px;">
      <Col span="8">姓名:{{detail.name}}</Col>
      <Col span="8">登录名:{{detail.loginName}}</Col>
      <Col span="8">别名:{{detail.nickname}}</Col>
    </Row>
    <Row :gutter="16" style="margin-top: 20px;">
      <Col span="8">部门:{{detail.departmentName}}</Col>
      <Col span="8">手机:{{detail.phone}}</Col>
      <Col span="8">身份证:{{detail.idCard}}</Col>
    </Row>
    <Row :gutter="16" style="margin-top: 20px;">
      <Col span="8">出生日期:{{detail.birthday}}</Col>
      <Col span="8">电子邮箱:{{detail.email}}</Col>
      <Col span="8">状态:{{detail.isDisabled?"禁用":"启用"}}</Col>
    </Row>
  </Modal>
</template>
<script>
export default {
  name: 'employeeDetail',
  data () {
    return {
      isShow: false,
      detail: {}
    }
  },
  methods: {
    showModal (detail) {
      this.isShow = true
      this.detail = detail
    }
  }
}
</script>
