'use strict';

// ── Mobile Navigation ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

function openMobileNav() {
  mobileNav.classList.add('open');
  mobileNavOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

// ── Header Scroll ──────────────────────────────────────────────────
const header = document.getElementById('site-header');
const backToTop = document.getElementById('back-to-top');

function onScroll() {
  const scrollY = window.scrollY;

  if (header) {
    header.classList.toggle('scrolled', scrollY > 80);
  }

  if (backToTop) {
    backToTop.classList.toggle('visible', scrollY > 300);
  }

  updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Active Nav on Scroll ───────────────────────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 140) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ── Smooth Scroll ──────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerHeight = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Back to Top ────────────────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Intersection Observer — Scroll Reveal ─────────────────────────
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ── Count-Up Animation ─────────────────────────────────────────────
function countUp(el, target, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const brandStrip = document.querySelector('.brand-strip');
if (brandStrip) {
  let counted = false;
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        brandStrip.querySelectorAll('.stat-number[data-target]').forEach(el => {
          countUp(el, parseInt(el.dataset.target, 10), 1400);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statObserver.observe(brandStrip);
}

// ── Hero Video Parallax ────────────────────────────────────────────
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroVideo.style.transform = `scale(1.12) translateY(${scrolled * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Testimonial Slider
(function() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(next, 5000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopTimer();
      goTo(i);
      startTimer();
    });
  });

  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
  }

  startTimer();
})();
