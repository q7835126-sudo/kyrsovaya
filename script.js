(function () {
  'use strict';
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const header = document.querySelector('.header');
  function setMenu(open) {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.matches('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 4 ? '0 4px 16px rgba(0, 0, 0, 0.12)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const contact = document.getElementById('contact');
  contact.addEventListener('input', () => {
    const value = contact.value;
    if (/[a-zA-Z@]/.test(value)) return;
    let digits = value.replace(/\D/g, '');
    if (!digits) return;
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);
    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
    contact.value = formatted;
  });
  const form = document.getElementById('order-form');
  const success = form.querySelector('.form__success');
  const policy = form.querySelector('input[name="policy"]');
  const policyError = form.querySelector('.form__error--policy');
  const rules = {
    name: {
      test: (v) => v.trim().length >= 2,
      message: 'Введите имя (минимум 2 символа)'
    },
    contact: {
      test: (v) => {
        const t = v.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
        const isPhone = t.replace(/\D/g, '').length === 11;
        return isEmail || isPhone;
      },
      message: 'Укажите e-mail или телефон'
    }
  };
  function showError(field, message) {
    const errorEl = field.closest('.field').querySelector('.form__error');
    field.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }
  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const valid = rule.test(field.value);
    showError(field, valid ? '' : rule.message);
    return valid;
  }
  function validatePolicy() {
    const valid = policy.checked;
    policy.closest('.checkbox').classList.toggle('is-invalid', !valid);
    policyError.textContent = valid ? '' : 'Нужно согласие на обработку данных';
    return valid;
  }
  form.querySelectorAll('input[name="name"], input[name="contact"]').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });
  policy.addEventListener('change', validatePolicy);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = [
      validateField(form.elements.name),
      validateField(form.elements.contact),
      validatePolicy()
    ];
    if (results.every(Boolean)) {
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Заявка на покупку:', data);
      form.reset();
      success.hidden = false;
      setTimeout(() => (success.hidden = true), 5000);
    } else {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
    }
  });
})();
