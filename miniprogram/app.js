App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    baseUrl: 'https://api.example.com'
  },

  onLaunch() {
    this.getSystemInfo()
    this.checkLogin()
  },

  getSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res
      }
    })
  },

  checkLogin() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfo()
    }
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: this.globalData.baseUrl + '/api/login',
              method: 'POST',
              data: { code: res.code },
              success: result => {
                if (result.data.code === 200) {
                  wx.setStorageSync('token', result.data.data.token)
                  wx.setStorageSync('userInfo', result.data.data.userInfo)
                  this.globalData.userInfo = result.data.data.userInfo
                  resolve(result.data.data)
                } else {
                  reject(result.data.msg)
                }
              },
              fail: reject
            })
          }
        },
        fail: reject
      })
    })
  },

  request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token')
      wx.request({
        url: this.globalData.baseUrl + url,
        method,
        data,
        header: {
          'Authorization': token ? 'Bearer ' + token : ''
        },
        success: res => {
          if (res.data.code === 200) {
            resolve(res.data.data)
          } else if (res.data.code === 401) {
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            wx.showToast({ title: '请先登录', icon: 'none' })
            setTimeout(() => {
              wx.switchTab({ url: '/pages/home/home' })
            }, 1500)
          } else {
            wx.showToast({ title: res.data.msg || '请求失败', icon: 'none' })
            reject(res.data)
          }
        },
        fail: err => {
          wx.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
    })
  }
})
