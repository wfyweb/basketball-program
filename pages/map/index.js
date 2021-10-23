// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var { config } = require('../../utils/util')
var qqmapsdk;
Page({
  data: {
    latitude: null,
    longitude: null,  
    markers: [],
    currMaker:{},
    typeMaker: 0, // 0：球场  1：好友
    isToolFriend: false,
    friendIndex: 0
  },

  onLoad() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.key
  });
    this.getLocation()
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
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
          markers:mks,
          typeMaker: 0
        })
      },
      fail:error=>{
        console.log(error)
      }
    })
  },
  getFriend(e) {
    // TODO MOCK
    var mks = [
      { // 获取返回结果，放到mks数组中  
        title: '好友1',
        id:0,
        latitude: 31.2231,
        longitude: 121.560743, 
        iconPath: "../../image/mk.png", //图标路径
        width: 22,
        height: 22,
        // _distance:res.data[i]._distance
      },
      { // 获取返回结果，放到mks数组中  
        title: '好友2',
        id:1,
        latitude: 31.211762,
        longitude: 121.53347, 
        iconPath: "../../image/mk.png", //图标路径
        width: 22,
        height: 22,
        // _distance:res.data[i]._distance
      },
    ]
    this.setData({
      markers: mks,
      typeMaker: 1,
    })
  },
  // 定位用户中心
  centerMap() {
    this.mapCtx.moveToLocation()
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
  // 点击地图图标
  handleMaker(e){
    if( this.data.typeMaker ){
      // 点击好友
      this.handleFriendMaker(e)
    }else{
      //  点击球场
      this.handleBallMaker(e)
    }
  },
  handleFriendMaker(e){
    const makeId = e.detail.markerId
    const item = this.data.markers.filter((v)=>v.id === makeId)[0]
    this.setData({
      isToolFriend: true,
      friendIndex: e.detail.markerId
    })
    
  },
  // 点击球场，进入导航
  handleBallMaker(e){
    console.log('qiu e',e)
    const makeId = e.detail.markerId
    this.openRoutePlan(makeId)
  },
  tapMassage() {
    const makeId = this.data.friendIndex
    const item = this.data.markers.filter((v)=>v.id === makeId)[0]

    wx.navigateTo({
      url: '../ballroom/ballroom?params='+JSON.stringify(item)
    })
  },
  tapRote(){
    const makeId = this.data.friendIndex
    this.openRoutePlan(makeId)
  },
  // 打开地图导航
  openRoutePlan(id){
    const item = this.data.markers.filter((v)=>v.id === id)[0]
    let key = config.key;  
    let referer = config.referer;   
    let themeColor = config.themeColor;
    let endPoint = JSON.stringify({  //终点
      'name': item.title,
      'latitude': item.latitude,
      'longitude': item.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  }
})
