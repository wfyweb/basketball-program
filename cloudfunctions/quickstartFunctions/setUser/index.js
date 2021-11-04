const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  console.log('event=>',event);
  try {
    var res = await db.collection('user_list').where({
      opendId: event.opendId
    })
    .update({
      data: {
        latitude: event.latitude,
        longitude: event.longitude, 
        state: event.state
      },
    })
    console.log('res',res)
    return {
      success: true,
      data: res,
      msg: '用户位置更新成功！'
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}