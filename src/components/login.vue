<template>
  <div id="login">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submit">登陆</el-button>
        <el-button type="danger" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import router from '../router/index'
  import md5 from 'md5'

  export default {
    data(){
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      submit: function () {
        const that = this;
        var form = {
          username :that.form.username,
          password : md5(that.form.password)
        };

        this.$http.post("/login",form)
          .then(function (res) {
            if (res.status == 200) {
              that.$message({
                showClose: true,
                type: res.data.type || "error",
                message: res.data.message
              });
              if(res.data.type=="success"){
                router.push("menu")
              }
            }
          })
          .catch(function (err) {
            that.$message({
              showClose: true,
              type: "error",
              message: "let us check out our network"
            })
          })
      },
      register: function () {
        router.push("register")
      }
    }
  }
</script>

<style scoped>
  #login {
    margin-top: 10%;
    margin-right: 15%;
  }
</style>
