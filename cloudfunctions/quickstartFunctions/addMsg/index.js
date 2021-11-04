const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 创建集合云函数入口函数
exports.main = (event, context) => {
  const {
    title, date, time, location,sendId,acceptId,sendState
  } = event
  // 新增约球消息
  db.collection('msg_list').add({
    data: {
      title, date, time,sendId,acceptId,sendState,
      location: location.name,
      latitude: location.latitude,
      longitude: location.longitude
    }
  })
  return {
    success: true,
    code: 200
  }
}