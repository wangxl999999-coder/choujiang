const util = require('../../utils/util.js')

Page({
  data: {
    isWin: true,
    prizeInfo: {
      icon: '🎁',
      name: '一等奖',
      desc: 'iPhone 15 Pro Max'
    },
    prizeCode: '',
    remainChances: 2,
    lotteryId: ''
  },

  onLoad(options) {
    if (options.win !== undefined) {
      this.setData({ isWin: options.win === 'true' })
    }
    if (options.lotteryId) {
      this.setData({ lotteryId: options.lotteryId })
    }
    this.setData({
      prizeCode: 'WIN' + Date.now()
    })
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.prizeCode,
      success: () => {
        util.showToast('兑奖码已复制', 'success')
      }
    })
  },

  shareActivity() {
    wx.showShareMenu({
      withShareTicket: true
    })
    util.showToast('点击右上角分享')
  },

  tryAgain() {
    wx.navigateBack()
  },

  goBack() {
    wx.navigateBack()
  },

  onShareAppMessage() {
    return {
      title: this.data.isWin ? 
        '我在抽奖活动中中奖了！快来试试你的运气吧！' : 
        '发现一个超好玩的抽奖活动，快来一起参与吧！',
      path: `/pages/lottery/lottery?id=${this.data.lotteryId}`,
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'
    }
  }
})
