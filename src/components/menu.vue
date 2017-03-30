<template>
  <div>
    <div>
      <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal"
               @select="handleSelect">
        <el-menu-item index="/menu/addcount">添加账单
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">我的账单</template>
          <el-menu-item index="/menu/accountline">总览
          </el-menu-item>
          <el-menu-item index="/menu/">未清的帐
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/menu/">统计
        </el-menu-item>

        <el-submenu style="float:right" index="2">
          <el-menu-item index="/login">登出</el-menu-item>
          <el-menu-item index="/login">后台</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect:function(key, keyPath) {
        if ("/login" == key) {
          this.$http.get("/user/api/clear")
        }
      }
    }
  }
</script>

<style scoped>

  @import '../assets/css/reset.css';

</style>
