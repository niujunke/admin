<template>
  <div class>
    <Card title="会员管理">
      <Form inline :label-width="65">
        <FormItem label="名字：">
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem label="手机：">
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem class="btns">
          <Button type="primary">查询</Button>
          <Button>重置</Button>
          <Button type="primary" @click="modalShow=true">新增会员</Button>
        </FormItem>
      </Form>
      <Tables :columns="columns" :total="tableData.total" :data="tableData.list" />
    </Card>
    <Modal v-model="modalShow" title="添加会员">
       <Form :label-width="50">
         <FormItem label="姓名">
           <Input placeholder="请输入姓名"></Input>
         </FormItem>
          <FormItem label="手机">
           <Input placeholder="请输入手机号"></Input>
         </FormItem>
       </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from "@/components/tables";
export default {
  components: {
    Tables
  },
  //接收参数
  props: {},
  data() {
    //这里存放数据
    return {
      modalShow:false,
      tableData: {},
      queryParams: {
        endDate: "",
        name: "",
        pageNum: 1,
        pageSize: 10,
        phone: "",
        startDate: ""
      },
      columns: [
        {
          title: "会员id",
          key: "memberId "
        },
        {
          title: "名字",
          key: "name"
        },
        {
          title: "手机",
          key: "phone "
        },
        {
          title: "会员价格",
          key: "memberPrice "
        },
        {
          title: "总次数",
          key: "totalNum"
        },
        {
          title: "剩余次数",
          key: "unusedNum "
        },
        {
          title: "创建时间",
          key: "createTime"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  // 过滤器
  filters: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  //方法集合
  methods: {}
};
</script>
<style lang='less' scoped>
.btns {
  button {
    margin-left: 10px;
  }
}
</style>
