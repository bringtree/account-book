<template>

  <div id="app">

    <accountLine :points="points"></accountLine>
  </div>


</template>

<script type="text/ecmascript-6">
  import accountLine from './accountLine.vue'
  import accountIncome from './accountIncome.vue'
  export default{
    data(){
      return {
        points: []
//          [
//
//            {
//              "status": 1,
//              "date": "2017-03-23T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155d7"
//            },
//            {
//              "status": 1,
//              "date": "2017-03-24T02:30:24.837Z",
//              "thing": "sleep",
//              "money": 20,
//              "_id": "58d7f310b727b0ca461155d6"
//            },
//            {
//              "status": 1,
//              "date": "2017-03-25T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155d5"
//            },
//            {
//              "status": 2,
//              "date": "2017-03-23T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155d4"
//            },
//            {
//              "status": 2,
//              "date": "2017-03-24T02:30:24.837Z",
//              "thing": "sleep",
//              "money": 20,
//              "_id": "58d7f310b727b0ca461155d3"
//            },
//            {
//              "status": 2,
//              "date": "2017-03-25T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155d2"
//            },
//            {
//              "status": 3,
//              "date": "2017-03-23T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155d1"
//            },
//            {
//              "status": 3,
//              "date": "2017-03-24T02:30:24.837Z",
//              "thing": "sleep",
//              "money": 20,
//              "_id": "58d7f310b727b0ca461155d0"
//            },
//            {
//              "status": 4,
//              "date": "2017-03-25T02:30:24.837Z",
//              "thing": "play",
//              "money": 10,
//              "_id": "58d7f310b727b0ca461155cf"
//            }
//
//          ]
      }
    },
    components: {
      'accountLine': accountLine,
      'accountIncome':accountIncome
    },
    mounted:function () {
    var that = this;
      this.$http.get("http://localhost:8080/user/api/income/xiao",{
        headers:{"Access-Control-Allow-Credentials":"true",
         },
      }).then(function(res){
        that.points =res.data;
      })
    }
  }
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

  }

</style>
