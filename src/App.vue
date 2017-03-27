<template>
  <div>
    <div>

      <el-menu :default-active="activeIndex" router="true"  class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="addaccount">添加账单
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的账单</template>
          <el-menu-item index="2-1">收入
          </el-menu-item>
          <el-menu-item index="2-2">清账收入
          </el-menu-item>
          <el-menu-item index="2-3">支出
          </el-menu-item>
          <el-menu-item index="2-4">清账支出
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/account">
          <router-link to="/account">统计</router-link>
        </el-menu-item>
      </el-menu>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }</script>

<style scoped>
  @import './assets/css/reset.css';

</style>
