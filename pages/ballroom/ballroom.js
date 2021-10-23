// pages/ballroom.js 
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
const chooseLocation = requirePlugin('chooseLocation');
const { config } = require('../../utils/util')
const formatTimeValue =()=>{
  let res = []
  for(let i=0;i<24;i++){
    res.push(`${i}:00`)
  }
  return res
}
const formatTimeData = () =>{
  const obj = new Object()
  for(let i=0;i<24;i++){
    if(i === 23){
      obj[`${i}:00`] = ['0:00']
    }else{
      // obj[`${i}:00`] = formatTimeValue().slice(i+1)
      obj[`${i}:00`] = [`${i+1}:00`]
    }
  }
  return obj
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    params:{},
    isBall: false,
    title:'',
    date: '',
    time:'',
    dateShow: false,
    timeShow: false,
    columns: [
      {
        values: Object.keys(formatTimeData()),
        className: 'column1',
      },
      {
        values: formatTimeData()['0:00'],
        className: 'column2',
        defaultIndex: 0,
      },
    ],
  },
  // 时段关联
  onTimeChange(event){
    const { value } = event.detail;
    const key = value[0]
    this.setData({
      columns:[
        {
          values: Object.keys(formatTimeData()),
          className: 'column1',
        },
        {
          values: formatTimeData()[key],
          className: 'column2',
          defaultIndex: 0,
        },
      ]
    })
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
    const { value, index } = event.detail;
    const timeValue = value.join('~')
    this.setData({
      time: timeValue,
      timeShow: false
    })
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
    console.log(params)
    this.setData({
      params,
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
    // TODO 约球请求
    const info = this.data.isBall ? '邀约':'发布'
    Toast({type:'success',message: info+'成功！',duration:1000});
    setTimeout(()=>{
      wx.navigateBack()
    },1000)
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
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log('ok==>',location)
  },
  onUnload () {
      // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
      chooseLocation.setLocation(null);
  }
})