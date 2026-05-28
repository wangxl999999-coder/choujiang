const util = require('../../utils/util.js')
const { mockLotteries, mockPrizes } = require('../../utils/mock.js')

Page({
  data: {
    lotteryId: '',
    lotteryInfo: {},
    prizes: [],
    gridPrizes: [],
    scrollPrizes: [],
    remainTime: '',
    typeIcon: '🎡',
    typeName: '大转盘',
    hasJoined: false,
    remainChances: 3,
    isSpinning: false,
    wheelRotation: 0,
    currentGridIndex: -1,
    scrollOffset: 0,
    spinningIcon: '🎁',
    resultPrize: null,
    showResult: false,
    resultCode: '',
    activeInfoTab: 'rule',
    rules: [
      '每人每天有3次免费抽奖机会',
      '邀请好友参与可额外获得1次抽奖机会',
      '中奖后请在7天内联系客服兑奖',
      '活动最终解释权归主办方所有'
    ],
    winners: [
      {
        id: 1,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        nickname: '幸运用户***8888',
        prizeName: '50元话费',
        winTime: '5分钟前'
      },
      {
        id: 2,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
        nickname: '开心***6666',
        prizeName: '小米手环',
        winTime: '15分钟前'
      }
    ]
  },

  onLoad(options) {
    const id = options.id
    this.setData({ lotteryId: id })
    this.loadLotteryInfo(id)
    this.startCountdown()
  },

  onUnload() {
    this.stopCountdown()
  },

  loadLotteryInfo(id) {
    util.showLoading()
    setTimeout(() => {
      util.hideLoading()
      const lottery = mockLotteries.find(item => item.id == id) || mockLotteries[0]
      const prizes = this.preparePrizes(mockPrizes)
      
      this.setData({
        lotteryInfo: lottery,
        prizes: prizes,
        gridPrizes: this.prepareGridPrizes(prizes),
        scrollPrizes: this.prepareScrollPrizes(prizes),
        remainTime: util.getRemainTime(lottery.endTime).text,
        typeIcon: this.getTypeIcon(lottery.type),
        typeName: lottery.typeName
      })
    }, 500)
  },

  preparePrizes(prizes) {
    const count = prizes.length
    const angle = 360 / count
    const colors = ['#fff5f5', '#fff', '#fff5f5', '#fff', '#fff5f5', '#fff', '#fff5f5', '#fff']
    
    return prizes.map((prize, index) => ({
      ...prize,
      angle: index * angle,
      textAngle: index * angle + angle / 2,
      style: `border-top-color: ${colors[index % colors.length]};`
    }))
  },

  prepareGridPrizes(prizes) {
    const gridOrder = [0, 1, 2, 7, -1, 3, 6, 5, 4]
    return gridOrder.map((idx, i) => {
      if (idx === -1) {
        return { id: 'start', name: '开始', icon: '🎯' }
      }
      return prizes[idx] || prizes[0]
    })
  },

  prepareScrollPrizes(prizes) {
    const rows = []
    for (let i = 0; i < 20; i++) {
      const row = [
        prizes[i % prizes.length],
        prizes[(i + 1) % prizes.length],
        prizes[(i + 2) % prizes.length]
      ]
      rows.push(row)
    }
    return rows
  },

  getTypeIcon(type) {
    const icons = {
      wheel: '🎡',
      grid: '🔲',
      scroll: '🎲',
      oneclick: '🎯'
    }
    return icons[type] || '🎁'
  },

  startCountdown() {
    this.countdownTimer = setInterval(() => {
      if (this.data.lotteryInfo.endTime) {
        const remain = util.getRemainTime(this.data.lotteryInfo.endTime)
        this.setData({ remainTime: remain.text })
      }
    }, 1000)
  },

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  switchInfoTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeInfoTab: tab })
  },

  joinLottery() {
    util.showToast('参与成功', 'success')
    this.setData({ hasJoined: true })
  },

  startLottery() {
    if (this.data.isSpinning) return
    
    if (this.data.remainChances <= 0) {
      util.showToast('抽奖次数不足')
      return
    }

    this.setData({ 
      isSpinning: true,
      remainChances: this.data.remainChances - 1
    })

    const result = this.calculateResult()
    const type = this.data.lotteryInfo.type

    switch (type) {
      case 'wheel':
        this.startWheelAnimation(result)
        break
      case 'grid':
        this.startGridAnimation(result)
        break
      case 'scroll':
        this.startScrollAnimation(result)
        break
      case 'oneclick':
        this.startOneClickAnimation(result)
        break
    }
  },

  calculateResult() {
    const random = Math.random() * 100
    let cumulative = 0
    let result = this.data.prizes[this.data.prizes.length - 1]

    for (const prize of this.data.prizes) {
      cumulative += parseFloat(prize.probability)
      if (random <= cumulative) {
        result = prize
        break
      }
    }

    return result
  },

  startWheelAnimation(result) {
    const index = this.data.prizes.findIndex(p => p.id === result.id)
    const anglePerPrize = 360 / this.data.prizes.length
    const targetAngle = 360 * 5 + (360 - index * anglePerPrize - anglePerPrize / 2)
    
    this.setData({
      wheelRotation: this.data.wheelRotation + targetAngle
    })

    setTimeout(() => {
      this.showResult(result)
    }, 4000)
  },

  startGridAnimation(result) {
    const prizeIndex = this.data.prizes.findIndex(p => p.id === result.id)
    const gridMap = [0, 1, 2, 3, -1, 4, 5, 6, 7]
    const targetGridIndex = gridMap.indexOf(prizeIndex)
    
    let currentIndex = 0
    const sequence = [0, 1, 2, 5, 8, 7, 6, 3]
    const totalRounds = 5
    const totalSteps = sequence.length * totalRounds + sequence.indexOf(targetGridIndex) + 1
    
    let step = 0
    let interval = 80

    const animate = () => {
      const sequenceIndex = step % sequence.length
      this.setData({ currentGridIndex: sequence[sequenceIndex] })
      
      step++
      
      if (step >= totalSteps - 8) {
        interval += 30
      }
      
      if (step < totalSteps) {
        setTimeout(animate, interval)
      } else {
        this.setData({ currentGridIndex: targetGridIndex })
        setTimeout(() => {
          this.showResult(result)
        }, 500)
      }
    }

    animate()
  },

  startScrollAnimation(result) {
    const rowHeight = 150
    const targetRow = 15 + this.data.prizes.findIndex(p => p.id === result.id)
    const totalOffset = targetRow * rowHeight

    this.setData({ scrollOffset: 0 })
    
    setTimeout(() => {
      this.setData({ scrollOffset: -totalOffset })
    }, 50)

    setTimeout(() => {
      this.showResult(result)
    }, 3000)
  },

  startOneClickAnimation(result) {
    const icons = this.data.prizes.map(p => p.icon)
    let index = 0
    let rounds = 0

    const animate = () => {
      this.setData({ spinningIcon: icons[index % icons.length] })
      index++
      
      if (index % icons.length === 0) {
        rounds++
      }

      if (rounds < 3) {
        setTimeout(animate, 100)
      } else {
        this.setData({ spinningIcon: result.icon })
        setTimeout(() => {
          this.showResult(result)
        }, 500)
      }
    }

    animate()
  },

  showResult(prize) {
    this.setData({
      isSpinning: false,
      resultPrize: prize,
      resultCode: 'WIN' + Date.now(),
      showResult: true
    })
  },

  closeResult() {
    this.setData({ showResult: false })
  },

  stopPropagation() {},

  inviteFriend() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShareAppMessage() {
    return {
      title: `我正在参与「${this.data.lotteryInfo.title}」，快来一起抽奖吧！`,
      path: `/pages/lottery/lottery?id=${this.data.lotteryId}`,
      imageUrl: this.data.lotteryInfo.cover
    }
  }
})
