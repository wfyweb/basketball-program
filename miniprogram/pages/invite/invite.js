// pages/ballroom.js 
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
const chooseLocation = requirePlugin('chooseLocation');
const { formatTime } = require('../../utils/util')
const { config } = require('../../config')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    params:{},
    location: {
      name:''
    },
    title: '',
    // 接受人
    acceptId:'',
    date: formatTime('yyyy/MM/dd'),
    time: formatTime('hh:mm'),
    dateShow: false,
    timeShow: false,

  },
  handleTime(){
    this.setData({ timeShow: true });
  },
  onDisplay() {
    this.setData({ dateShow: true });
  },
  onClose() {
    this.setData({ dateShow: false });
  },
  onTimeClose(){
    this.setData({ timeShow: false });
  },
  onTimeConfirm(event){
    this.setData({
      time: event.detail,
      timeShow: false,
    });
  },
  onInput(event) {
    this.setData({
      time: event.detail,
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      dateShow: false,
      date: this.formatDate(event.detail),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const params = JSON.parse(options.params) 
    console.log('onload',params)
    
    this.setData({
      params,
      title: params.title,
      acceptId: params.opendId
    })
  },
  handleSave(){
    console.log(this.data)
    if(this.data.date === ''){
      Toast.fail('请选择日期！');
      return
    }
    if(this.data.time === ''){
      Toast.fail('请选择时段！');
      return
    }
    if(this.data.location.name === ''){
      Toast.fail('请选择地点！');
      return
    }
    const {title, date, time, location,acceptId } = this.data
    const sendId = wx.getStorageSync('opendId')

    const params = {
      title, date, time, location,sendId,acceptId,sendState: 0
    }
    console.log('parmans', params);
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'addMsg',
        ...params
      }
    })
    .then((res)=>{
      console.log('邀请成功！')
      Toast({type:'success',message: '发送成功！',duration:1000});
      setTimeout(()=>{
        wx.navigateBack()
      },1000)
    })
    
  },
  selectMap() {
    const key = config.key;
    const referer = config.referer; 
    wx.getLocation({
      type: 'gcj02', 
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const location = JSON.stringify({
          latitude,
          longitude
        });
        const category = '生活服务,娱乐休闲';
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
        })
      }
     })
  },
  onShow () {
    const location = chooseLocation.getLocation();
    if(location && location.name){
      this.setData({
        location
      })
    }
    
  },
  onUnload () {
    chooseLocation.setLocation(null);
  }
})