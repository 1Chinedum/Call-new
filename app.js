const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show')
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

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
})()

const bookingForm = document.getElementById('bookingForm')
const paymentModal = document.getElementById('paymentModal')
const toast = document.getElementById('toast')

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault()
    paymentModal.setAttribute('aria-hidden', 'false')
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

document.querySelectorAll('.wallet').forEach((btn) => {
  btn.addEventListener('click', () => {
    paymentModal.setAttribute('aria-hidden', 'true')
    toast.textContent = 'Wallet authorized. Appointment scheduled.'
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2600)
  })
})
