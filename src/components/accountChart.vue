<template>
  <div>
    <div class="block rf">
      <el-date-picker
              v-model="mydate"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              :picker-options="pickerOptions2">
      </el-date-picker>
    </div>
    <div>总收入:{{pieData[0].value+pieData[2].value}}</div>
    <div>总支出:{{pieData[1].value+pieData[3].value}}</div>
    <div id="charts" style="margin:0 auto;">
      <div id="main" :style="{width:'600px',height:'400px'}"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import  echarts from "echarts"

  export default{
    data(){
      return {
        account: this.$store.getters.doneAccount,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        mydate: [],
        showAccount: [],

        pieData: [
          {value: 0, name: '收入'},
          {value: 0, name: '支出'},
          {value: 0, name: '已经清账'},
          {value: 0, name: '未清的账'},
        ]
      }
    },
    watch: {
      mydate: function () {
        const deepCopy = function (o) {
          if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else if (o instanceof Object) {
            var n = {};
            for (var i in o)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else    return o;
        }
        const that = this;
        var account = deepCopy(that.account);
        var time = function (account, dateMode) {
          var result = [];
          for (var j = 0; j < account.length; j++) {
            if (account[j].date >= dateMode[0].toISOString() && account[j].date <= dateMode[1].toISOString())
              result.push(account[j]);
          }
          return result;
        };

        try {
          that.showAccount = time(account, that.mydate);
        }
        catch (err) {
        }
      },

      account: function () {
        const deepCopy = function (o) {
          if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else if (o instanceof Object) {
            var n = {};
            for (var i in o)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else    return o;
        }
        const that = this;
        var account = deepCopy(that.account);
        var time = function (account, dateMode) {
          var result = [];
          for (var j = 0; j < account.length; j++) {
            if (account[j].date >= dateMode[0].toISOString() && account[j].date <= dateMode[1].toISOString())
              result.push(account[j]);
          }
          return result;
        };

        try {
          that.showAccount = time(account, that.mydate);
        }
        catch (err) {
        }
      },
      showAccount: function () {
        const deepCopy = function (o) {
          if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else if (o instanceof Object) {
            var n = {};
            for (var i in o)
              n[i] = deepCopy(o[i]);
            return n;
          }
          else    return o;
        }
        const that = this;
        var account = deepCopy(that.showAccount);
        var solve = function (type, account) {
          var total = 0;
          for (var i = 0; i < account.length; i++) {
            if (account[i].status == type) {
              total += account[i].money;
            }
          }
          return total;
        };
        this.pieData[0].value = solve(1, account);
        this.pieData[1].value = solve(2, account);
        this.pieData[2].value = solve(3, account);
        this.pieData[3].value = solve(4, account);
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['收入', '支出', '已经清账', '未清的账']
            },
            series: [
              {
                name: '收支',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: that.pieData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        )
      }

    },
    mounted: function () {
      const that = this;
      var myChart = echarts.init(document.getElementById('main'));
      myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['收入', '支出', '已经清账', '未清的账']
          },
          series: [
            {
              name: '收支',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: that.pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      )
    }
  }

</script>

<style>

</style>
