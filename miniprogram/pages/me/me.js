// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    send: 0,
    accept: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const isUser = wx.getStorageSync('user')
    if(isUser){
      this.setData({
        userInfo:isUser
      })
    }
    this.getMsgList()
  },
  getMsgList() {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'selectMsg',
      }
    }).then((res)=>{
      const date = res.result.data
      const opendId = wx.getStorageSync('opendId')
      const send = date.filter((item)=> item.sendId === opendId).length
      const accept = date.filter((item)=> item.acceptId === opendId).length
      this.setData({
        send,
        accept
      })
    })
  },
  toMsg(){
    wx.navigateTo({
      url: '../msg/msg'
    })
  },
  onUnload() {
    const isUser = wx.getStorageSync('user')
    console.log(isUser)
    console.log('用户卸载程序')
    // loginOut Api
    this.hanleOut()
  },
  hanleOut(){
    // wx.request({
    //   url: 'http://192.168.11.119:3000/loginOut?a=11&b=22', 
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log(res.data)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function () {

  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    //展示加载动画
    wx.showNavigationBarLoading()
    this.getMsgList()
    //设置延时停止动画
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    }, 1500);
  },
})