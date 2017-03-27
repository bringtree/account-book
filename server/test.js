var a = [
  {
    "status": 1,
    "date": "2017-03-23T02:30:24.837Z",
    "thing": "play",
    "money": 10,
    "_id": "58d7f310b727b0ca461155d7"
  },
  {
    "status": 1,
    "date": "2017-03-25T02:30:24.837Z",
    "thing": "play",
    "money": 10,
    "_id": "58d7f310b727b0ca461155d5"
  },
  {
    "status": 1,
    "date": "2017-03-24T02:30:24.837Z",
    "thing": "sleep",
    "money": 20,
    "_id": "58d7f310b727b0ca461155d6"
  }
];
a.sort(function (a,b) {
  return a.date.localeCompare(b.date);
})
console.log(a)
