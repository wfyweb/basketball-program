// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    params:{}
  },
  onLoad(option) {
    // console.log(option.params);
    // this.setData({
    //   params:JSON.parse(option.params)
    // })
    console.log(option.query)
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
