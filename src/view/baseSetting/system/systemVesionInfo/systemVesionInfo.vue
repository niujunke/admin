<template>
  <div>
    <Card class="cardInfo">
      <p slot="title">系统信息</p>
      <div class="content">
        <p>
          <span>构建主机：</span>
          {{codeVersionInfo.buildHost}}
        </p>
        <p>
          <span>构建时间：</span>
          {{codeVersionInfo.buildTime }}
        </p>
        <p>
          <span>构建人邮箱：</span>
          {{codeVersionInfo.buildUserEmail }}
        </p>
        <p>
          <span>构建人：</span>
          {{codeVersionInfo.buildUserName }}
        </p>
        <p>
          <span>构建版本：</span>
          {{codeVersionInfo.buildVersion }}
        </p>
        <p>
          <span>最后一次提交日志：</span>
          {{codeVersionInfo.commitFullMessage }}
        </p>
        <p>
          <span>最后一次提交id：</span>
          {{codeVersionInfo.commitId }}
        </p>
        <p>
          <span>最后一次提交日志简介：</span>
          {{codeVersionInfo.commitShortMessage }}
        </p>
        <p>
          <span>最后一次提交时间：</span>
          {{codeVersionInfo.commitTime }}
        </p>
        <p>
          <span>最后一次提交人邮箱：</span>
          {{codeVersionInfo.commitUserEmail }}
        </p>
        <p>
          <span>最后一次提交人：</span>
          {{codeVersionInfo.commitUserName }}
        </p>
        <p>
          <span>当前代码分支：</span>
          {{codeVersionInfo.currentBranch }}
        </p>
        <p>
          <span>GIT远程库地址：</span>
          {{codeVersionInfo.remoteOriginUrl }}
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
// import { systemParamsApi } from '@/api/systemParams'
export default {
  data () {
    return {
      // 系统系统obj
      codeVersionInfo: {
        buildHost: '主机一号'
      }
    }
  },
  methods: {
    // 获取系统信息
    async getCodeVersion () {
      try {
        let res = await systemParamsApi.getCodeVersion()
        this.codeVersionInfo = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    this.getCodeVersion()
  }
}
</script>

<style lang="less" scoped>
.cardInfo {
  // width:640px
}
.content {
  p {
    padding-top: 10px;
    color: #666;
    span {
      color: #333;
    }
  }
}
</style>
