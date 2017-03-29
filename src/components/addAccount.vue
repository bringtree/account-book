<template>
  <div id="addCount">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Thing:"
                    prop="thing"
                    :rules="[
      { required: true, message: 'thing can\'t not be a null'},
    ]">
        <el-input v-model="form.thing"></el-input>
      </el-form-item>
      <el-form-item label="Status"
                    prop="status"
                    :rules="[
      { required: true, message: 'status can\'t not be a null'},
    ]">
        <el-select v-model="form.status" placeholder="choose your accountType" style="width:100%">
          <el-option label="收入" value="1"></el-option>
          <el-option label="清账收入" value="2"></el-option>
          <el-option label="支出" value="3"></el-option>
          <el-option label="记账支出" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Time"
                    prop="date"
                    :rules="[
      { required: true, message: 'date can\'t not be a null'},
    ]">
            <el-date-picker
              v-model="form.date"
              type="datetime"
              placeholder="选择日期时间"
              style="width:100%">
            </el-date-picker>
      </el-form-item>
      <el-form-item
        label="money"
        prop="money"
        :rules="[
      { required: true, message: 'money can\'t not be a null'},
      { type: 'number', message: 'money must be a number'}
    ]"
      >
        <el-input type="money" v-model.number="form.money" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return {
        form: {
          thing: '',
          status: '',
          date: '',
          money: '',

        }
      }
    },
    methods: {
      onSubmit()
      {
        var that = this;
        if(this.form.thing&&this.form.status&&this.form.date&&this.form.money){
          this.$http.post('/user/api/add/', this.form)
            .then(function (res) {
              if(res.status==200){
                that.$message({
                  showClose:true,
                  type:res.data.type||"error",
                  message:res.data.message
                })
              }

            })
            .catch((err) => {
              that.$message({
                showClose:true,
                type:"error",
                message:err
              })
            })
        }else{
          that.$message({
            showClose:true,
            type:"error",
            message:"check out your input"
          })
        }
      }
    }

  }

</script>

<style scoped>
#addCount{
  margin-top: 30px;
}

</style>
