<template>
  <Modal title="职员详情" v-model="isShow" :width="700" :footer-hide="true">
    <Form :label-width="80">
      <Row :gutter="16">
        <Col span="8">
          <FormItem label="姓名:">{{detail.actualName}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="登录名:">{{detail.loginName}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="别名:">{{detail.nickName}}</FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
          <FormItem label="部门:">{{detail.departmentName}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="手机:">{{detail.phone}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="身份证:">{{detail.idCard}}</FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
          <FormItem label="出生日期:">{{detail.birthday}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="电子邮箱:">{{detail.email}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="状态:">{{detail.isDisabled?"禁用":"启用"}}</FormItem>
        </Col>
      </Row>
    </Form>
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
