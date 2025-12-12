const portalLogin = document.getElementById('portalLogin')
const portalLoginBtn = document.getElementById('portalLoginBtn')
const portalName = document.getElementById('portalName')
const pinGrid = document.getElementById('portalPin')
const DEFAULT_PASSWORD = '123456'

function renderView() {
  const user = JSON.parse(localStorage.getItem('barberUser') || 'null')
  if (user) {
    window.location.href = 'dashboard.html'
  }
}

portalLoginBtn && portalLoginBtn.addEventListener('click', () => {
  const name = (portalName?.value || '').trim()
  if (!name) {
    alert('Please enter your name')
    portalName?.focus()
    return
  }
  const inputs = [...(pinGrid?.querySelectorAll('.pin-input') || [])]
  const digits = inputs.map(i => (i.value || '').trim())
  const pass = digits.join('')
  if (digits.some(d => !d)) {
    const idx = digits.findIndex(d => !d)
    if (idx >= 0) inputs[idx].focus()
    alert('Enter 6-digit PIN')
    return
  }
  if (pass !== DEFAULT_PASSWORD) { alert('Incorrect password'); return }
  localStorage.setItem('barberUser', JSON.stringify({ name }))
  window.location.href = 'dashboard.html'
})


renderView()

;(function setupInputs() {
  if (pinGrid) {
    const inputs = [...pinGrid.querySelectorAll('.pin-input')]
    inputs.forEach((el, idx) => {
      el.addEventListener('input', () => {
        const v = el.value.replace(/\D/g, '')
        el.value = v.slice(0, 1)
        if (el.value && idx < inputs.length - 1) inputs[idx + 1].focus()
      })
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !el.value && idx > 0) inputs[idx - 1].focus()
        if (e.key === 'Enter') portalLoginBtn?.click()
      })
    })
    portalName && portalName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        inputs[0]?.focus()
      }
    })
  }
})()

;(function animateIn() {
  const els = document.querySelectorAll('.reveal')
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 60 + i * 120)
  })
})()
const navToggle = document.getElementById('navToggle')
const siteNav = document.querySelector('.nav')
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
