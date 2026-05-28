const { mockMyLotteries } = require('../../utils/mock.js')

Page({
  data: {
    activeStatus: 'all',
    lotteryList: [],
    filteredList: [],
    statusList: [
      { label: '全部', value: 'all', count: 0 },
      { label: '进行中', value: 'ongoing', count: 0 },
      { label: '已开奖', value: 'finished', count: 0 }
    ]
  },

  onLoad() {
    this.loadLotteryList()
  },

  loadLotteryList() {
    const list = mockMyLotteries
    const statusList = this.data.statusList.map(item => ({
      ...item,
      count: item.value === 'all' ? list.length : list.filter(l => l.status === item.value).length
    }))

    this.setData({
      lotteryList: list,
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
    const { lotteryList, activeStatus } = this.data
    let filtered = lotteryList

    if (activeStatus !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatus)
    }

    this.setData({ filteredList: filtered })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/lottery/lottery?id=${id}`
    })
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})
