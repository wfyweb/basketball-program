// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const { config } = require('../../config')
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
    wx.showLoading({
      title: '获取附近篮球场',
    })
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
          typeMaker: 0,
          isToolFriend: false,
        })
        wx.hideLoading();
      },
      fail:error=>{
        console.log('获取附近篮球场失败',error)
        wx.hideLoading();
      }
    })
  },
  setUserInfo(){
    
    const opendId = wx.getStorageSync('opendId')
    const {latitude, longitude} = this.data
    wx.showLoading({
      title: '同步您的位置',
    })
    console.log('地图页openId',opendId);
    // 更新用户接口
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'setUser',
        opendId,
        latitude,
        longitude,
        state: 1,
      }
    }).then((res)=>{
      wx.hideLoading();
      console.log('set user loattion',res);
    }).catch((e)=>{
      wx.hideLoading();
      console.log('set user info error',e);
    })
  },
  getFriend(e) {
    wx.showLoading({
      title: '获取附近好友',
    })
    const that = this
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'selectUser',
      }
    })
    .then((res)=>{
      const opendId = wx.getStorageSync('opendId')
      const list = res.result.data.filter((item)=>item.opendId !== opendId && item.state)
      console.log('opendId', opendId);
      console.log('list', list);
      const mk = list.map((item, index)=>{
        return {
          title: item.nickName,
          iconPath: item.avatarUrl,
          latitude: item.latitude,
          longitude: item.longitude,
          opendId: item.opendId,
          width: 32,
          height: 32,
          id:index,
          label:{
            borderRadius: 8,  //边框圆角
            borderWidth: 4,  //边框宽度
            borderColor: '#fff',
            // bgColor: '#ffffff',  //请勿设置背景色
            width: 38,
            height: 38,
            anchorX:-18,
            anchorY: -36
          },
        }
      })
      that.setData({
        markers: mk,
        typeMaker: 1,
      })
      console.log('data',this.data.markers)
      wx.hideLoading();
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
          setTimeout(()=>{
            that.setUserInfo()
          },2000)
      },
      fail: function () {
        wx.hideLoading();
        // 获取用户当前的授权状态
        wx.getSetting({
          success: function (res) {
            // 用户授权结果
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
    const makeId = e.detail.markerId
    this.openRoutePlan(makeId)
    
  },
  tapMassage() {
    const makeId = this.data.friendIndex
    const item = this.data.markers.filter((v)=>v.id === makeId)[0]

    wx.navigateTo({
      url: '../invite/invite?params='+JSON.stringify(item)
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
  },
  onShow(){
  }
})
