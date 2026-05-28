const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    currentStep: 1,
    formData: {
      title: '',
      cover: '',
      type: 'wheel',
      description: '',
      prizes: [],
      joinType: 'public',
      joinLimit: 1,
      maxParticipants: 1000,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      isPublic: true
    },
    lotteryTypes: [
      { name: '大转盘', value: 'wheel', icon: '🎡' },
      { name: '九宫格', value: 'grid', icon: '🔲' },
      { name: '随机滚动', value: 'scroll', icon: '🎲' },
      { name: '一键开奖', value: 'oneclick', icon: '🎯' }
    ],
    joinTypes: [
      { name: '公开参与', value: 'public', icon: '🌐', desc: '所有人可直接参与' },
      { name: '关注公众号', value: 'follow', icon: '📱', desc: '关注公众号后参与' },
      { name: '小红书关注', value: 'xiaohongshu', icon: '📕', desc: '关注小红书账号后参与' }
    ],
    prizeIcons: ['🎁', '📱', '💻', '🎧', '⌚', '👜', '💄', '🎮', '📷', '🎤', '🎵', '🎫']
  },

  onLoad() {
    this.initDefaultPrizes()
  },

  initDefaultPrizes() {
    const defaultPrizes = [
      { id: 1, name: '一等奖', count: 1, probability: 1, icon: '🎁' },
      { id: 2, name: '二等奖', count: 3, probability: 3, icon: '🎁' },
      { id: 3, name: '三等奖', count: 10, probability: 10, icon: '🎁' },
      { id: 4, name: '谢谢参与', count: 9999, probability: 86, icon: '😊' }
    ]
    this.setData({
      'formData.prizes': defaultPrizes
    })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  uploadCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          'formData.cover': tempFilePath
        })
      }
    })
  },

  selectType(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.type': value
    })
  },

  addPrize() {
    const prizes = this.data.formData.prizes
    const newPrize = {
      id: Date.now(),
      name: `奖项${prizes.length + 1}`,
      count: 1,
      probability: 5,
      icon: '🎁'
    }
    prizes.push(newPrize)
    this.setData({
      'formData.prizes': prizes
    })
  },

  deletePrize(e) {
    const index = e.currentTarget.dataset.index
    const prizes = this.data.formData.prizes
    util.showModal('提示', '确定删除该奖品吗？').then(confirm => {
      if (confirm) {
        prizes.splice(index, 1)
        this.setData({
          'formData.prizes': prizes
        })
      }
    })
  },

  onPrizeInput(e) {
    const index = e.currentTarget.dataset.index
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.prizes[${index}].${field}`]: value
    })
  },

  onIconChange(e) {
    const index = e.currentTarget.dataset.index
    const iconIndex = e.detail.value
    this.setData({
      [`formData.prizes[${index}].icon`]: this.data.prizeIcons[iconIndex]
    })
  },

  selectJoinType(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.joinType': value
    })
  },

  changeLimit(e) {
    const field = e.currentTarget.dataset.field
    const type = e.currentTarget.dataset.type
    let value = parseInt(this.data.formData[field]) || 1

    if (type === 'plus') {
      value++
    } else if (type === 'minus' && value > 1) {
      value--
    }

    this.setData({
      [`formData.${field}`]: value
    })
  },

  onDateChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  onTimeChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  setVisibility(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.isPublic': value
    })
  },

  prevStep() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      })
    }
  },

  nextStep() {
    if (this.validateStep()) {
      this.setData({
        currentStep: this.data.currentStep + 1
      })
    }
  },

  validateStep() {
    const { currentStep, formData } = this.data

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        util.showToast('请输入活动标题')
        return false
      }
      if (!formData.cover) {
        util.showToast('请上传活动封面')
        return false
      }
    }

    if (currentStep === 2) {
      if (formData.prizes.length === 0) {
        util.showToast('请至少添加一个奖品')
        return false
      }
      const hasEmpty = formData.prizes.some(p => !p.name.trim())
      if (hasEmpty) {
        util.showToast('请填写完整的奖品信息')
        return false
      }
    }

    if (currentStep === 3) {
      if (!formData.startDate || !formData.startTime) {
        util.showToast('请选择开始时间')
        return false
      }
      if (!formData.endDate || !formData.endTime) {
        util.showToast('请选择结束时间')
        return false
      }
      const startTime = new Date(`${formData.startDate} ${formData.startTime}`).getTime()
      const endTime = new Date(`${formData.endDate} ${formData.endTime}`).getTime()
      if (startTime >= endTime) {
        util.showToast('结束时间必须晚于开始时间')
        return false
      }
    }

    return true
  },

  submitForm() {
    if (!this.validateStep()) {
      return
    }

    const formData = this.data.formData
    const typeMap = {
      wheel: '大转盘',
      grid: '九宫格',
      scroll: '随机滚动',
      oneclick: '一键开奖'
    }
    const newLottery = {
      id: Date.now(),
      title: formData.title,
      cover: formData.cover,
      prizeName: formData.prizes.length > 0 ? formData.prizes[0].name : '神秘大奖',
      participants: 0,
      maxParticipants: formData.maxParticipants,
      endTime: `${formData.endDate} ${formData.endTime}`,
      type: formData.type,
      typeName: typeMap[formData.type] || '大转盘',
      status: 'ongoing',
      isPublic: formData.isPublic,
      joinType: formData.joinType,
      prizes: formData.prizes,
      description: formData.description,
      joinLimit: formData.joinLimit,
      startTime: `${formData.startDate} ${formData.startTime}`
    }

    if (!app.globalData.createdLotteries) {
      app.globalData.createdLotteries = []
    }
    app.globalData.createdLotteries.unshift(newLottery)

    util.showLoading('发布中...')
    
    setTimeout(() => {
      util.hideLoading()
      util.showToast('发布成功', 'success')
      
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/preview/preview?data=${encodeURIComponent(JSON.stringify(formData))}`
        })
      }, 1500)
    }, 1500)
  },

  onShareAppMessage() {
    return {
      title: '创建抽奖活动，快来试试吧！',
      path: '/pages/home/home'
    }
  }
})
