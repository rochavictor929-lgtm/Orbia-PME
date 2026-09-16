(function () {
  'use strict';

  /* ======================================================================
     CONFIGURAÇÃO DO LINK DE PAGAMENTO
     Substitua o valor abaixo pelo link real da sua checkout
     (Stripe, Hotmart, PayPal, Kiwify, etc.). Todos os botões com a
     classe ".btn-buy" em toda a página vão usar automaticamente este link.
     ====================================================================== */
  const CHECKOUT_URL = 'https://SEU-LINK-DE-PAGAMENTO-AQUI.com';

  document.querySelectorAll('.btn-buy').forEach(function (btn) {
    btn.setAttribute('href', CHECKOUT_URL);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  /* ======================================================================
     HEADER: sombra ao scroll + menu mobile
     ====================================================================== */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  function onScrollHeader() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  navToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ======================================================================
     STICKY CTA (mobile) — aparece depois da hero
     ====================================================================== */
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('inicio');

  if (stickyCta && heroSection) {
    const stickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyCta.classList.toggle('visible', !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    stickyObserver.observe(heroSection);
  }

  /* ======================================================================
     SCROLL REVEAL (fade-up ao entrar em viewport)
     ====================================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ======================================================================
     FAQ ACCORDION
     ====================================================================== */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ======================================================================
     CARROSSEL DE DEMONSTRAÇÃO
     ====================================================================== */
  const track = document.getElementById('demo-track');
  const slides = track ? Array.from(track.children) : [];
  const tabs = Array.from(document.querySelectorAll('.demo-tab'));
  const dots = Array.from(document.querySelectorAll('.demo-dot'));
  const prevBtn = document.getElementById('demo-prev');
  const nextBtn = document.getElementById('demo-next');

  let currentSlide = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (!track || !slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';

    tabs.forEach(function (tab, i) { tab.classList.toggle('active', i === currentSlide); });
    dots.forEach(function (dot, i) { dot.classList.toggle('active', i === currentSlide); });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 6000);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      goToSlide(parseInt(tab.dataset.slide, 10));
      startAutoplay();
    });
  });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(dot.dataset.slide, 10));
      startAutoplay();
    });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); startAutoplay(); });

  const carousel = document.querySelector('.demo-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  /* Swipe touch para mobile */
  if (track) {
    let touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff < 0 ? currentSlide + 1 : currentSlide - 1);
        startAutoplay();
      }
    }, { passive: true });
  }

  /* ======================================================================
     LIGHTBOX — amplia o slide da demonstração ao clicar
     ====================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(slideEl) {
    if (!lightbox || !lightboxContent) return;
    const screen = slideEl.querySelector('.demo-screen');
    lightboxContent.innerHTML = screen ? screen.outerHTML : '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    stopAutoplay();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    startAutoplay();
  }

  document.querySelectorAll('.demo-body').forEach(function (body) {
    body.addEventListener('click', function () {
      openLightbox(body.closest('.demo-slide'));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ======================================================================
     ANO NO FOOTER
     ====================================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
