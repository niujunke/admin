<template>
  <div>
    <Card class="warp-card">
      <Form inline class="tools">
        <FormItem>
          <Button type="primary" icon="md-refresh" @click="refresh" v-privilege="'refresh'">刷新任务</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="md-add" @click="addModal=true" v-privilege="'add'">添加任务</Button>
        </FormItem>
      </Form>
      <Tables
        :pageShow="true"
        :loading="loading"
        :columns="columns"
        :value="data"
        :total="pageTotal"
        :page-size="pageSize"
        :current="pageNum"
        show-elevator
        @on-change="changePage"
      ></Tables>
    </Card>
    <!-- 编辑任务 -->
    <Modal
      v-model="editModal"
      title="编辑"
      @on-ok="handleUpdate"
      @on-cancel="cancelUpdate"
      :loading="updateLoading"
    >
      <Form ref="updateRef" :model="updateItem" :rules="updateValidate" :label-width="80">
        <FormItem label="taskBean" prop="taskBean">
          <Input v-model="updateItem.taskBean" placeholder="请输入taskBean(必填)"></Input>
        </FormItem>
        <FormItem label="taskCron" prop="taskCron">
          <Input v-model="updateItem.taskCron" placeholder="请输入taskCron(必填)"></Input>
        </FormItem>
        <FormItem label="任务标题" prop="taskName">
          <Input v-model="updateItem.taskName" placeholder="请输入任务标题(必填)"></Input>
        </FormItem>
        <FormItem label="任务参数" prop="taskParams">
          <Input v-model="updateItem.taskParams" placeholder="请输入任务参数(必填)"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加任务 -->
    <Modal
      v-model="addModal"
      title="添加"
      @on-ok="handleSave"
      @on-cancel="cancelSave"
      :loading="saveLoading"
    >
      <Form ref="saveRef" :model="saveItem" :rules="saveValidate" :label-width="80">
        <FormItem label="taskBean" prop="taskBean">
          <Input v-model="saveItem.taskBean" placeholder="请输入taskBean(必填)"></Input>
        </FormItem>
        <FormItem label="taskCron" prop="taskCron">
          <Input v-model="saveItem.taskCron" placeholder="请输入taskCron(必填)"></Input>
        </FormItem>
        <FormItem label="任务标题" prop="taskName">
          <Input v-model="saveItem.taskName" placeholder="请输入任务标题(必填)"></Input>
        </FormItem>
        <FormItem label="任务参数" prop="taskParams">
          <Input v-model="saveItem.taskParams" placeholder="请输入任务参数"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 任务日志 -->
    <Modal v-model="logModal" title="任务运行日志" :closable="false" :mask-closable="false" width="850px">
      <Row slot="header" class="log-modal-header">
        <Col :span="18">
          <span>任务调度日志</span>
        </Col>
      </Row>
      <Tables
        v-if="hasLog"
        :columns="logColumns"
        :pageShow="true"
        :total="logPageTotal"
        :value="logData"
        :page-size="logPageSize"
        :current="logPageNum"
        :show-elevator="false"
        :show-sizer="false"
        @on-change="logChangePage"
        style="height: 420px;"
      ></Tables>
      <div slot="footer">
        <Button type="primary" @click="closeLog">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import tables from '@/components/tables'
