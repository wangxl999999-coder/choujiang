const mockLotteries = [
  { id: 'L001', title: '2024年会幸运大抽奖', type: '大转盘', participants: 1256, winners: 25, startTime: '2024-12-01 00:00', endTime: '2024-12-31 23:59', status: 'ongoing', cover: '🎡' },
  { id: 'L002', title: '公众号关注福利', type: '九宫格', participants: 892, winners: 18, startTime: '2024-12-01 00:00', endTime: '2024-12-25 18:00', status: 'ongoing', cover: '🔲' },
  { id: 'L003', title: '小红书粉丝专属', type: '随机滚动', participants: 2341, winners: 56, startTime: '2024-12-01 00:00', endTime: '2024-12-20 12:00', status: 'finished', cover: '🎲' },
  { id: 'L004', title: '年终回馈老用户', type: '一键开奖', participants: 567, winners: 12, startTime: '2024-12-15 00:00', endTime: '2024-12-20 20:00', status: 'upcoming', cover: '🎯' },
  { id: 'L005', title: '双十一幸运用户', type: '大转盘', participants: 3567, winners: 78, startTime: '2024-11-01 00:00', endTime: '2024-11-11 23:59', status: 'finished', cover: '🎡' }
]

const mockUsers = [
  { id: 'U001', avatar: '👤', nickname: '幸运用户', phone: '138****8888', participations: 15, wins: 3, invites: 28, registerTime: '2024-01-15', status: 'normal' },
  { id: 'U002', avatar: '👤', nickname: '开心每一天', phone: '139****6666', participations: 28, wins: 5, invites: 45, registerTime: '2024-02-20', status: 'normal' },
  { id: 'U003', avatar: '👤', nickname: '追梦人', phone: '137****5555', participations: 8, wins: 1, invites: 12, registerTime: '2024-03-10', status: 'normal' },
  { id: 'U004', avatar: '👤', nickname: '阳光少年', phone: '136****4444', participations: 42, wins: 8, invites: 67, registerTime: '2024-01-25', status: 'normal' },
  { id: 'U005', avatar: '👤', nickname: '小确幸', phone: '135****3333', participations: 19, wins: 2, invites: 23, registerTime: '2024-04-05', status: 'blacklist' }
]

const mockVerifyRecords = [
  { code: 'WIN20241201001', prize: 'iPhone 15 Pro Max', user: '幸运用户 (138****8888)', activity: '2024年会幸运大抽奖', time: '2024-12-01 14:30', operator: '管理员', status: '已核销' },
  { code: 'WIN20241201002', prize: 'AirPods Pro', user: '开心每一天 (139****6666)', activity: '公众号关注福利', time: '2024-12-02 10:15', operator: '管理员', status: '已核销' },
  { code: 'WIN20241201003', prize: '小米手环', user: '追梦人 (137****5555)', activity: '小红书粉丝专属', time: '2024-12-03 16:45', operator: '管理员', status: '已核销' }
]

const mockMessages = [
  { id: 'M001', title: '新活动上线', content: '年终回馈活动已上线，快来参与抽取大奖吧！', target: '全部用户', time: '2024-12-01 09:00', status: '已发送' },
  { id: 'M002', title: '中奖提醒', content: '恭喜您在「公众号关注福利」活动中中奖！', target: '指定用户', time: '2024-12-02 10:00', status: '已发送' },
  { id: 'M003', title: '系统通知', content: '系统将于今晚进行维护，预计持续2小时。', target: '全部用户', time: '2024-12-03 18:00', status: '待发送' }
]

const mockAuditList = [
  { id: 'A001', title: '商家促销活动', creator: '张三 (138****1111)', submitTime: '2024-12-05 10:30', value: '5000元', status: 'pending' },
  { id: 'A002', title: '粉丝福利抽奖', creator: '李四 (139****2222)', submitTime: '2024-12-04 15:20', value: '3000元', status: 'approved' },
  { id: 'A003', title: '年终大抽奖', creator: '王五 (137****3333)', submitTime: '2024-12-03 09:15', value: '10000元', status: 'rejected' }
]

