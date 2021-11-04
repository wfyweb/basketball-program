Page({
  data: {
    sendList:[],
    acceptList:[],
    list:[],
    active: 0,
  },
  onLoad: function(option) {
    const opendId = wx.getStorageSync('opendId')
    console.log('init')
    this.setData({
      opendId
    })
    setTimeout(()=>{
      this.getList()
    },200)
  },
  onChange(event){
    console.log('event',event);
    const active = event.detail.index
    this.setData({
      active,
      list:[]
    })
    this.getList()
  },
  getList(){
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'selectMsg',
      }
    }).then((res)=>{
      console.log(res.result.data)
      const data = res.result.data
      const {active,opendId} = this.data
      let list = []
      if(active) {
        list = data.filter((item)=>item.acceptId === opendId )
      }else{
        list = data.filter((item)=>item.sendId === opendId )
      }
      this.setData({
        list
      })
      wx.hideLoading();
    })
  },
  // 同意
  onAgree(e) {
    //  send 1
    const id = e.currentTarget.dataset.item;
    const params = {
      id,
      state: 1
    }
    console.log('同意',params)
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'setMsg',
        ...params
      }
    })
    .then((res)=>{
      setTimeout(()=>{
        this.getList()
      },1000)
      wx.hideLoading();
    })
  },
  // 拒绝
  onRefuse(e) {
    //  send 2
    const id = e.currentTarget.dataset.item;
    const params = {
      id,
      state: 2
    }
    console.log('拒绝',params)
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'setMsg',
        ...params
      }
    })
    .then((res)=>{
      setTimeout(()=>{
        this.getList()
      },1000)
      wx.hideLoading();
    })
  },
  // 签到
  onSign(e) {
    // 3. ： send 签到成功 |  accept未签到
    // 4. ： accept  签到成功  |  send 未签到
    // 5. ： send 签到成功 |  accept签到成功
    const id = e.currentTarget.dataset.item;
    const state= Number(e.currentTarget.dataset.state)
    const params = {
      id,
      state
    }
    console.log('签到',params)
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'setMsg',
        ...params
      }
    })
    .then((res)=>{
      setTimeout(()=>{
        this.getList()
      },1000)
      wx.hideLoading();
    })
  },
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    //展示加载动画
    wx.showNavigationBarLoading()
    this.getList()
    //设置延时停止动画
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    }, 1500);
  },
});