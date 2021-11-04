// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    var prevExitState = this.exitState // 尝试获得上一次退出前 onSaveExitState 保存的数据
    if (prevExitState !== undefined) { // 如果是根据 restartStrategy 配置进行的冷启动，就可以获取到
      prevExitState.myDataField === 'myData' 
      console.log('prevExitState',prevExitState)
    }
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
