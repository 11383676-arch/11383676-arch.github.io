document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('hamburgerMenu');
  const nav = document.getElementById('navLinks');
  const themeButton = document.getElementById('themeToggle');
  const modal = document.getElementById('bookingModal');
  const form = document.getElementById('bookingForm');
  let focusBeforeModal = null;

  // Mobile navigation menu
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('active');
    const bars = menuButton.querySelectorAll('.bar');
    bars.forEach((bar) => { bar.style.transform = ''; bar.style.opacity = ''; });
    menuButton.setAttribute('aria-expanded', 'false');
  };
  if (menuButton && nav) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', String(open));
      const bars = menuButton.querySelectorAll('.bar');
      if (bars.length === 3) {
        bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
        bars[1].style.opacity = open ? '0' : '';
        bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      }
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
  }

  // Dark/light theme with safe storage fallback
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeButton) themeButton.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  };
  let theme = 'light';
  try { theme = localStorage.getItem('theme') || 'light'; } catch (_) { /* Browser storage can be disabled. */ }
  applyTheme(theme === 'dark' ? 'dark' : 'light');
  themeButton?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (_) { /* Theme still applies for this visit. */ }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Consultation modal
  const openModal = () => {
    if (!modal) return;
    focusBeforeModal = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.getElementById('clientName')?.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    focusBeforeModal?.focus?.();
  };
  document.querySelectorAll('.btn-trigger-modal').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  }));
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    window.alert('Thanks for your interest! This is a school project demo; the form does not send or store information.');
    form.reset();
    closeModal();
  });
});
