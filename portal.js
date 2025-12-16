const showLogin = document.getElementById('showLogin')
const showSignup = document.getElementById('showSignup')
const signupForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')
const toggleSignupPass = document.getElementById('toggleSignupPass')
const toggleLoginPass = document.getElementById('toggleLoginPass')

function renderView() {
  const user = JSON.parse(localStorage.getItem('barberUser') || 'null')
  if (user) {
    window.location.href = 'dashboard.html'
  }
}

function getAccounts() {
  return JSON.parse(localStorage.getItem('barberAccounts') || '[]')
}

function setAccounts(list) {
  localStorage.setItem('barberAccounts', JSON.stringify(list))
}

showLogin && showLogin.addEventListener('click', () => {
  signupForm?.setAttribute('hidden', '')
  loginForm?.removeAttribute('hidden')
})

showSignup && showSignup.addEventListener('click', () => {
  loginForm?.setAttribute('hidden', '')
  signupForm?.removeAttribute('hidden')
})

toggleSignupPass && toggleSignupPass.addEventListener('click', () => {
  const input = document.getElementById('password')
  if (!input) return
  input.type = input.type === 'password' ? 'text' : 'password'
})

toggleLoginPass && toggleLoginPass.addEventListener('click', () => {
  const input = document.getElementById('loginPassword')
  if (!input) return
  input.type = input.type === 'password' ? 'text' : 'password'
})

signupForm && signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const first = document.getElementById('firstName')?.value.trim() || ''
  const last = document.getElementById('lastName')?.value.trim() || ''
  const email = document.getElementById('email')?.value.trim().toLowerCase() || ''
  const password = document.getElementById('password')?.value || ''
  const agree = document.getElementById('agree')?.checked
  if (!first || !last || !email || !password || !agree) {
    alert('Please complete all fields and accept the terms')
    return
  }
  const accounts = getAccounts()
  if (accounts.some(a => a.email === email)) { alert('An account with this email already exists'); return }
  accounts.push({ email, password, name: `${first} ${last}` })
  setAccounts(accounts)
  localStorage.setItem('barberUser', JSON.stringify({ name: `${first} ${last}`, email }))
  window.location.href = 'dashboard.html'
})

loginForm && loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = document.getElementById('loginName')?.value.trim() || ''
  const password = document.getElementById('loginPassword')?.value || ''
  if (!name) { alert('Please enter your name'); return }
  if (password !== '123456') { alert('Incorrect password'); return }
  localStorage.setItem('barberUser', JSON.stringify({ name }))
  window.location.href = 'dashboard.html'
})

renderView()

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
