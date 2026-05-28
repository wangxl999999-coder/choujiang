const mockBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    title: '新年抽奖活动',
    link: ''
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    title: '关注公众号抽大奖',
    link: ''
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
    title: '邀请好友得抽奖机会',
    link: ''
  }
]

const mockLotteries = [
  {
    id: 1,
    title: '2024年会幸运大抽奖',
    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    prizeName: 'iPhone 15 Pro Max',
    participants: 1256,
    maxParticipants: 2000,
    endTime: '2024-12-31 23:59:59',
    type: 'wheel',
    typeName: '大转盘',
    status: 'ongoing',
    isPublic: true,
    joinType: 'public'
  },
  {
    id: 2,
    title: '公众号关注福利',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    prizeName: '戴森吹风机',
    participants: 892,
    maxParticipants: 1000,
    endTime: '2024-12-25 18:00:00',
    type: 'grid',
    typeName: '九宫格',
    status: 'ongoing',
    isPublic: true,
    joinType: 'follow'
  },
  {
    id: 3,
    title: '小红书粉丝专属',
    cover: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400',
    prizeName: 'YSL口红套装',
    participants: 2341,
    maxParticipants: 5000,
    endTime: '2024-12-20 12:00:00',
    type: 'scroll',
    typeName: '随机滚动',
    status: 'ongoing',
    isPublic: true,
    joinType: 'xiaohongshu'
  },
  {
    id: 4,
    title: '年终回馈老用户',
    cover: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
    prizeName: '空气炸锅',
    participants: 567,
    maxParticipants: 1000,
    endTime: '2024-12-15 20:00:00',
    type: 'oneclick',
    typeName: '一键开奖',
    status: 'upcoming',
    isPublic: true,
    joinType: 'public'
  },
  {
    id: 5,
    title: '双十一幸运用户',
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    prizeName: '华为Mate 60',
    participants: 3567,
    maxParticipants: 5000,
    endTime: '2024-11-11 23:59:59',
    type: 'wheel',
    typeName: '大转盘',
    status: 'finished',
    isPublic: true,
    joinType: 'public'
  }
]

const mockPrizes = [
  { id: 1, name: '一等奖', desc: 'iPhone 15 Pro Max', count: 1, probability: 0.01, icon: '📱', color: '#ff6b6b' },
  { id: 2, name: '二等奖', desc: 'AirPods Pro', count: 3, probability: 0.05, icon: '🎧', color: '#ff9f43' },
  { id: 3, name: '三等奖', desc: '小米手环', count: 10, probability: 0.1, icon: '⌚', color: '#54a0ff' },
  { id: 4, name: '参与奖', desc: '优惠券10元', count: 100, probability: 0.3, icon: '🎫', color: '#5f27cd' },
  { id: 5, name: '谢谢参与', desc: '再接再厉', count: 9999, probability: 0.54, icon: '😊', color: '#999' }
]

const mockUserInfo = {
  id: 1,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  nickname: '幸运用户',
  phone: '138****8888',
  lotteryCount: 15,
  winCount: 3,
  inviteCount: 28
}

const mockMyLotteries = [
  {
    id: 1,
    title: '2024年会幸运大抽奖',
    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    prizeName: 'iPhone 15 Pro Max',
    joinTime: '2024-12-01 10:30:00',
    status: 'ongoing',
    isWin: null
  },
  {
    id: 5,
    title: '双十一幸运用户',
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    prizeName: '华为Mate 60',
    joinTime: '2024-11-01 15:20:00',
    status: 'finished',
    isWin: false
  }
]

const mockMyWinnings = [
  {
    id: 1,
    title: '新人专属福利',
    cover: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
    prizeName: '50元话费',
    prizeLevel: '三等奖',
    winTime: '2024-11-15 10:00:00',
    isUsed: false,
    code: 'WIN20241115001'
  },
  {
    id: 2,
    title: '邀请好友奖励',
    cover: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400',
    prizeName: '京东E卡100元',
    prizeLevel: '二等奖',
    winTime: '2024-11-20 14:30:00',
    isUsed: true,
    code: 'WIN20241120002'
  }
]

module.exports = {
  mockBanners,
  mockLotteries,
  mockPrizes,
  mockUserInfo,
  mockMyLotteries,
  mockMyWinnings
}