const mockBlacklist = [
  { id: 'B001', phone: '135****3333', reason: '恶意刷奖', time: '2024-11-20 14:30' }
]

let currentPage = 'dashboard'

document.addEventListener('DOMContentLoaded', function() {
  initLogin()
  initNavigation()
  initCharts()
  loadDashboardData()
  loadLotteriesTable()
  loadUsersTable()
  loadVerifyRecords()
  loadMessagesTable()
  loadAuditTable()
  loadBlacklistTable()
  initModal()
  initActions()
})

function initLogin() {
  const loginForm = document.getElementById('loginForm')
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    
    if (username === 'admin' && password === 'admin123') {
      document.getElementById('loginPage').style.display = 'none'
      document.getElementById('adminPage').style.display = 'flex'
    } else {
      alert('用户名或密码错误！')
    }
  })

  document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('loginPage').style.display = 'flex'
    document.getElementById('adminPage').style.display = 'none'
  })
}

function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item')
  const viewAllLinks = document.querySelectorAll('.view-all')

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      const page = this.dataset.page
      switchPage(page)
    })
  })

  viewAllLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault()
      const page = this.dataset.page
      switchPage(page)
    })
  })
}

function switchPage(page) {
  currentPage = page
  
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active')
    if (item.dataset.page === page) {
      item.classList.add('active')
    }
  })

  const pageTitles = {
    dashboard: '数据概览',
    lotteries: '活动管理',
    statistics: '数据统计',
    users: '用户管理',
    verify: '奖品核销',
    messages: '消息推送',
    risk: '风控管理',
    audit: '审核管理',
    posters: '海报模板'
  }
  document.getElementById('pageTitle').textContent = pageTitles[page] || '数据概览'

  document.querySelectorAll('.page-content').forEach(p => {
    p.style.display = 'none'
  })
  document.getElementById(page + 'Page').style.display = 'block'

  if (page === 'statistics') {
    initStatisticsCharts()
  }
}

