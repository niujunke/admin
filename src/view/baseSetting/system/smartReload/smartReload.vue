<template>
  <Card class="warp-card">
    <Form inline class="tools">
      <FormItem>
        <Button type="primary" icon="md-refresh" v-privilege="'search'" @click="query">刷新</Button>
      </FormItem>
    </Form>
    <Tables :columns="columns" :value="tableData"></Tables>
    <Modal
      v-model="editModal"
      title="编辑"
      @on-ok="edit"
      @on-cancel="editModal=false"
      :closable="false"
      :mask-closable="false"
    >
      <Form :model="form" :label-width="80">
        <FormItem label="标签">
          <Input v-model="form.tag" disabled="disabled"></Input>
        </FormItem>
        <FormItem label="状态标识">
          <Input v-model="form.identification" required></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showResult" title="执行结果" :closable="false" :mask-closable="false" width="600px">
      <Tables
        :columns="resultColumns"
        :value="resultData"
        style="height: 400px;overflow-y:scroll; "
      ></Tables>
      <div slot="footer">
        <Button type="primary" @click="showResult=false">关闭</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
// import { smartReloadApi } from '@/api/smartReload'
import tables from '@/components/tables'
export default {
  name: 'setting_reloadItem',
  components: {
    Tables: tables
  },
  data () {
    return {
      showResult: false,
      // 修改弹窗
      editModal: false,
      form: {
        tag: '',
        identification: 0
      },
      tableData: [],
      columns: [
        {
          title: '标签',
          key: 'tag'
        },
        {
          title: '状态标识',
          key: 'identification'
        },
        {
          title: '更新时间',
          key: 'updateTime'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          render: (h, param) => {
            return h('div', [
              h(
                'Tooltip',
                {
                  props: {
                    content: '编辑',
                    placement: 'top'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'update'
                    }
                  ]
                },
                [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'md-create'
                    },
                    style: {
                      marginRight: '10px'
                    },

                    on: {
                      click: () => {
                        this.editModal = true
                        this.form.tag = param.row.tag
                        this.form.identification = param.row.identification
                      }
                    }
                  })
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '执行结果',
                    placement: 'top'
                  }
                },
                [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'ios-document'

                    },
                    directives: [
                      {
                        name: 'privilege',
                        value: 'result'
                      }
                    ],
                    on: {
                      click: () => {
                        this.getResult(param.row.tag)
                      }
                    }
                  })
                ]
              )
            ])
          }
        }
      ],
      resultData: [],
      resultColumns: [
        {
          title: '标签',
          key: 'tag',
          width: 100
        },
        {
          title: '结果',
          key: 'result'
        },
        {
          title: '异常信息',
          key: 'exception',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 150
        }
      ]
    }
  },
  computed: {
  },
  mounted () {
    let timer = setInterval(this.query, 3 * 60 * 1000)
    // 在页面销毁时清除定时器
    this.$once('hook:beforeDestroy ', () => {
      clearInterval(timer)
    })
    this.query()
  },
  methods: {
    // 查询
    async query () {
      try {
        let result = await smartReloadApi.query()
        if (result.success) {
          this.tableData = result.data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 修改
    async edit () {
      if (this.form.identification) {
        try {
          this.$Spin.show()
          let result = await smartReloadApi.update(this.form)
          if (result.success) {
            this.$Message.success('更新成功')
            this.form = {}
            this.query()
          }
          this.$Spin.hide()
        } catch (e) {
          this.$Spin.hide()
          console.log(e)
        }
      } else {
        this.$Message.error('状态标示不能为空')
        this.show = true
      }
    },
    // 获取执行结果
    async getResult (tag) {
      try {
        let result = await smartReloadApi.getResult(tag)
        if (result.success) {
          this.resultData = result.data
          this.showResult = true
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
