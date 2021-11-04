const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 创建集合云函数入口函数
exports.main = (event, context) => {
  const opendId = event.opendId
  console.log('opendId==>',opendId)
  // 查询该用户
  db.collection('user_list').where({opendId}).get().then((res)=>{
    const userList = res.data
    if (!userList.length) {
      // 新增用户
      db.collection('user_list').add({
        data: {
          opendId: event.opendId,
          nickName: event.nickName,
          avatarUrl: event.avatarUrl
        }
      })
    }
  })
  return {
    success: true,
    code: 200
  }
}