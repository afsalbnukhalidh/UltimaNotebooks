'use strict';

// ── Mobile Navigation ──────────────────────────────────────────────
const navToggle  = document.querySelector('[data-nav-toggle]');
const navClose   = document.querySelector('[data-nav-close]');
const mobileNav  = document.querySelector('[data-mobile-nav]');
const overlay    = document.querySelector('[data-overlay]');

const openNav = () => {
  mobileNav.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeNav = () => {
  mobileNav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

navToggle?.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
overlay?.addEventListener('click', closeNav);

mobileNav?.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

// ── Header & Back-to-Top ───────────────────────────────────────────
const header     = document.querySelector('[data-header]');
const backTopBtn = document.querySelector('[data-back-top-btn]');

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar-link');

const highlightNav = (scrollY) => {
  const offset = scrollY + 130;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.id;
    if (offset >= top && offset < top + height) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 80);
  backTopBtn?.classList.toggle('active', y > 400);
  highlightNav(y);
};

// rAF-throttled scroll listener
let rafPending = false;
window.addEventListener('scroll', () => {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      onScroll();
      rafPending = false;
    });
  }
}, { passive: true });

backTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth Scroll for Anchor Links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = header?.offsetHeight ?? 76;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

// ── Scroll Reveal ──────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger cards that share a parent grid
    const siblings = Array.from(
      entry.target.parentElement?.querySelectorAll('[data-reveal]') ?? []
    );
    const idx   = siblings.indexOf(entry.target);
    const delay = idx >= 0 ? idx * 90 : 0;

    setTimeout(() => {
      entry.target.classList.add('revealed');
    }, delay);

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.10,
  rootMargin: '0px 0px -56px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// ── Init ───────────────────────────────────────────────────────────
onScroll();
