const app = getApp();
const util = require('./util.js');
var server = 'http://192.168.0.5';
// var server = 'http://cjk.klinson.com';
// var server = 'http://111.230.145.229:8083';
//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}
//request请求
function request(method, requestHandler) {
  let params = requestHandler.params;
  let API_URL = server + requestHandler.url;
  wx.showLoading({
    title: '加载中',
  });
  let sessionId = wx.getStorageSync('sessionId');
  console.log(sessionId)
  wx.request({
    url: API_URL,
    data: JSON.stringify(params),
    method: method,
    header: {
      'content-type': 'application/json',
      authorization: sessionId,
    },
    success: function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code === 2) {
        util.showModal('', '用户未登录，或者登录时间过长，请重新进行登录！', () => {
          wx.switchTab({
            url: '/pages/favour/favour',
            success: function () {
              wx.removeStorageSync('sessionId');
              wx.removeStorageSync('userInfo');
            }
          })
        });
      } else {
        requestHandler.success && requestHandler.success(res);
      }
    },
    fail: function (res) {
      console.log(res, 'resfali------');
      requestHandler.fail && requestHandler.fail(res);
    }
  })
}
// 检测数据是否为空
function CHECK(data, name) {
  if (!data) {
    util.showModal('', name + '不能为空');
    return false
  } else {
    return data;
  }
}

module.exports = {
  GET: GET,
  POST: POST,
  CHECK: CHECK,
  server: server
}