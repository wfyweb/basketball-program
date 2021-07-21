// pages/ballroom.js 
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
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
  }
 
})