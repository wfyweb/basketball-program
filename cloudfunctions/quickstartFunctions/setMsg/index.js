const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  console.log('event=>',event);
  try {
    var res = await db.collection('msg_list').where({
      _id: event.id
    })
    .update({
      data: {
        sendState: event.state
      },
    })
    console.log('res',res)
    return {
      success: true,
      data: res,
      msg: '邀请消息更新成功！'
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}