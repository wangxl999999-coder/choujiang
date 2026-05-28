const util = require('../../utils/util.js')
const { mockBanners, mockLotteries } = require('../../utils/mock.js')
const app = getApp()

Page({
  data: {
    banners: [],
    lotteryList: [],
    filteredList: [],
    searchKeyword: '',
    activeType: 'all',
    activeStatus: 'all',
    typeFilters: [
      { label: '全部类型', value: 'all' },
      { label: '大转盘', value: 'wheel' },
      { label: '九宫格', value: 'grid' },
      { label: '随机滚动', value: 'scroll' },
      { label: '一键开奖', value: 'oneclick' }
    ],
    statusFilters: [
      { label: '全部', value: 'all' },
      { label: '进行中', value: 'ongoing' },
      { label: '即将开始', value: 'upcoming' },
      { label: '已结束', value: 'finished' }
    ],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this._loaded = false
    this.loadBanners()
    this.loadLotteryList()
    this.startCountdown()
    this._debounceFilter = util.debounce(() => {
      this.filterList()
    }, 300)
  },

  onShow() {
    if (this._loaded) {
      this.refreshLotteryList()
    }
    this.updateRemainTime()
  },

  onUnload() {
    this.stopCountdown()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    this.loadLotteryList().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },

  loadBanners() {
    this.setData({ banners: mockBanners })
  },

  getAllLotteries() {
    const createdLotteries = app.globalData.createdLotteries || []
    return [...createdLotteries, ...mockLotteries]
  },

  loadLotteryList() {
    this.setData({ loading: true })
    return new Promise(resolve => {
      setTimeout(() => {
        const list = this.getAllLotteries().map(item => ({
          ...item,
          remainTime: util.getRemainTime(item.endTime).text
        }))
        this.setData({ 
          lotteryList: list, 
          loading: false 
        })
        this.filterList()
        this._loaded = true
        resolve()
      }, 500)
    })
  },

  refreshLotteryList() {
    const allLotteries = this.getAllLotteries()
    const currentIds = this.data.lotteryList.map(item => item.id)
    const hasNew = allLotteries.some(item => !currentIds.includes(item.id))

    if (hasNew) {
      const list = allLotteries.map(item => ({
        ...item,
        remainTime: util.getRemainTime(item.endTime).text
      }))
      this.setData({ lotteryList: list })
      this.filterList()
    }
  },

  loadMore() {
    this.setData({ 
      page: this.data.page + 1,
      loading: true 
    })
    setTimeout(() => {
      this.setData({ 
        loading: false,
        hasMore: false
      })
    }, 500)
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this._debounceFilter()
  },

  onSearch() {
    this.filterList()
  },

  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterList()
  },

  onTypeFilter(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeType: value })
    this.filterList()
  },

  onStatusFilter(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ activeStatus: value })
    this.filterList()
  },

  filterList() {
    const { lotteryList, searchKeyword, activeType, activeStatus } = this.data
    let filtered = lotteryList

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.prizeName.toLowerCase().includes(keyword)
      )
    }

    if (activeType !== 'all') {
      filtered = filtered.filter(item => item.type === activeType)
    }

    if (activeStatus !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatus)
    }

    this.setData({ filteredList: filtered })
  },

  startCountdown() {
    this.countdownTimer = setInterval(() => {
      this.updateRemainTime()
    }, 1000)
  },

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  updateRemainTime() {
    const list = this.data.filteredList.map(item => {
      const remain = util.getRemainTime(item.endTime)
      return {
        ...item,
        remainTime: remain.text,
        status: remain.finished ? 'finished' : item.status
      }
    })
    this.setData({ filteredList: list })
  },

  goToLottery(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/lottery/lottery?id=${id}`
    })
  },

  goToMyLottery() {
    wx.navigateTo({
      url: '/pages/my-lottery/my-lottery'
    })
  },

  goToCreate() {
    wx.switchTab({
      url: '/pages/create/create'
    })
  },

  goToMyWinning() {
    wx.navigateTo({
      url: '/pages/my-winning/my-winning'
    })
  },

  goToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    })
  },

  onShareAppMessage() {
    return {
      title: '发现一个超好玩的抽奖小程序，快来参与吧！',
      path: '/pages/home/home'
    }
  }
})
