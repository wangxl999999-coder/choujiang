const util = require('../../utils/util.js')

Page({
  data: {
    formData: {},
    typeName: '',
    joinName: '',
    joinIcon: '',
    joinDesc: ''
  },

  onLoad(options) {
    if (options.data) {
      const formData = JSON.parse(decodeURIComponent(options.data))
      this.setData({ formData })
      this.initDisplayInfo()
    }
  },

  initDisplayInfo() {
    const typeMap = {
      wheel: { name: '大转盘', icon: '🎡' },
      grid: { name: '九宫格', icon: '🔲' },
      scroll: { name: '随机滚动', icon: '🎲' },
      oneclick: { name: '一键开奖', icon: '🎯' }
    }

    const joinMap = {
      public: { name: '公开参与', icon: '🌐', desc: '所有人可直接参与' },
      follow: { name: '关注公众号', icon: '📱', desc: '关注公众号后参与' },
      xiaohongshu: { name: '小红书关注', icon: '📕', desc: '关注小红书账号后参与' }
    }

    const typeInfo = typeMap[this.data.formData.type] || typeMap.wheel
    const joinInfo = joinMap[this.data.formData.joinType] || joinMap.public

    this.setData({
      typeName: typeInfo.name,
      joinName: joinInfo.name,
      joinIcon: joinInfo.icon,
      joinDesc: joinInfo.desc
    })
  },

  goBack() {
    wx.navigateBack()
  },

  confirmPublish() {
    util.showLoading('发布中...')
    setTimeout(() => {
      util.hideLoading()
      wx.showModal({
        title: '发布成功',
        content: '您的抽奖活动已成功发布！\n是否生成分享海报？',
        confirmText: '生成海报',
        cancelText: '稍后再说',
        success: res => {
          if (res.confirm) {
            this.generatePoster()
          } else {
            wx.switchTab({ url: '/pages/home/home' })
          }
        }
      })
    }, 1500)
  },

  generatePoster() {
    util.showToast('海报生成中...', 'loading')
    setTimeout(() => {
      util.showToast('海报已保存', 'success')
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' })
      }, 1500)
    }, 2000)
  },

  onShareAppMessage() {
    return {
      title: this.data.formData.title || '快来参与抽奖吧！',
      path: '/pages/home/home',
      imageUrl: this.data.formData.cover
    }
  }
})
