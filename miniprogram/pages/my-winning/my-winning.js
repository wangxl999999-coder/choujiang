const util = require('../../utils/util.js')
const { mockMyWinnings } = require('../../utils/mock.js')

Page({
  data: {
    activeStatus: 'all',
    winningList: [],
    filteredList: [],
    statusList: [
      { label: '全部', value: 'all', count: 0 },
      { label: '待兑换', value: 'pending', count: 0 },
      { label: '已兑换', value: 'used', count: 0 }
    ]
  },

  onLoad() {
    this.loadWinningList()
  },

  loadWinningList() {
    const list = mockMyWinnings
    const statusList = this.data.statusList.map(item => {
      let count = 0
      if (item.value === 'all') {
        count = list.length
      } else if (item.value === 'pending') {
        count = list.filter(w => !w.isUsed).length
      } else {
        count = list.filter(w => w.isUsed).length
      }
      return { ...item, count }
    })

    this.setData({
      winningList: list,
      statusList
    })
    this.filterList()
  },

  switchStatus(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeStatus: value })
    this.filterList()
  },

  filterList() {
    const { winningList, activeStatus } = this.data
    let filtered = winningList

    if (activeStatus === 'pending') {
      filtered = filtered.filter(item => !item.isUsed)
    } else if (activeStatus === 'used') {
      filtered = filtered.filter(item => item.isUsed)
    }

    this.setData({ filteredList: filtered })
  },

  copyCode(e) {
    const code = e.currentTarget.dataset.code
    wx.setClipboardData({
      data: code,
      success: () => {
        util.showToast('兑奖码已复制', 'success')
      }
    })
  },

  handleAction(e) {
    const item = e.currentTarget.dataset.item
    if (item.isUsed) {
      util.showToast('功能开发中')
    } else {
      wx.showModal({
        title: '兑换奖品',
        content: `确定要兑换「${item.prizeName}」吗？`,
        success: res => {
          if (res.confirm) {
            util.showLoading('兑换中...')
            setTimeout(() => {
              util.hideLoading()
              util.showToast('兑换成功', 'success')
              this.loadWinningList()
            }, 1000)
          }
        }
      })
    }
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})
