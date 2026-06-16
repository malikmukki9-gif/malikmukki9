/* =============================================
   Einbeck Clean Service – JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================================
     NAVBAR – scroll behavior
  =========================================== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ===========================================
     MOBILE MENU
  =========================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta-phone, .mobile-cta-wa');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const [s0, s1, s2] = hamburger.querySelectorAll('span');
    if (menuOpen) {
      s0.style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      s1.style.opacity = '0';
      s2.style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      s0.style.transform = s1.style.opacity = s2.style.transform = '';
      s1.style.opacity = '';
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(el => el.addEventListener('click', () => menuOpen && toggleMenu()));

  /* ===========================================
     AOS – Animate on Scroll
  =========================================== */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => e.target.classList.add('aos-animate'), delay);
        aosObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  aosEls.forEach(el => aosObs.observe(el));

  /* ===========================================
     COUNTER ANIMATION
  =========================================== */
  const statNums = document.querySelectorAll('.stat-n');
  let countersDone = false;

  const ease = t => 1 - Math.pow(1 - t, 4);
  const animNum = (el, target, dur = 1600) => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !countersDone) {
        countersDone = true;
        statNums.forEach(el => animNum(el, parseInt(el.dataset.target, 10)));
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);

  /* ===========================================
     SMOOTH SCROLL
  =========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ===========================================
     PARALLAX HERO
  =========================================== */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ===========================================
     SCROLL INDICATOR FADE
  =========================================== */
  const scrollInd = document.getElementById('scroll-ind');
  if (scrollInd) {
    window.addEventListener('scroll', () => {
      scrollInd.style.opacity = window.scrollY > 120 ? '0' : '1';
    }, { passive: true });
  }

  /* ===========================================
     SERVICE CARD TILT
  =========================================== */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.leist-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -3;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 3;
        card.style.transform = `translateY(-5px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }

  /* ===========================================
     HIGHLIGHT ITEMS STAGGER
  =========================================== */
  const hls = document.querySelectorAll('.uu-hl, .kdtl');
  const hlObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateX(0)';
        }, i * 100);
        hlObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  hls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-10px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    hlObs.observe(el);
  });

  /* ===========================================
     CONTACT FORM
  =========================================== */
  const form = document.getElementById('kontakt-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'shake .4s ease';
        return;
      }
      const btnText = submitBtn.querySelector('.btn-text');
      btnText.textContent = 'Wird gesendet…';
      submitBtn.disabled = true;
      setTimeout(() => {
        form.style.cssText = 'opacity:0;transform:translateY(-8px);transition:all .3s ease';
        setTimeout(() => {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
        }, 300);
      }, 1200);
    });
  }

  /* ===========================================
     FLOATING WHATSAPP – fade in after delay
  =========================================== */
  const waFloat = document.getElementById('wa-float-btn');
  if (waFloat) {
    setTimeout(() => waFloat.classList.add('visible'), 1800);
  }

  // Shake keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);

  /* ===========================================
     MODALS – Impressum & Datenschutz
  =========================================== */
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };
  const closeModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      if (!menuOpen) document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el.getAttribute('data-open-modal'));
    });
  });

  document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close') || el.closest('.modal-close')) {
        const modal = el.closest('.modal');
        if (modal) closeModal(modal.id);
      }
    });
  });

});
