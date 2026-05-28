const app = getApp()
const util = require('../../utils/util.js')
const { mockUserInfo, mockMyWinnings } = require('../../utils/mock.js')

Page({
  data: {
    userInfo: null,
    pendingWinCount: 0
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
    this.checkPendingWins()
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || mockUserInfo
    this.setData({ userInfo })
  },

  checkPendingWins() {
    const pendingCount = mockMyWinnings.filter(w => !w.isUsed).length
    this.setData({ pendingWinCount: pendingCount })
  },

  login() {
    util.showLoading('登录中...')
    app.login().then(() => {
      util.hideLoading()
      util.showToast('登录成功', 'success')
      this.loadUserInfo()
    }).catch(err => {
      util.hideLoading()
      util.showToast(err || '登录失败')
    })
  },

  editProfile() {
    wx.showActionSheet({
      itemList: ['修改头像', '修改昵称', '绑定手机号'],
      success: res => {
        switch (res.tapIndex) {
          case 0:
            this.changeAvatar()
            break
          case 1:
            this.changeNickname()
            break
          case 2:
            this.bindPhone()
            break
        }
      }
    })
  },

  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        const avatar = res.tempFiles[0].tempFilePath
        this.setData({
          'userInfo.avatar': avatar
        })
        util.showToast('头像更新成功', 'success')
      }
    })
  },

  changeNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: res => {
        if (res.confirm && res.content) {
          this.setData({
            'userInfo.nickname': res.content
          })
          util.showToast('昵称更新成功', 'success')
        }
      }
    })
  },

  bindPhone() {
    util.showToast('功能开发中')
  },

  goToMyLottery() {
    wx.navigateTo({
      url: '/pages/my-lottery/my-lottery'
    })
  },

  goToMyWinning() {
    wx.navigateTo({
      url: '/pages/my-winning/my-winning'
    })
  },

  goToMyCreated() {
    util.showToast('功能开发中')
  },

  goToAddress() {
    util.showToast('功能开发中')
  },

  goToInvite() {
    wx.showShareMenu({
      withShareTicket: true
    })
    util.showToast('点击右上角分享')
  },

  goToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    })
  },

  goToFeedback() {
    util.showToast('功能开发中')
  },

  goToSetting() {
    util.showToast('功能开发中')
  },

  onShareAppMessage() {
    return {
      title: '我发现了一个超好玩的抽奖小程序，快来一起玩吧！',
      path: '/pages/home/home',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'
    }
  }
})
