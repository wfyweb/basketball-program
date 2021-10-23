const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const config = {
  key: 'F5FBZ-A6EKD-GDC44-HNQZ7-QY3SZ-RAFTG', //使用在腾讯位置服务申请的key
  referer: '约球小程序', //调用插件的app的名称
}
module.exports = {
  formatTime,
  config,
}
