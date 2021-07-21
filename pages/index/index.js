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
    canIUseOpenData: false// 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewMap() {
    const isUser = wx.getStorageSync('user')
    console.log(isUser.integral)
    if (isUser.integral && isUser.integral>0){
      wx.switchTab({
        url: '../map/index'
      })
    }else{
      wx.navigateTo({
        url: '../user/user',
      })
    }
  },
  onLoad() {
    // 登录过跳转主页
    // const toMap = wx.getStorageSync('toMap')
    // if(toMap && toMap.toMap){
    //   this.bindViewMap()
    // }
    // 判断用户信息
    const isUser = wx.getStorageSync('user')
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
        console.log(res,'res')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          canIUseOpenData:true
        })
        wx.setStorageSync('user', res.userInfo)
      },
      fail:(res)=>{
        console.log('error',res)
      }
    })
  },
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
