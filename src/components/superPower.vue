<template>
  <el-table
          :data="tableData"
          border
          style="width: 100%">
    <el-table-column
            label="Date"
            width="180">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
            label="Username"
            width="180">
      <template scope="scope">
        <span style="margin-left: 10px">{{ scope.row.username }}</span>
      </template>
    </el-table-column>
    <el-table-column
            label="Name"
            width="180">
      <template scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
            label="Thing"
            width="180">
      <template scope="scope">
        <span style="margin-left: 10px">{{ scope.row.thing }}</span>
      </template>
    </el-table-column>
    <el-table-column
            label="Money"
            width="180">
      <template scope="scope">
        <span style="margin-left: 10px">{{ scope.row.money }}</span>
      </template>
    </el-table-column>
    <el-table-column label="">
      <template scope="scope">
        <el-button
                size="small"
                type="success"
                @click="handleEdit(scope.$index, scope.row)">拨款
        </el-button>

        <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">不给
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          name: 'name',
          username: 'username',
          date: 'date',
          thing: 'thing',
          money: '10',
        }]
      }
    },
    methods: {
      handleEdit(index, row) {
        const that = this;
        var form = {
          date: row.date,
          money: row.money,
          username: row.username,
          status: row.status,
          _id: row._id,
          thing: row.thing,
          methods:''
        };
        this.$prompt('请输入清账方式', '清账方式', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          form.methods = value||'现金';
          that.$http.post('/boss/access', form)
            .then(function (res) {
              that.$message({
                showClose: true,
                type: res.data.type,
                message: res.data.message
              });
              if (res.data.type == 'success') {
                that.tableData.splice(index, 1)
              }
            })
            .catch((err) => {
              that.$message({
                showClose: true,
                type: 'error',
                message: "check your network"
              })
            });
        }).catch((err) => {
          this.$message({
            showClose:true,
            type: 'info',
            message: '取消输入'
          });
        });


      },
      handleDelete(index, row) {
        const that = this;
        var form = {
          username: row.username,
          _id: row._id,
        };
        that.$http.post('/boss/reject', form)
          .then(function (res) {
            that.$message({
              showClose: true,
              type: res.data.type,
              message: res.data.message
            });
            if (res.data.type == 'success') {
              that.tableData.splice(index, 1)
            }
          })
          .catch((err) => {
            that.$message({
              showClose: true,
              type: 'error',
              message: "check your network"
            })
          })

      }
    },
    mounted: function () {
      const that = this;
      this.$http.get('/user/api/hxji')
        .then(function (res) {
          that.tableData = res.data;
        })

    }
  }

</script>