// app.js
App({
  onLaunch() {
    var prevExitState = this.exitState // 尝试获得上一次退出前 onSaveExitState 保存的数据
    if (prevExitState !== undefined) { // 如果是根据 restartStrategy 配置进行的冷启动，就可以获取到
      prevExitState.myDataField === 'myData' 
      console.log('prevExitState',prevExitState)
    }
    // const store = wx.getStorageSync('user')
    // if(store){
    //   console.log('ok',store)
    //   wx.switchTab({
    //     url: '../map/index'
    //   })
    // }else{
    //   console.log('no',store)
    // }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.request({
      url: 'http://192.168.11.119:3000/user?a=11&b=22', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },
  onHide(){
    const isUser = wx.getStorageSync('user')
    console.log('用户切换后台')
    console.log(isUser)
  },
  onUnload() {
  
    const isUser = wx.getStorageSync('user')
    console.log(isUser)

    console.log('用户卸载程序')
    // loginOut Api
    this.hanleOut()

  },
  hanleOut(){
    wx.request({
      url: 'http://192.168.11.119:3000/loginOut?a=11&b=22', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },
  onSaveExitState: function() {
    this.hanleOut()
    console.log('onSaveExitState')
    var exitState = { myDataField: 'myData' } // 需要保存的数据
    return {
      data: exitState,
      expireTimeStamp: Date.now() + 24 * 60 * 60 * 1000 // 超时时刻
    }
  },
  globalData: {
    userInfo: null
  }
})
