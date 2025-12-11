const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show')
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

const FORM_ENDPOINT = ''
const OWNER_EMAIL = 'callnbarb0@gmail.com'
const PAYMENT_SERVER_URL = 'http://localhost:4242'

const COMPANY_BANK = {
  name: "Call N'Barb",
  number: '0366102965',
  bank: 'Paga',
}

const SERVICE_PRICES_USD = {
  'Signature Cut': 4000,
  'Grooming': 3000,
  'Kids': 2500,
  'Home Visit': 1500,
  'Dreadlock': 8000,
  'Dreadlocks': 8000,
  'Dreadlocks.': 8000,
}

async function sendBooking(data) {
  if (FORM_ENDPOINT && FORM_ENDPOINT.startsWith('https://')) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Request failed')
      return true
    } catch (_) {
      return false
    }
  } else {
    const subject = encodeURIComponent(`New Booking: ${data.service || ''}`)
    const body = encodeURIComponent(
      `Name: ${data.name || ''}\nPhone: ${data.phone || ''}\nService: ${data.service || ''}\nBarber: ${data.barber || ''}\nDate: ${data.date || ''}\nTime: ${data.time || ''}\nLocation: ${data.location || ''}`
    )
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`
    return true
  }
}

function typeText(el, text, speed = 70, delay = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      el.classList.add('typing')
      el.textContent = ''
      let i = 0
      const interval = setInterval(() => {
        el.textContent += text[i] || ''
        i++
        if (i > text.length) {
          clearInterval(interval)
          el.classList.remove('typing')
          resolve()
        }
      }, speed)
    }, delay)
  })
}

;(async () => {
  const titleEl = document.querySelector('.hero-title')
  const subEl = document.querySelector('.hero-sub')
  if (titleEl && subEl) {
    const title = titleEl.getAttribute('data-text') || titleEl.textContent
    const sub = subEl.getAttribute('data-text') || subEl.textContent
    titleEl.textContent = ''
    subEl.textContent = ''
    await typeText(titleEl, title, 90, 250)
    await typeText(subEl, sub, 30, 150)
  }

  const tName = document.getElementById('transferName')
  const tNumber = document.getElementById('transferNumber')
  const tBank = document.getElementById('transferBank')
  if (tName) tName.value = COMPANY_BANK.name
  if (tNumber) tNumber.value = COMPANY_BANK.number
  if (tBank) tBank.value = COMPANY_BANK.bank
})()

const bookingForm = document.getElementById('bookingForm')
const paymentModal = document.getElementById('paymentModal')
const toast = document.getElementById('toast')

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(bookingForm)
    const data = Object.fromEntries(formData.entries())
    const ok = await sendBooking(data)
    if (ok) {
      toast.textContent = 'Booking sent. Continue to payment.'
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 2200)
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push({
      name: data.name,
      phone: data.phone,
      service: data.service,
      barber: data.barber,
      date: data.date,
      time: data.time,
      location: data.location,
      status: 'pending',
      createdAt: Date.now()
    })
    localStorage.setItem('orders', JSON.stringify(orders))
    paymentModal.setAttribute('aria-hidden', 'false')

    const service = data.service
    const cents = SERVICE_PRICES_USD[service] || 4000
    const dollars = (cents / 100).toFixed(2)
    const payService = document.getElementById('payService')
    const payAmount = document.getElementById('payAmount')
    if (payService) payService.value = service
    if (payAmount) payAmount.value = `$${dollars}`

    const acctName = document.getElementById('acctName')
    const acctNumber = document.getElementById('acctNumber')
    const acctBank = document.getElementById('acctBank')
    if (acctName) acctName.value = COMPANY_BANK.name
    if (acctNumber) acctNumber.value = COMPANY_BANK.number
    if (acctBank) acctBank.value = COMPANY_BANK.bank
  })
}

const closeBtn = document.querySelector('.modal-close')
if (closeBtn) closeBtn.addEventListener('click', () => paymentModal.setAttribute('aria-hidden', 'true'))
paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) paymentModal.setAttribute('aria-hidden', 'true')
})

const numberInput = document.querySelector('input[name="card_number"]')
if (numberInput) {
  numberInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    const groups = digits.match(/.{1,4}/g) || []
    e.target.value = groups.join(' ')
  })
}

const expiryInput = document.querySelector('input[name="expiry"]')
if (expiryInput) {
  expiryInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? digits.slice(0,2) + '/' + digits.slice(2) : digits
    e.target.value = formatted
  })
}

const paymentForm = document.getElementById('paymentForm')
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault()
    paymentModal.setAttribute('aria-hidden', 'true')
    toast.textContent = 'Payment successful. Your appointment is confirmed.'
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2600)
  })
}

// Portal logic moved to portal.js on a dedicated page

document.querySelectorAll('.wallet').forEach((btn) => {
  btn.addEventListener('click', () => {
    paymentModal.setAttribute('aria-hidden', 'true')
    toast.textContent = 'Wallet authorized. Appointment scheduled.'
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2600)
  })
})

const transferToggle = document.getElementById('payTransferToggle')
const transferPanel = document.getElementById('transferPanel')
if (transferToggle && transferPanel) {
  transferToggle.addEventListener('click', () => {
    const isHidden = transferPanel.hasAttribute('hidden')
    if (isHidden) transferPanel.removeAttribute('hidden')
    else transferPanel.setAttribute('hidden', '')
  })
}

const copyAcctBtn = document.getElementById('copyAcctBtn')
if (copyAcctBtn) {
  copyAcctBtn.addEventListener('click', async () => {
    const text = `${COMPANY_BANK.name}\n${COMPANY_BANK.bank}\n${COMPANY_BANK.number}`
    try {
      await navigator.clipboard.writeText(text)
      toast.textContent = 'Account details copied'
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 2000)
    } catch (_) {}
  })
}

const copyTransferBtn = document.getElementById('copyTransferBtn')
if (copyTransferBtn) {
  copyTransferBtn.addEventListener('click', async () => {
    const text = `${COMPANY_BANK.name}\n${COMPANY_BANK.bank}\n${COMPANY_BANK.number}`
    try {
      await navigator.clipboard.writeText(text)
      toast.textContent = 'Account details copied'
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 2000)
    } catch (_) {}
  })
}

const payCardBtn = document.getElementById('payCardBtn')
if (payCardBtn) {
  payCardBtn.addEventListener('click', async () => {
    const service = document.getElementById('payService')?.value || 'Service'
    const amountText = document.getElementById('payAmount')?.value || '$40.00'
    const currency = document.getElementById('payCurrency')?.value || 'USD'
    const amount = Math.round(parseFloat(amountText.replace(/[^0-9.]/g, '')) * 100)
    try {
      let data
      if (currency === 'USD') {
        const res = await fetch(PAYMENT_SERVER_URL + '/create-checkout-session', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, service, customer: {} })
        })
        data = await res.json()
      } else {
        const ngnAmount = amount * (await getUsdToNgnRate())
        const kobo = Math.round(ngnAmount)
        const res = await fetch(PAYMENT_SERVER_URL + '/paystack/initialize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: kobo, service, customer: {} })
        })
        data = await res.json()
      }
      if (data.url) window.location.href = data.url
      else {
        toast.textContent = 'Payment server not configured'
        toast.classList.add('show')
        setTimeout(() => toast.classList.remove('show'), 2200)
      }
    } catch (_) {
      toast.textContent = 'Unable to start payment'
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 2200)
    }
  })
}

async function getUsdToNgnRate() {
  try {
    const r = await fetch(PAYMENT_SERVER_URL + '/rates')
    const j = await r.json()
    const rate = j.USD_NGN || 1500
    return rate
  } catch (_) {
    return 1500
  }
}

const payCurrencyEl = document.getElementById('payCurrency')
if (payCurrencyEl) {
  payCurrencyEl.addEventListener('change', async () => {
    const currency = payCurrencyEl.value
    const baseText = document.getElementById('payAmount')?.value || '$40.00'
    const baseUsd = parseFloat(baseText.replace(/[^0-9.]/g, ''))
    if (currency === 'USD') {
      document.getElementById('payAmount').value = `$${baseUsd.toFixed(2)}`
    } else {
      const rate = await getUsdToNgnRate()
      const ngn = Math.round(baseUsd * rate)
      document.getElementById('payAmount').value = `₦${ngn.toLocaleString('en-NG')}`
    }
  })
}
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
