const util = require('../../utils/util.js')

Page({
  data: {
    wechatId: 'choujiang_kefu',
    phoneNumber: '400-888-8888',
    email: 'kefu@choujiang.com',
    faqList: [
      {
        id: 1,
        question: '如何参与抽奖？',
        answer: '在首页点击感兴趣的抽奖活动，进入详情页后点击"立即参与"按钮，然后点击抽奖按钮即可参与抽奖。部分抽奖活动可能需要关注公众号或完成其他任务后才能参与。',
        open: false
      },
      {
        id: 2,
        question: '中奖后如何兑奖？',
        answer: '中奖后会自动生成兑奖码，请在"我的-我的中奖"中查看。您可以复制兑奖码联系客服进行兑换，部分实物奖品需要填写收货地址后由工作人员安排发货。',
        open: false
      },
      {
        id: 3,
        question: '抽奖次数如何获得？',
        answer: '每位用户每天有3次免费抽奖机会。邀请好友参与可额外获得抽奖次数，每成功邀请一位好友，您和好友各得1次抽奖机会。',
        open: false
      },
      {
        id: 4,
        question: '如何创建自己的抽奖活动？',
        answer: '点击底部"创建"按钮，按照提示填写活动信息、设置奖品、配置规则后即可发布抽奖活动。创建的活动可以设置为公开或私密，私密活动仅通过分享链接访问。',
        open: false
      },
      {
        id: 5,
        question: '抽奖结果公平吗？',
        answer: '我们采用第三方随机数生成算法确保抽奖结果的公平公正性。每个奖项的中奖概率可在活动详情页查看，系统严格按照设定的概率进行抽奖。',
        open: false
      }
    ]
  },

  toggleFaq(e) {
    const index = e.currentTarget.dataset.index
    const key = `faqList[${index}].open`
    this.setData({
      [key]: !this.data.faqList[index].open
    })
  },

  copyWechat() {
    wx.setClipboardData({
      data: this.data.wechatId,
      success: () => {
        util.showToast('微信号已复制', 'success')
      }
    })
  },

  copyPhone() {
    wx.setClipboardData({
      data: this.data.phoneNumber,
      success: () => {
        util.showToast('电话已复制', 'success')
      }
    })
  },

  copyEmail() {
    wx.setClipboardData({
      data: this.data.email,
      success: () => {
        util.showToast('邮箱已复制', 'success')
      }
    })
  }
})
