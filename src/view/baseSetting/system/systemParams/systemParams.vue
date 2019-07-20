<template>
  <div>
    <Card class="warp-card">
      <Form inline class="tools">
        <FormItem>
          <Button type="primary" icon="md-add" @click="addModal=true" v-privilege="'add'">添加</Button>
        </FormItem>
        <FormItem>
          <Input v-model="searchValue" v-privilege="'search'" placeholder="请输入">
            <Select v-model="searchType" slot="prepend" style="width: 120px">
              <Option value="BY_KEY">按key</Option>
              <Option value="BY_GROUP">按参数类别</Option>
            </Select>
            <Button slot="append" icon="ios-search" @click="searchSystemConfigList"></Button>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="md-refresh" @click="refresh" v-privilege="'query'">重置</Button>
        </FormItem>
      </Form>
      <Tables
        :pageShow="pageShow"
        :loading="loading"
        :columns="columns"
        :value="data"
        :total="pageTotal"
        :page-size="pageSize"
        :current="pageNum"
        :pageNumber="pageNum"
        show-elevator
        @on-change="changePage"
        @on-page-size-change="changePageSize"
      ></Tables>
    </Card>
    <Modal
      v-model="editModal"
      title="编辑"
      @on-ok="handleUpdate"
      @on-cancel="cancelUpdate"
      :loading="updateLoading"
    >
      <Form ref="updateRef" :model="updateItem" :rules="updateValidate" :label-width="80">
        <FormItem label="Key">
          <Input v-model="updateItem.configKey" disabled="disabled"></Input>
        </FormItem>
        <FormItem label="标题">
          <Input type="textarea" v-model="updateItem.configName" disabled="disabled"></Input>
        </FormItem>
        <FormItem label="值" prop="configValue">
          <Input v-model="updateItem.configValue" placeholder="请输入值(必填)"></Input>
        </FormItem>
        <FormItem label="参数类别" prop="configGroup">
          <Input v-model="updateItem.configGroup" disabled="disabled" placeholder="请输入数据类型(必填)"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input
            type="textarea"
            :autosize="{minRows: 4}"
            v-model="updateItem.remark "
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="addModal"
      title="添加"
      @on-ok="handleSave"
      @on-cancel="cancelSave"
      :loading="saveLoading"
    >
      <Form ref="saveRef" :model="saveItem" :rules="saveValidate" :label-width="80">
        <FormItem label="Key" prop="configKey">
          <Input v-model="saveItem.configKey" placeholder="请输入key(必填)"></Input>
        </FormItem>
        <FormItem label="标题" prop="configName">
          <Input v-model="saveItem.configName" placeholder="请输入标题(必填)"></Input>
        </FormItem>
        <FormItem label="值" prop="configValue">
          <Input v-model="saveItem.configValue" placeholder="请输入值(必填)"></Input>
        </FormItem>
        <FormItem label="参数类别" prop="configGroup">
          <Input v-model="saveItem.configGroup" placeholder="请输入数据类型(必填)"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input
            type="textarea"
            :autosize="{minRows: 4}"
            v-model="saveItem.remark "
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import tables from '@/components/tables'
import { getType } from '@/libs/util'
// import { systemParamsApi } from '@/api/systemParams'
export default {
  name: 'system_params',
  components: {
    Tables: tables
  },
  data () {
    return {
      pageShow: true,
      searchValue: '',
      searchType: 'BY_KEY',
      editModal: false,
      addModal: false,
      // table是否loading
      loading: true,
      saveLoading: true,
      updateLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      updateItem: {
        id: 0,
        configKey: '',
        configName: '',
        configValue: '',
        remark: ''
      },
      saveItem: {
        configKey: '',
        configName: '',
        configValue: '',
        configGroup: '',
        remark: ''
      },
      // table表头
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'id',
          key: 'id',
          width: 100
        },
        {
          title: 'Key',
          key: 'configKey',
          width: 180
        },
        {
          title: '标题',
          key: 'configName',
          width: 100
        },
        {
          title: '值',
          key: 'configValue',
          width: 150
        },
        {
          title: '参数类别',
          key: 'configGroup',
          width: 150
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          className: 'action-hide',
          render: (h, params) => {
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
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'md-create'
                      },

                      on: {
                        click: () => {
                          this.updateItem.id = params.row.id
                          this.updateItem.configGroup =
                                params.row.configGroup
                          this.updateItem.configKey = params.row.configKey
                          this.updateItem.configName =
                                params.row.configName
                          this.updateItem.configValue =
                                params.row.configValue
                          this.updateItem.remark =
                                params.row.remark
                          this.editModal = true
                        }
                      }
                    },
                    ''
                  )
                ]
              )
            ])
          }
        }
      ],
      // table数据
      data: [],
      updateValidate: {
        configValue: [{ required: true, message: '请输入值', trigger: 'blur' }]
      },
      saveValidate: {
        configKey: [{ required: true, message: '请输入Key', trigger: 'blur' }],
        configName: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        configValue: [{ required: true, message: '请输入值', trigger: 'blur' }],
        configGroup: [
          { required: true, message: '请输入参数类别', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getSystemConfigList()
  },
  methods: {
    // 查询系统参数列表
    async getSystemConfigList () {
      try {
        this.loading = true
        this.pageShow = true
        let searchfrom = {}
        if (this.searchType === 'BY_KEY') {
          searchfrom['key'] = this.searchValue
        } else {
          searchfrom['configGroup'] = this.searchValue
        }
        let result = await systemParamsApi.getSystemConfigList({
          ...searchfrom,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.loading = false
        if (result.success) {
          this.data = result.data.list
          this.pageTotal = result.data.total
          this.pageNum = result.data.pageNum
          this.pageSize = result.data.pageSize
        } else {
          this.$Message.error(result.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getSystemConfigList()
    },
    changePageSize (pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getSystemConfigList()
    },
    handleUpdate () {
      this.$refs['updateRef'].validate(valid => {
        this.updateLoading = true
        if (valid) {
          this.updateSystemConfig()
        } else {
          this.updateLoading = false
          this.$nextTick(() => {
            this.updateLoading = true
          })
        }
      })
    },
    // 修改系统设置信息
    async updateSystemConfig () {
      let result = await systemParamsApi.updateSystemConfig(this.updateItem)
      if (result.success) {
        this.$Message.success('修改成功')
        this.getSystemConfigList()
        this.cancelUpdate()
      } else {
        this.$Message.error(result.msg)

        this.updateLoading = false
        this.$nextTick(() => {
          this.updateLoading = true
        })
      }
    },
    // 搜索
    searchSystemConfigList () {
      this.pageNum = 1
      this.getSystemConfigList()
    },
    // 保存系统设置信息
    handleSave () {
      try {
        this.$refs['saveRef'].validate(valid => {
          this.saveLoading = true
          if (valid) {
            this.saveSystemConfig()
          } else {
            this.saveLoading = false
            this.$nextTick(() => {
              this.saveLoading = true
            })
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    async saveSystemConfig () {
      try {
        let result = await systemParamsApi.saveSystemConfig(this.saveItem)
        if (result.success) {
          this.$Message.success('添加成功')
          this.getSystemConfigList()
          this.cancelSave()
        } else {
          this.$Message.error(result.data.msg)

          this.saveLoading = false
          this.$nextTick(() => {
            this.saveLoading = true
          })
        }
      } catch (e) {
        this.saveLoading = false
      }
    },
    cancelSave () {
      this.saveItem = {}
      // 清空form规则检查
      this.$refs['saveRef'].resetFields()
      this.addModal = false
    },
    cancelUpdate () {
      this.updateItem = {}
      // 清空form规则检查
      this.$refs['updateRef'].resetFields()
      this.editModal = false
    },
    refresh () {
      this.pageNum = 1
      this.searchType = 'BY_KEY'
      this.searchValue = ''
      this.getSystemConfigList()
    }
  }
}
</script>
