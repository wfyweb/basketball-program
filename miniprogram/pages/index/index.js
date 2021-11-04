// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开启偶豫Club之旅',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    canIUseOpenData: false,// 如需尝试获取用户信息可改为false
    envId:'',
    opendId:''
  },
  // 事件处理函数
  bindViewMap() {
    const isUser = wx.getStorageSync('user')
    wx.switchTab({
      url: '../map/index'
    })
  },
  onLoad(options) {
    // 登录过跳转主页
    // const toMap = wx.getStorageSync('toMap')
    // if(toMap && toMap.toMap){
    //   this.bindViewMap()
    // }
    this.setData({
      envId: options.envId
    });
    // 判断用户信息
    const isUser = wx.getStorageSync('opendId')
    if(isUser){
      this.setData({
        canIUseOpenData:true
      })
      wx.setStorageSync('toMap', {toMap:true})
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          canIUseOpenData:true
        })
        wx.setStorageSync('user', res.userInfo)
        this.getOpenId()
      },
      fail:(res)=>{
        console.log('error',res)
      }
    })
  },
  // 用户在小程序下的唯一标识
  getOpenId() {
   wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      const opendId = resp.result.openid
      this.setData({
        opendId
      })
      wx.setStorageSync('opendId', opendId)
      this.saveUser()

   }).catch((e) => {
     console.log('get opendid error', e);
    })
  },
  saveUser(){
    const {opendId, userInfo} = this.data
    // 创建用户接口
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'addUser',
        opendId,
        nickName:userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      }
    }).then((res) => {
      // console.log('add user',res)
   })
  }
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   wx.setStorageSync('user', e.detail.userInfo)

  // }
})
