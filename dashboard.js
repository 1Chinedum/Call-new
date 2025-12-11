const dashWelcome = document.getElementById('dashWelcome')
const ordersBody = document.getElementById('ordersBody')
const logoutBtn = document.getElementById('portalLogoutBtn')
const navToggle = document.getElementById('navToggle')
const siteNav = document.querySelector('.nav')

function ensureAuth() {
  const user = JSON.parse(localStorage.getItem('barberUser') || 'null')
  if (!user) {
    window.location.href = 'portal.html'
    return null
  }
  return user
}

function renderOrders(user) {
  dashWelcome && (dashWelcome.textContent = `Welcome, ${user.name}`)
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const mine = orders.filter(o => o.barber === user.name)
  if (ordersBody) {
    ordersBody.innerHTML = ''
    mine.forEach(o => {
      const tr = document.createElement('tr')
      const status = o.status || 'pending'
      const badge = status === 'verified' ? '<span class="badge badge-verified">Verified</span>' : '<span class="badge badge-pending">Pending</span>'
      const action = status === 'verified' ? `<a href="#" data-id="${o.createdAt}" class="verify-link" data-action="pending">Mark Pending</a>` : `<a href="#" data-id="${o.createdAt}" class="verify-link" data-action="verified">Mark Verified</a>`
      tr.innerHTML = `<td>${o.name}</td><td>${o.phone}</td><td>${o.service}</td><td>${o.date}</td><td>${o.time}</td><td>${o.location}</td><td>${badge}</td><td>${action}</td>`
      ordersBody.appendChild(tr)
    })
  }
}

const user = ensureAuth()
if (user) renderOrders(user)

logoutBtn && logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('barberUser')
  window.location.href = 'portal.html'
})

window.addEventListener('storage', (e) => {
  if (e.key === 'orders') {
    const u = JSON.parse(localStorage.getItem('barberUser') || 'null')
    if (u) renderOrders(u)
  }
})

ordersBody && ordersBody.addEventListener('click', (e) => {
  const t = e.target
  if (t && t.classList.contains('verify-link')) {
    e.preventDefault()
    const id = t.getAttribute('data-id')
    const action = t.getAttribute('data-action')
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const idx = orders.findIndex(o => String(o.createdAt) === String(id))
    if (idx !== -1) {
      orders[idx].status = action === 'verified' ? 'verified' : 'pending'
      localStorage.setItem('orders', JSON.stringify(orders))
      const u = JSON.parse(localStorage.getItem('barberUser') || 'null')
      if (u) renderOrders(u)
    }
  }
})
navToggle && navToggle.addEventListener('click', () => {
  siteNav && siteNav.classList.toggle('open')
})
document.addEventListener('click', (e) => {
  const t = e.target
  if (!siteNav) return
  if (siteNav.classList.contains('open') && t instanceof Element && !siteNav.contains(t) && t !== navToggle) {
    siteNav.classList.remove('open')
  }
})