// import { taskScheduleApi } from '@/api/taskSchedule'
export default {
  name: 'task_schedule',
  components: {
    Tables: tables
  },
  data () {
    return {
      hasLog: false,
      editModal: false,
      addModal: false,
      logModal: false,
      // 当前所查看的任务Id
      taskId: '',
      // table是否loading
      loading: true,
      saveLoading: true,
      updateLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      logPageNum: 1,
      logPageSize: 6,
      logPageTotal: 0,
      updateItem: {
        taskBean: '',
        taskCron: '',
        taskName: '',
        taskParams: '',
        taskStatus: ''
      },
      saveItem: {
        taskBean: '',
        taskCron: '',
        taskName: '',
        taskParams: '',
        taskStatus: ''
      },
      // table表头
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'taskBean',
          key: 'taskBean'
        },
        {
          title: 'taskCron',
          key: 'taskCron'
        },
        {
          title: '任务标题',
          key: 'taskName'
        },
        {
          title: '任务参数',
          key: 'taskParams'
        },
        {
          title: '任务状态',
          key: 'taskStatus',
          width: 90,
          render: (h, params) => {
            return h('span', params.row.taskStatus === 0 ? '正常' : '暂停')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 230,
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
                  }
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
                      style: {
                        marginRight: '5px'
                      },
                      directives: [
                        {
                          name: 'privilege',
                          value: 'updata'
                        }
                      ],
                      on: {
                        taskBean: '',
                        click: () => {
                          this.updateItem.taskBean = params.row.taskBean
                          this.updateItem.id = params.row.id
                          this.updateItem.taskCron = params.row.taskCron
                          this.updateItem.taskName = params.row.taskName
                          this.updateItem.taskParams =
                                params.row.taskParams
                          this.updateItem.taskStatus =
                                params.row.taskStatus
                          this.editModal = true
                        }
                      }
                    },
                    ''
                  )
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '删除',
                    placement: 'top'
                  }
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small',
                        icon: 'md-trash'

                      },
                      style: {
                        marginRight: '5px'
                      },
                      directives: [
                        {
                          name: 'privilege',
                          value: 'delete'
                        }
                      ],
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: '删除',
                            content: '确认删除该条任务么？',
                            onOk: () => {
                              this.deleteTask(params.row.id)
                            }
                          })
                        }
                      }
                    },
                    ''
                  )
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '立即开始任务',
                    placement: 'top'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'run'
                    }
                  ]
                },

                [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        icon: 'ios-play'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: '确认',
                            content: '确认立即开始任务么？',
                            onOk: () => {
                              this.controlTask('RUN', params.row.id)
                            }
                          })
                        }
                      }
                    },
                    ''
                  )
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '暂停任务',
                    placement: 'top'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'pause'
                    }
                  ]
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        icon: 'ios-pause'
                      },
                      style: {
                        marginRight: '5px',
                        display:
                          params.row.taskStatus === 0 ? 'inline-block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: '确认',
                            content: '确认暂停任务么？',
                            onOk: () => {
                              this.controlTask('PAUSE', params.row.id)
                            }
                          })
                        }
                      }
                    },
                    ''
                  )
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '恢复任务',
                    placement: 'top'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'resume'
                    }
                  ]
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        icon: 'md-undo'
                      },
                      style: {
                        marginRight: '5px',
                        display:
                          params.row.taskStatus === 1 ? 'inline-block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: '确认',
                            content: '确认恢复任务么？',
                            onOk: () => {
                              this.controlTask('RESUME', params.row.id)
                            }
                          })
                        }
                      }
                    },
                    ''
                  )
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '查看日志',
                    placement: 'top'
                  },
                  directives: [
                    {
                      name: 'privilege',
                      value: 'queryLog'
                    }
                  ]
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        icon: 'md-search',
                        type: 'warning'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.taskId = params.row.id
                          this.logPageNum = 1
                          this.getTaskScheduleLog()
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
      //   日志表格表头
      logColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '任务名',
          key: 'taskName'
        },
        {
          title: '任务参数',
          key: 'taskParams'
        },
        {
          title: '主机IP',
          key: 'ipAddress'
        },
        {
          title: '处理结果',
          key: 'processStatus',
          render: (h, params) => {
            return h('span', params.row.processStatus === 0 ? '成功' : '失败')
          }
        },
        {
          title: '处理时长',
          key: 'processDuration',
          render: (h, params) => {
            return h('span', params.row.processDuration + 'ms')
          }
        },
        {
          title: '失败日志',
          key: 'processLog',
          render: (h, params) => {
            return h('span', params.row.processLog ? params.row.processLog : '无')
          }
        },
        {
          title: '运行时间',
          width: 190,
          key: 'createTime'
        }
      ],
      // table数据
      data: [],
      //   日志数据
      logData: [],
      updateValidate: {
        taskBean: [{ required: true, message: '请输入值', trigger: 'blur' }],
        taskCron: [{ required: true, message: '请输入值', trigger: 'blur' }],
        taskName: [
          { required: true, message: '请输入任务标题', trigger: 'blur' }
        ]

      },
      saveValidate: {
        taskBean: [{ required: true, message: '请输入值', trigger: 'blur' }],
        taskCron: [{ required: true, message: '请输入值', trigger: 'blur' }],
        taskName: [
          { required: true, message: '请输入任务标题', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getTaskScheduleList()
  },
  methods: {
    // 查询任务调度列表
    async getTaskScheduleList () {
      try {
        this.loading = true
        let result = await taskScheduleApi.getTaskScheduleList({
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
    // 查询任务运行日志
    async getTaskScheduleLog () {
      try {
        let result = await taskScheduleApi.getTaskScheduleLog({
          pageNum: this.logPageNum,
          pageSize: this.logPageSize,
          taskId: this.taskId
        })
        if (result.success) {
          this.logData = result.data.list
          this.logPageTotal = result.data.total
          this.logPageNum = result.data.pageNum
          this.logPageSize = result.data.pageSize
          this.hasLog = true
          this.logModal = true
        } else {
          this.$Message.error(result.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.getTaskScheduleList()
    },
    changePageSize (pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getTaskScheduleList()
    },
    // 日志分页
    logChangePage (pageNum) {
      this.logPageNum = pageNum
      this.getTaskScheduleLog()
    },
    // 删除任务
    async deleteTask (id) {
      try {
        let result = await taskScheduleApi.deleteTaskSchedule(id)
        if (result.success) {
          this.$Message.success('删除任务成功!')
          this.getTaskScheduleList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 操作任务
    async controlTask (type, id) {
      try {
        switch (type) {
          case 'RUN':
            await taskScheduleApi.runTaskSchedule(id)
            break
          case 'PAUSE':
            await taskScheduleApi.pauseTaskSchedule(id)
            break
          case 'RESUME':
            await taskScheduleApi.resumeTaskSchedule(id)
            break
        }
        this.$Message.success('操作成功')
        this.getTaskScheduleList()
      } catch (e) {
        console.log(e)
      }
    },
    // 触发更新
    handleUpdate () {
      this.$refs['updateRef'].validate(valid => {
        this.updateLoading = true
        if (valid) {
          this.updateTaskSchedule()
        } else {
          this.updateLoading = false
          this.$nextTick(() => {
            this.updateLoading = true
          })
        }
      })
    },
    // 修改任务
    async updateTaskSchedule () {
      try {
        let result = await taskScheduleApi.saveTaskSchedule(this.updateItem)
        if (result.success) {
          this.$Message.success('修改成功')
          this.getTaskScheduleList()
          this.cancelUpdate()
        } else {
          this.$Message.error(result.msg)

          this.updateLoading = false
          this.$nextTick(() => {
            this.updateLoading = true
          })
        }
      } catch (e) {
        this.updateLoading = false
      }
    },
    // 保存任务
    handleSave () {
      try {
        this.$refs['saveRef'].validate(valid => {
          this.saveLoading = true
          if (valid) {
            this.saveTaskSchedule()
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
    // 保存任务
    async saveTaskSchedule () {
      try {
        let result = await taskScheduleApi.saveTaskSchedule(this.saveItem)
        if (result.success) {
          this.$Message.success('添加成功')
          this.getTaskScheduleList()
          this.cancelSave()
        } else {
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
    closeLog () {
      this.logData = []
      this.logPageNum = 1
      this.hasLog = false
      this.logModal = false
    },
    refresh () {
      this.pageNum = 1
      this.getTaskScheduleList()
    }
  }
}
</script>

<style lang="less" scoped>
.log-modal-header {
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #17233d;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.log-modal-header-btn-group {
  text-align: right;
  button {
    margin: 0 5px;
    span {
      margin: 0;
    }
  }
}
</style>
