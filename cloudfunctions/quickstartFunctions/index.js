const getOpenId = require('./getOpenId/index')
const getMiniProgramCode = require('./getMiniProgramCode/index')
const createCollection = require('./createCollection/index')
const selectRecord = require('./selectRecord/index')
const updateRecord = require('./updateRecord/index')
const sumRecord = require('./sumRecord/index')
const addUser = require('./addUser/index')
const selectUser = require('./selectUser/index')
const setUser = require('./setUser/index')
const addMsg = require('./addMsg/index')
const setMsg = require('./setMsg/index')
const selectMsg = require('./selectMsg')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context)
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context)
    case 'createCollection':
      return await createCollection.main(event, context)
    case 'selectRecord':
      return await selectRecord.main(event, context)
    case 'updateRecord':
      return await updateRecord.main(event, context)
    case 'sumRecord':
      return await sumRecord.main(event, context)
    case 'addUser':
      return await addUser.main(event, context)
    case 'selectUser':
      return await selectUser.main(event, context)
    case 'setUser':
      return await setUser.main(event, context)
    case 'addMsg':
      return await addMsg.main(event, context)
    case 'selectMsg':
      return await selectMsg.main(event, context)
    case 'setMsg':
      return await setMsg.main(event, context)
  }
}
