// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    // latitude: 34.086223,
    // longitude: 113.847763,  
    latitude: 23.096994,
    longitude: 113.324520,  
    markers: [],
    currMaker:{}
  },

  onLoad() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'F5FBZ-A6EKD-GDC44-HNQZ7-QY3SZ-RAFTG'
  });
    this.getLocation()
  },
  onSearch(){
    const {data} = this
    const that = this
    const location = `${data.latitude},${data.longitude}`
    qqmapsdk.search({
      keyword:'篮球',
      location:location,
      success:res=>{
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中  
            title: res.data[i].title,
            id:  Number(res.data[i].id),
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../image/mk.png", //图标路径
            width: 22,
            height: 22,
            _distance:res.data[i]._distance
          })
        }
        that.setData({
          markers:mks
        })
      },
      fail:error=>{
        console.log(error)
      }
    })
  },
  //获取当前位置
  getLocation() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.getLocation ({
        type:'gcj02',
        success: function(res){
          wx.hideLoading()
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({
            latitude,
            longitude,
          })
          that.onSearch()
      },
      fail: function () {
        wx.hideLoading();
        // 获取用户当前的授权状态
        wx.getSetting({
          success: function (res) {
            // 用户授权结果
            console.log(res.authSetting)
            if (!res.authSetting['scope.userLocation']) {
              console.log('请在系统设置中打开定位服务')
              wx.showModal({
                title: '提示',
                content: '请允许获取您的定位',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting();
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            }else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              console.log('请在系统设置中打开定位服务')
              wx.showModal({
                title: '提示',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定', 
                success: function (res) {
                }
              })
            }
          }
        })
      }
 
    })
  },
  handleMaker(e){
    let markers = this.data.markers
    // console.log('num',e.detail.markerId.toString())
    console.log('e',e)
    const makeId = e.detail.markerId
    let makerIndex = 0
    let marker = {}
    this.data.markers.map((item,index)=>{
      if(item.id === makeId){
        makerIndex = index
        marker = item
      }
    })
    const params ={ 
      makerIndex: makerIndex,
      marker:marker
     }
    wx.navigateTo({
      url: '../ballroom/ballroom?params='+JSON.stringify(params),
      // events: {
      //   someEvent: function(data) {
      //     console.log(data)
      //   },
      // },
      // success: function(res) {
      //   // 通过eventChannel向被打开页面传送数据
      //   res.eventChannel.emit('someEvent', 
         
      //   )
      // }
    })
  }
})