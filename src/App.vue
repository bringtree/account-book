<template>
  <div>
    <div>

      <el-menu :default-active="activeIndex" :router="true"  class="el-menu-demo" mode="horizontal">
        <el-menu-item index="addaccount">添加账单
        </el-menu-item>
        <el-submenu index="/account">
          <template slot="title">我的账单</template>
          <el-menu-item index="/account">近期总览
          </el-menu-item>
          <el-menu-item index="/">收入
          </el-menu-item>
          <el-menu-item index="/">清账收入
          </el-menu-item>
          <el-menu-item index="/">支出
          </el-menu-item>
          <el-menu-item index="/">清账支出
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/">统计
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
//      handleSelect(key, keyPath) {
//        console.log(key, keyPath);
//      }
    }
  }</script>

<style scoped>
  @import './assets/css/reset.css';

</style>
