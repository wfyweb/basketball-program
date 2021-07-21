// pages/user/user.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
    integral:'',
    show: false,
    columns: ['1500', '1600', '1700', '1800', '1900','2000'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const isUser = wx.getStorageSync('user')
    if (isUser) {
      console.log(isUser)
      this.setData({
        avatarUrl: isUser.avatarUrl,
        nickName: isUser.nickName,
      })
    }
  },
  handleIntegral(){
    this.setData({ show: true });
  },
  onClose () {
    this.setData({ show: false });
  },
  onConfirm (event) {
    const { value, index } = event.detail;
    this.setData({
      integral: value,
      show: false
    })
  },
  // 确定
  handleSave() {
    if (this.data.integral === '') {
      Toast.fail('请选择积分！');
      return
    }
    const isUser = wx.getStorageSync('user')
    isUser.integral = Number(this.data.integral)
    wx.setStorageSync('user', isUser)
    // TODO 约球请求
    Toast({ type: 'success', message: '注册成功！', duration: 1000 });
    setTimeout(() => {
      wx.switchTab({
        url: '../map/index'
      })
    }, 1000)
  }
})