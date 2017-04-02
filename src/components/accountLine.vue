<template>

  <section class="timeline-container timeline">
    <div class="submenu">
      <el-checkbox-group v-model="stateMode" class="lf">
        <el-checkbox label="收入" style="color:#75ce66"></el-checkbox>
        <el-checkbox label="支出" style="color:#f0ca45"></el-checkbox>
        <el-checkbox label="已经清账" style="color:#c03b44"></el-checkbox>
        <el-checkbox label="未清的账" style="color:#00bbff"></el-checkbox>
      </el-checkbox-group>

      <div class="block rf">
        <el-date-picker
                v-model="mydate"
                type="daterange"
                align="right"
                placeholder="选择日期范围"
                :picker-options="pickerOptions2">
        </el-date-picker>
      </div>
    </div>
    <div class="sortMode lf clear">
      <el-radio class="radio" v-model="factor.sortMode" label="date">按时间排序</el-radio>
      <el-radio class="radio" v-model="factor.sortMode" label="money">按金额排序</el-radio>
      <el-radio class="radio" v-model="factor.sortMode" label="status">按类型排序</el-radio>
    </div>
    <div class="clear"></div>

    <div v-for="point in showAccount" class="timeline-block">
      <div class="timeline-img" :class="['timeline-img',point.status===undefined?'red':color[point.status-1]]">
      </div>
      <div class="timeline-content">
        <div v-if=" point.status != '4' " style="display: inline;">
          <h2 @click="edit(point.thing,'thing',point)" class="edit">Thing:{{point.thing}}</h2>
          <p @click="edit(point.money,'money',point)" class="edit"> Money:{{(point.status==(1|3))?'+':'-'}}{{point.money}}</p>
          <span @click="edit(point.date,'date',point)" class="edit">Data:{{point.date}}</span>
          <el-button :plain="true" type="danger" class="rf" @click="del(point)">删除</el-button>
        </div>
        <div v-if=" point.status == '4' " style="display: inline;">
          <h2>Thing:{{point.thing}}</h2>
          <p> Money:{{(point.status==(1|3))?'+':'-'}}{{point.money}}</p>
          <span>Data:{{point.date}}</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import{mapGetters,mapActions} from 'vuex'

  export default{

    data(){
      return {
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
        showAccount: [],
        color: ["green", "yellow", "red", 'blue'],
        stateMode: ['0', '收入', '支出', '已经清账', '未清的账'],
        mydate: '',

        factor: {
          account: [],
          sortCode: '1',
          stateCode: ['0', '1', '2', '3', '4'],
          sortMode: '1',
          dateMode: ['0', '999999999999999'],
        },


      }
    },
    watch: {

      mydate: function (value) {
        var date = new Array();
        date[0] = value[0].toISOString();
        date[1] = value[1].toISOString();
        this.factor.dateMode = date;
        return value;
      },
      factor: {
        handler: function (v) {
          var account = v.account.slice();
          var sortCode = v.sortCode;
          var stateCode = v.stateCode;
          var sortMode = v.sortMode;
          var dateMode = v.dateMode;

          var state = function (account, value) {
            var result = [];
            for (var i = 1; i < stateCode.length; i++) {
              for (var j = 0; j < account.length; j++) {
                if (account[j].status == stateCode[i]) {
                  result.push(account[j]);
                }
              }
            }
            return result;
          };

          var time = function (account, dateMode) {
            var result = [];
            for (var j = 0; j < account.length; j++) {
              if (account[j].date >= dateMode[0] && account[j].date <= dateMode[1])
                result.push(account[j]);
            }
            return result;

          }

          var sort = function (account, value) {
            if (value == 'date') {
              account.sort(function (a, b) {
                return b.date.localeCompare(a.date);
              })
            }
            if (value == 'money') {
              account.sort(function (a, b) {
                return b.money > a.money;
              })
            }
            if (value == 'status') {
              account.sort(function (a, b) {
                return b.status < a.status
              })
            }
          };

          account = state(account, stateCode);

          try {
            account = time(account, dateMode);

          }
          catch (err) {
            account = []

          }

          sort(account, sortMode);
          this.showAccount = account
        },
        deep: true
      },

      stateMode: function (state) {
        var type = new Array();
        type.push('0');

        var foo = function (chineseType, numType) {
          if (state.findIndex((v) => {
              return v == chineseType;
            }) > 0) {
            if (type.indexOf(numType) < 0) {
              type.push(numType);
            }
          } else {
            if (type.indexOf(numType) > 0) {
              type.pop(numType);
            }
          }
        };
        foo('收入', '1');
        foo('支出', '2');
        foo('已经清账', '3');
        foo('未清的账', '4');

        this.factor.stateCode = type;

      }
    },
    methods: {
      del: function (event) {
        var that = this;

        var pos = that.factor.account.findIndex((ele) => {
          return ele._id == event._id;
        });

        this.$http.post('http://localhost:8080/user/api/del/', {id: event._id}).then(function (res) {
          if (res.status == 200) {
            that.$message({
              showClose: true,
              type: res.data.type,
              message: res.data.message
            });

            that.factor.account.splice(pos, 1);
          }
          else {
            that.$message({
              showClose: true,
              type: "error",
              message: "check your network"
            })
          }
        });
        console.log(that.factor.account);
      },


      edit(v, type, point) {
        this.$prompt('原数据是' + v + ',请输入你要修改的数据', '编辑修改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {

          if (value == null) {
            value = v;
          }
          point[type] = value;
          var that = this;
          this.$http.post("http://localhost:8080/user/api/edi", point).then(function (res) {
            that.$message({
              type: res.data.type,
              message: res.data.message
            });


          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }


    },
    computed: {

    },
    mounted: function () {
      var that = this;
      this.$http.get("http://localhost:8080/user/api/allcome/").then(function (res) {
        that.$store.commit('update',{account:res.data})
        that.factor.account = res.data;
      });
    }

  }

</script>

<style scoped>
  .timeline-container {
    /* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */
    width: 90%;
    max-width: 1170px;
    margin: 0 auto;
  }

  .timeline-container::after {
    /* clearfix */
    content: '';
    display: table;
    clear: both;
  }

  .timeline {
    position: relative;
    padding: 2em 0;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  /*.timeline::before {*/
  /*!* this is the vertical line *!*/
  /*content: '';*/
  /*position: absolute;*/
  /*top: 10%;*/
  /*left: 18px;*/
  /*height: 100%;*/
  /*width: 4px;*/
  /*background: rgb(32, 160, 255);*/
  /*}*/

  @media only screen and (min-width: 1170px) {
    .timeline {
      margin-top: 3em;
      margin-bottom: 3em;
    }

    .timeline::before {
      left: 50%;
      margin-left: -2px;
    }
  }

  .timeline-block {
    position: relative;
    margin: 2em 0;
  }

  .timeline-block:after {
    content: "";
    display: table;
    clear: both;
  }

  .timeline-block:first-child {
    margin-top: 0;
  }

  .timeline-block:last-child {
    margin-bottom: 0;
  }

  @media only screen and (min-width: 1170px) {
    .timeline-block {
      margin: 4em 0;
    }

    .timeline-block:first-child {
      margin-top: 0;
    }

    .timeline-block:last-child {
      margin-bottom: 0;
    }
  }

  .timeline-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 0 4px white, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
  }

  .timeline-img img {
    display: block;
    width: 24px;
    height: 24px;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -12px;
    margin-top: -12px;
  }

  .timeline-img.green {
    background: #75ce66;
  }

  .timeline-img.red {
    background: #c03b44;
  }

  .timeline-img.yellow {
    background: #f0ca45;
  }

  .timeline-img.blue {
    background: #00bbff;
  }

  @media only screen and (min-width: 1170px) {
    .timeline-img {
      width: 60px;
      height: 60px;
      left: 50%;
      margin-left: -30px;
      /* Force Hardware Acceleration in WebKit */
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
    }

    .cssanimations .timeline-img.is-hidden {
      visibility: hidden;
    }

    .cssanimations .timeline-img.bounce-in {
      visibility: visible;
      -webkit-animation: bounce-1 0.6s;
      -moz-animation: bounce-1 0.6s;
      animation: bounce-1 0.6s;
    }
  }

  .timeline-content {
    position: relative;
    margin-left: 60px;
    background: white;
    border-radius: 0.25em;
    padding: 1em;
    border: 3px solid rgb(33, 160, 255);
    box-shadow: 0 3px 0 #d7e4ed;
  }

  .timeline-content:after {
    content: "";
    display: table;
    clear: both;
  }

  .timeline-content h2 {
    color: #303e49;
  }

  .timeline-content::before {
    content: '';
    position: absolute;
    top: 16px;
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid white;
  }

  @media only screen and (min-width: 768px) {
    .timeline-content h2 {
      font-size: 20px;
      font-size: 1.25rem;
    }

    .timeline-content p {
      font-size: 16px;
      font-size: 1rem;
    }

  }

  @media only screen and (min-width: 1170px) {
    .timeline-content {
      margin-left: 0;
      padding: 1.6em;
      width: 45%;
    }

    .timeline-content::before {
      top: 24px;
      left: 100%;
      border-color: transparent;
      border-left-color: white;
    }

    .timeline-block:nth-child(even) .timeline-content {
      float: right;
    }

    .timeline-block:nth-child(even) .timeline-content::before {
      top: 24px;
      left: auto;
      right: 100%;
      border-color: transparent;
      border-right-color: white;
    }

    .cssanimations .timeline-content.is-hidden {
      visibility: hidden;
    }

    .cssanimations .timeline-content.bounce-in {
      visibility: visible;
      -webkit-animation: bounce-2 0.6s;
      -moz-animation: bounce-2 0.6s;
      animation: bounce-2 0.6s;
    }
  }

  @media only screen and (min-width: 1170px) {
    /* inverse bounce effect on even content blocks */
    .cssanimations .timeline-block:nth-child(even) .timeline-content.bounce-in {
      -webkit-animation: bounce-2-inverse 0.6s;
      -moz-animation: bounce-2-inverse 0.6s;
      animation: bounce-2-inverse 0.6s;
    }
  }

  .edit:hover {
    color: rgb(104, 151, 187);
  }

</style>

