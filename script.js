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

  // Add requested photos and logo without replacing the existing page content.
  const imageStyles = document.createElement('style');
  imageStyles.textContent = `
    .site-logo-image { width: 42px; height: 42px; object-fit: cover; border-radius: 9px; vertical-align: middle; margin-right: 10px; }
    .logo-container, .footer-brand { display: flex; align-items: center; gap: 10px; }
    .footer-logo-image { width: 48px; height: 48px; object-fit: cover; border-radius: 10px; }
    .extra-photo { margin: 28px auto 0; max-width: 760px; }
    .extra-photo img { display: block; width: 100%; max-height: 430px; object-fit: cover; border-radius: 16px; box-shadow: 0 12px 32px rgba(20,50,45,.14); }
    .extra-photo figcaption { margin-top: 9px; color: #647981; font-size: 13px; text-align: center; }
    .location-gallery { padding: 64px 0; background: #e9f4f1; }
    .location-gallery .location-heading { max-width: 720px; margin: 0 auto 28px; padding: 0 22px; text-align: center; }
    .location-gallery h2 { margin: 0 0 8px; color: #183c51; font-size: clamp(28px, 4vw, 40px); }
    .location-gallery p { margin: 0; color: #647981; }
    .location-gallery-grid { width: min(1120px, calc(100% - 44px)); margin: auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .location-gallery figure { margin: 0; overflow: hidden; border-radius: 15px; background: #fff; box-shadow: 0 10px 28px rgba(20,50,45,.10); }
    .location-gallery img { display: block; width: 100%; height: 320px; object-fit: cover; }
    .location-gallery figcaption { padding: 12px 16px; color: #263b45; font-size: 13px; font-weight: 600; }
    @media (max-width: 650px) { .location-gallery-grid { grid-template-columns: 1fr; }.location-gallery img { height: 250px; }.extra-photo { margin-top: 20px; } }
  `;
  document.head.appendChild(imageStyles);

  const makeImage = (src, alt, className) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    if (className) image.className = className;
    return image;
  };

  // Use pic 3 as the brand mark in the header and footer.
  const brandLink = document.querySelector('.brand-logo');
  if (brandLink && !brandLink.querySelector('img')) {
    brandLink.prepend(makeImage('pic%203.jpg', 'Telehealth SLP Clinic logo', 'site-logo-image'));
  }
  const footerBrand = document.querySelector('.footer-brand');
  if (footerBrand && !footerBrand.querySelector('.footer-logo-image')) {
    footerBrand.prepend(makeImage('pic%203.jpg', 'Telehealth SLP Clinic logo', 'footer-logo-image'));
  }

  // Add pic 2 immediately below the existing “This is who we are” content.
  const whoSection = document.getElementById('who-we-are');
  const whoContainer = whoSection?.querySelector('.section-container');
  if (whoContainer && !whoContainer.querySelector('[data-extra-photo="who"]')) {
    const figure = document.createElement('figure');
    figure.className = 'extra-photo';
    figure.dataset.extraPhoto = 'who';
    figure.append(makeImage('pic%202.jpg', 'Speech therapy clinic and client photo', ''));
    const caption = document.createElement('figcaption');
    caption.textContent = 'Personal, supportive speech-language care';
    figure.append(caption);
    whoContainer.append(figure);
  }

  // Add the location photo gallery at the bottom of the page, above the footer.
  if (!document.getElementById('location-gallery')) {
    const gallery = document.createElement('section');
    gallery.id = 'location-gallery';
    gallery.className = 'location-gallery';
    gallery.setAttribute('aria-labelledby', 'location-gallery-title');
    gallery.innerHTML = '<div class="location-heading"><h2 id="location-gallery-title">A welcoming place to connect</h2><p>A look at the spaces and surroundings that make our clinic feel warm and inviting.</p></div><div class="location-gallery-grid"></div>';
    const grid = gallery.querySelector('.location-gallery-grid');
    [
      ['pic%204.jpg', 'View of the clinic location', 'Our location'],
      ['pic%205.jpg', 'Another view of the clinic location', 'A welcoming space']
    ].forEach(([src, alt, captionText]) => {
      const figure = document.createElement('figure');
      figure.append(makeImage(src, alt, ''));
      const caption = document.createElement('figcaption');
      caption.textContent = captionText;
      figure.append(caption);
      grid.append(figure);
    });
    const footer = document.querySelector('footer');
    if (footer) footer.before(gallery);
    else document.body.append(gallery);
  }
});

// Voiceflow AI chat widget — kept in place while page images are added.
(function(d, t) {
  var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
  v.onload = function() {
    window.voiceflow.chat.load({
      verify: { projectID: '6af2947b9479d5adb607371d' },
      url: 'https://general-runtime.voiceflow.com',
      voice: { url: 'https://runtime-api.voiceflow.com' },
      environmentID: 'main',
      versionVariant: 'published'
    });
  };
  v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
  v.type = 'text/javascript';
  s.parentNode.insertBefore(v, s);
})(document, 'script');
