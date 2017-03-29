<template>
  <div id="register">
    <el-form label-width="100px" class="demo-ruleForm" :rules="rules2" :model="ruleForm2">
      <el-form-item label="称呼" prop="user">
        <el-input v-model="ruleForm2.user"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm2.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm2.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button type="danger" @click="clearUp">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      var checkUser = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('称呼不能为空'));
        }
        return callback();

      };
      var checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        else {
          this.$http.post('/user/api/checkusername', {"username": value})
            .then((res) => {
              if (res.status == 200) {
                if (res.data.message == "repeat") {
                  return callback(new Error('该用户名已经被使用过了'));
                }
                else {
                  callback();
                }
              }
            })
            .catch((err) => {
              return callback(new Error(err));
            })
        }
      };
      var checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        }
        return callback();
      };
      return {
        ruleForm2: {
          user: "",
          username: "",
          password: ""
        },
        rules2: {
          user: [
            {validator: checkUser, trigger: 'blur'}
          ],
          username: [
            {validator: checkUsername, trigger: 'blur'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      clearUp: function () {
        this.ruleForm2.user = "";
        this.ruleForm2.username = "";
        this.ruleForm2.password = "";
      },
      submit: function () {
        const that = this;
        console.log(this)
        this.$http.post('/register', this.ruleForm2)
          .then(function (res) {
              that.$message({
                showClose: true,
                message: res.data.message,
                type: res.data.type
              });
            }
          );
      }
    }
  }
</script>

<style scoped>
  #register{
    margin-top:10%;
    margin-right:15%;
  }
</style>