function initCharts() {
  const trendCtx = document.getElementById('trendChart').getContext('2d')
  new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '参与人次',
        data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })

  const sourceCtx = document.getElementById('sourceChart').getContext('2d')
  new Chart(sourceCtx, {
    type: 'doughnut',
    data: {
      labels: ['小程序搜索', '分享邀请', '公众号', '扫码'],
      datasets: [{
        data: [35, 40, 15, 10],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

function initStatisticsCharts() {
  const trendLineCtx = document.getElementById('trendLineChart').getContext('2d')
  new Chart(trendLineCtx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      datasets: [{
        label: '参与人次',
        data: [5000, 6500, 8000, 7500, 9000, 12000, 11000, 14000, 13500, 16000, 18000, 15420],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: '新增用户',
        data: [800, 1200, 1500, 1300, 1800, 2200, 2000, 2500, 2300, 2800, 3200, 2680],
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  const sourcePieCtx = document.getElementById('sourcePieChart').getContext('2d')
  new Chart(sourcePieCtx, {
    type: 'pie',
    data: {
      labels: ['小程序搜索', '分享邀请', '公众号菜单', '扫码进入', '其他'],
      datasets: [{
        data: [32, 38, 12, 13, 5],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  const typePieCtx = document.getElementById('typePieChart').getContext('2d')
  new Chart(typePieCtx, {
    type: 'pie',
    data: {
      labels: ['大转盘', '九宫格', '随机滚动', '一键开奖'],
      datasets: [{
        data: [45, 25, 18, 12],
        backgroundColor: ['#667eea', '#764ba2', '#43e97b', '#faad14']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

function loadDashboardData() {
  const recentLotteries = document.getElementById('recentLotteries')
  recentLotteries.innerHTML = mockLotteries.slice(0, 5).map(l => `
    <tr>
      <td>${l.title}</td>
      <td><span class="status-tag status-${l.status}">${l.type}</span></td>
      <td>${l.participants}</td>
      <td><span class="status-tag status-${l.status}">${getStatusText(l.status)}</span></td>
    </tr>
  `).join('')

  const recentUsers = document.getElementById('recentUsers')
  recentUsers.innerHTML = mockUsers.slice(0, 5).map(u => `
    <tr>
      <td>${u.avatar} ${u.nickname}</td>
      <td>${u.phone}</td>
      <td>${u.registerTime}</td>
      <td>${u.participations}</td>
    </tr>
  `).join('')
}

function loadLotteriesTable() {
  const tbody = document.getElementById('lotteriesTable')
  tbody.innerHTML = mockLotteries.map(l => `
    <tr>
      <td>${l.id}</td>
      <td><span style="font-size: 24px;">${l.cover}</span></td>
      <td>${l.title}</td>
      <td>${l.type}</td>
      <td>${l.participants}</td>
      <td>${l.winners}</td>
      <td>${l.startTime}</td>
      <td>${l.endTime}</td>
      <td><span class="status-tag status-${l.status}">${getStatusText(l.status)}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewLottery('${l.id}')">查看</button>
          <button class="action-btn edit" onclick="editLottery('${l.id}')">编辑</button>
          <button class="action-btn delete" onclick="deleteLottery('${l.id}')">删除</button>
        </div>
      </td>
    </tr>
  `).join('')
}

function loadUsersTable() {
  const tbody = document.getElementById('usersTable')
  tbody.innerHTML = mockUsers.map(u => `
    <tr>
      <td>${u.id}</td>
      <td><span style="font-size: 20px;">${u.avatar}</span></td>
      <td>${u.nickname}</td>
      <td>${u.phone}</td>
      <td>${u.participations}</td>
      <td>${u.wins}</td>
      <td>${u.invites}</td>
      <td>${u.registerTime}</td>
      <td><span class="status-tag ${u.status === 'blacklist' ? 'status-pending' : 'status-ongoing'}">${u.status === 'blacklist' ? '黑名单' : '正常'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewUser('${u.id}')">详情</button>
          ${u.status !== 'blacklist' ? 
            `<button class="action-btn delete" onclick="addToBlacklist('${u.id}')">拉黑</button>` :
            `<button class="action-btn edit" onclick="removeFromBlacklist('${u.id}')">恢复</button>`
          }
        </div>
      </td>
    </tr>
  `).join('')
}

function loadVerifyRecords() {
  const tbody = document.getElementById('verifyRecords')
  tbody.innerHTML = mockVerifyRecords.map(r => `
    <tr>
      <td><code>${r.code}</code></td>
      <td>${r.prize}</td>
      <td>${r.user}</td>
      <td>${r.activity}</td>
      <td>${r.time}</td>
      <td>${r.operator}</td>
      <td><span class="status-tag status-ongoing">${r.status}</span></td>
    </tr>
  `).join('')
}

function loadMessagesTable() {
  const tbody = document.getElementById('messagesTable')
  tbody.innerHTML = mockMessages.map(m => `
    <tr>
      <td>${m.id}</td>
      <td>${m.title}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.content}</td>
      <td>${m.target}</td>
      <td>${m.time}</td>
      <td><span class="status-tag ${m.status === '已发送' ? 'status-ongoing' : 'status-upcoming'}">${m.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewMessage('${m.id}')">详情</button>
          ${m.status !== '已发送' ? 
            `<button class="action-btn edit" onclick="sendMessage('${m.id}')">发送</button>` : ''
          }
        </div>
      </td>
    </tr>
  `).join('')
}

function loadAuditTable() {
  const tbody = document.getElementById('auditTable')
  tbody.innerHTML = mockAuditList.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.title}</td>
      <td>${a.creator}</td>
      <td>${a.submitTime}</td>
      <td>${a.value}</td>
      <td><span class="status-tag status-${a.status}">${getAuditStatusText(a.status)}</span></td>
      <td>
        ${a.status === 'pending' ? `
          <div class="action-btns">
            <button class="action-btn view" onclick="approveActivity('${a.id}')">通过</button>
            <button class="action-btn delete" onclick="rejectActivity('${a.id}')">拒绝</button>
          </div>
        ` : '-'}
      </td>
    </tr>
  `).join('')
}

function loadBlacklistTable() {
  const tbody = document.getElementById('blacklistTable')
  tbody.innerHTML = mockBlacklist.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.phone}</td>
      <td>${b.reason}</td>
      <td>${b.time}</td>
      <td>
        <button class="action-btn edit" onclick="removeFromBlacklist('${b.id}')">移除</button>
      </td>
    </tr>
  `).join('')
}

function getStatusText(status) {
  const map = { ongoing: '进行中', upcoming: '未开始', finished: '已结束' }
  return map[status] || status
}

function getAuditStatusText(status) {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}

function initModal() {
  const modal = document.getElementById('modal')
  const closeBtn = document.getElementById('modalClose')

  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none'
  })

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  })
}

function showModal(title, content) {
  document.getElementById('modalTitle').textContent = title
  document.getElementById('modalBody').innerHTML = content
  document.getElementById('modal').style.display = 'flex'
}

function initActions() {
  document.getElementById('createLotteryBtn').addEventListener('click', function() {
    showModal('创建活动', `
      <div class="form-group">
        <label>活动名称</label>
        <input type="text" placeholder="请输入活动名称" id="newLotteryTitle">
      </div>
      <div class="form-group">
        <label>抽奖类型</label>
        <select id="newLotteryType">
          <option value="大转盘">大转盘</option>
          <option value="九宫格">九宫格</option>
          <option value="随机滚动">随机滚动</option>
          <option value="一键开奖">一键开奖</option>
        </select>
      </div>
      <div class="form-group">
        <label>开始时间</label>
        <input type="datetime-local" id="newLotteryStart">
      </div>
      <div class="form-group">
        <label>结束时间</label>
        <input type="datetime-local" id="newLotteryEnd">
      </div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="document.getElementById('modal').style.display='none'">取消</button>
        <button class="btn btn-primary" onclick="confirmCreateLottery()">创建</button>
      </div>
    `)
  })

  document.getElementById('verifyBtn').addEventListener('click', function() {
    const code = document.getElementById('verifyCode').value
    if (code) {
      document.getElementById('verifyResult').style.display = 'block'
      document.getElementById('verifyPrize').textContent = 'iPhone 15 Pro Max'
      document.getElementById('verifyUser').textContent = '幸运用户 (138****8888)'
      document.getElementById('verifyActivity').textContent = '2024年会幸运大抽奖'
    } else {
      alert('请输入兑奖码')
    }
  })

  document.getElementById('createMessageBtn').addEventListener('click', function() {
    document.getElementById('messageForm').style.display = 'block'
  })

  document.getElementById('cancelMessage').addEventListener('click', function() {
    document.getElementById('messageForm').style.display = 'none'
  })

  document.getElementById('sendMessage').addEventListener('click', function() {
    const title = document.getElementById('msgTitle').value
    if (title) {
      alert('消息发送成功！')
      document.getElementById('messageForm').style.display = 'none'
    } else {
      alert('请填写推送标题')
    }
  })

  document.getElementById('addBlacklistBtn').addEventListener('click', function() {
    const phone = document.getElementById('blacklistInput').value
    if (phone) {
      mockBlacklist.push({
        id: 'B' + (mockBlacklist.length + 1).toString().padStart(3, '0'),
        phone: phone,
        reason: '手动添加',
        time: new Date().toLocaleString()
      })
      loadBlacklistTable()
      document.getElementById('blacklistInput').value = ''
    }
  })

  document.getElementById('addPosterItem').addEventListener('click', function() {
    alert('海报模板创建功能开发中...')
  })

  document.getElementById('createPosterBtn').addEventListener('click', function() {
    alert('海报模板创建功能开发中...')
  })
}

function viewLottery(id) {
  const lottery = mockLotteries.find(l => l.id === id)
  if (lottery) {
    showModal('活动详情', `
      <p><strong>活动ID：</strong>${lottery.id}</p>
      <p><strong>活动名称：</strong>${lottery.title}</p>
      <p><strong>类型：</strong>${lottery.type}</p>
      <p><strong>参与人数：</strong>${lottery.participants}人</p>
      <p><strong>中奖人数：</strong>${lottery.winners}人</p>
      <p><strong>开始时间：</strong>${lottery.startTime}</p>
      <p><strong>结束时间：</strong>${lottery.endTime}</p>
      <p><strong>状态：</strong>${getStatusText(lottery.status)}</p>
    `)
  }
}

function editLottery(id) {
  alert(`编辑活动 ${id}，功能开发中...`)
}

function deleteLottery(id) {
  if (confirm('确定要删除该活动吗？')) {
    const index = mockLotteries.findIndex(l => l.id === id)
    if (index > -1) {
      mockLotteries.splice(index, 1)
      loadLotteriesTable()
    }
  }
}

function confirmCreateLottery() {
  const title = document.getElementById('newLotteryTitle').value
  const type = document.getElementById('newLotteryType').value
  if (title) {
    mockLotteries.unshift({
      id: 'L' + (mockLotteries.length + 1).toString().padStart(3, '0'),
      title: title,
      type: type,
      participants: 0,
      winners: 0,
      startTime: document.getElementById('newLotteryStart').value || '2024-12-01 00:00',
      endTime: document.getElementById('newLotteryEnd').value || '2024-12-31 23:59',
      status: 'upcoming',
      cover: '🎁'
    })
    loadLotteriesTable()
    document.getElementById('modal').style.display = 'none'
    alert('活动创建成功！')
  } else {
    alert('请输入活动名称')
  }
}

function viewUser(id) {
  const user = mockUsers.find(u => u.id === id)
  if (user) {
    showModal('用户详情', `
      <p><strong>用户ID：</strong>${user.id}</p>
      <p><strong>昵称：</strong>${user.nickname}</p>
      <p><strong>手机号：</strong>${user.phone}</p>
      <p><strong>参与次数：</strong>${user.participations}次</p>
      <p><strong>中奖次数：</strong>${user.wins}次</p>
      <p><strong>邀请人数：</strong>${user.invites}人</p>
      <p><strong>注册时间：</strong>${user.registerTime}</p>
    `)
  }
}

function addToBlacklist(id) {
  if (confirm('确定要将该用户加入黑名单吗？')) {
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      user.status = 'blacklist'
      mockBlacklist.push({
        id: 'B' + (mockBlacklist.length + 1).toString().padStart(3, '0'),
        phone: user.phone,
        reason: '违规操作',
        time: new Date().toLocaleString()
      })
      loadUsersTable()
      loadBlacklistTable()
    }
  }
}

function removeFromBlacklist(id) {
  if (confirm('确定要将该用户移出黑名单吗？')) {
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      user.status = 'normal'
    }
    const blackIndex = mockBlacklist.findIndex(b => b.id === id || b.id.includes(id.slice(1)))
    if (blackIndex > -1) {
      mockBlacklist.splice(blackIndex, 1)
    }
    loadUsersTable()
    loadBlacklistTable()
  }
}

function viewMessage(id) {
  const msg = mockMessages.find(m => m.id === id)
  if (msg) {
    showModal('消息详情', `
      <p><strong>消息ID：</strong>${msg.id}</p>
      <p><strong>标题：</strong>${msg.title}</p>
      <p><strong>内容：</strong>${msg.content}</p>
      <p><strong>推送对象：</strong>${msg.target}</p>
      <p><strong>发送时间：</strong>${msg.time}</p>
      <p><strong>状态：</strong>${msg.status}</p>
    `)
  }
}

function sendMessage(id) {
  if (confirm('确定要发送该消息吗？')) {
    const msg = mockMessages.find(m => m.id === id)
    if (msg) {
      msg.status = '已发送'
      loadMessagesTable()
    }
  }
}

function approveActivity(id) {
  if (confirm('确定要通过该活动审核吗？')) {
    const activity = mockAuditList.find(a => a.id === id)
    if (activity) {
      activity.status = 'approved'
      loadAuditTable()
    }
  }
}

function rejectActivity(id) {
  if (confirm('确定要拒绝该活动审核吗？')) {
    const activity = mockAuditList.find(a => a.id === id)
    if (activity) {
      activity.status = 'rejected'
      loadAuditTable()
    }
  }
}
