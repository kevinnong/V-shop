<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <div id="main" style="width:600px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
export default {
  data() {
    return {}
  },
  created() {},
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败!')
    }
    console.log(res)

    myChart.setOption(res.data)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>