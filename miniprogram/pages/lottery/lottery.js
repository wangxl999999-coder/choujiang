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
      const app = getApp()
      const createdLotteries = app.globalData.createdLotteries || []
      const allLotteries = [...createdLotteries, ...mockLotteries]
      const lottery = allLotteries.find(item => item.id == id) || allLotteries[0]
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

      if (lottery.type === 'wheel') {
        setTimeout(() => this.drawWheel(), 150)
      }
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

  drawWheel() {
    const query = wx.createSelectorQuery()
    query.select('#wheelCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (!res || !res[0] || !res[0].node) {
          setTimeout(() => this.drawWheel(), 200)
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const sysInfo = wx.getSystemInfoSync()
        const dpr = sysInfo.pixelRatio
        const cssWidth = res[0].width
        const cssHeight = res[0].height

        canvas.width = cssWidth * dpr
        canvas.height = cssHeight * dpr
        ctx.scale(dpr, dpr)

        const centerX = cssWidth / 2
        const centerY = cssHeight / 2
        const radius = Math.max(1, Math.min(centerX, centerY) - 6)

        const prizes = this.data.prizes
        if (!prizes || prizes.length === 0) return

        const count = prizes.length
        const arcAngle = (2 * Math.PI) / count
        const segmentColors = ['#fff0f0', '#ffffff']

        for (let i = 0; i < count; i++) {
          const startAngle = -Math.PI / 2 + i * arcAngle
          const endAngle = startAngle + arcAngle
          const midAngle = startAngle + arcAngle / 2

          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()
          ctx.fillStyle = segmentColors[i % 2]
          ctx.fill()
          ctx.strokeStyle = '#ffd0d0'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()
          ctx.clip()

          ctx.translate(centerX, centerY)
          ctx.rotate(midAngle)

          const iconFontSize = Math.max(13, Math.floor(radius * 0.12))
          ctx.font = `${iconFontSize}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#333'
          ctx.fillText(prizes[i].icon, radius * 0.72, 0)

          const nameFontSize = Math.max(10, Math.floor(radius * 0.08))
          ctx.font = `${nameFontSize}px sans-serif`
          const nameChars = prizes[i].name.split('')
          const maxChars = Math.min(nameChars.length, Math.floor(radius * 0.4 / (nameFontSize * 1.15)))
          const startR = radius * 0.56
          for (let ci = 0; ci < maxChars; ci++) {
            ctx.fillText(nameChars[ci], startR - ci * nameFontSize * 1.15, 0)
          }

          ctx.restore()
        }

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = '#ff6b6b'
        ctx.lineWidth = 3
        ctx.stroke()

        for (let i = 0; i < count; i++) {
          const angle = -Math.PI / 2 + i * arcAngle
          const dotX = centerX + Math.cos(angle) * (radius - 10)
          const dotY = centerY + Math.sin(angle) * (radius - 10)
          ctx.beginPath()
          ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI)
          ctx.fillStyle = '#ff6b6b'
          ctx.fill()
        }
      })
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
