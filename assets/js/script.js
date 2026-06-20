/**
 * ULTIMA NOTEBOOKS - Professional JavaScript
 * Modern, clean, performant
 */

'use strict';

/**
 * Mobile Navigation Toggle
 */
const navOpenBtn = document.querySelector('.nav-open-btn');
const navCloseBtn = document.querySelector('.nav-close-btn');
const mobileNavbar = document.querySelector('.mobile-navbar');
const overlay = document.querySelector('.overlay');
const navLinks = document.querySelectorAll('.mobile-navbar .navbar-link');

const toggleNav = () => {
  mobileNavbar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = mobileNavbar.classList.contains('active') ? 'hidden' : '';
};

if (navOpenBtn) navOpenBtn.addEventListener('click', toggleNav);
if (navCloseBtn) navCloseBtn.addEventListener('click', toggleNav);
if (overlay) overlay.addEventListener('click', toggleNav);

// Close mobile nav when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileNavbar.classList.contains('active')) {
      toggleNav();
    }
  });
});

/**
 * Header Scroll Effect
 */
const header = document.querySelector('[data-header]');

const headerScroll = () => {
  if (window.scrollY > 100) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', headerScroll);

/**
 * Back to Top Button
 */
const backTopBtn = document.querySelector('[data-back-top-btn]');

const backTopScroll = () => {
  if (window.scrollY > 300) {
    backTopBtn?.classList.add('active');
  } else {
    backTopBtn?.classList.remove('active');
  }
};

window.addEventListener('scroll', backTopScroll);

backTopBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Smooth Scroll for Navigation Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip empty hashes or back-top button
    if (href === '#' || href === '#top') {
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = header?.offsetHeight || 72;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Intersection Observer for Scroll Animations
 */
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('[data-section]').forEach(section => {
  section.style.opacity = '0';
  fadeInObserver.observe(section);
});

/**
 * Lazy Loading for Images
 */
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
}, { rootMargin: '50px' });

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  imageObserver.observe(img);
});

/**
 * Active Navigation Link Highlight
 */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.navbar-link');

const highlightNav = () => {
  const scrollPosition = window.scrollY + 200;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', highlightNav);

/**
 * Performance: Debounce scroll events
 */
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
  headerScroll();
  backTopScroll();
  highlightNav();
}, 10);

window.addEventListener('scroll', debouncedScroll);

/**
 * Initialize on DOM Content Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Set initial states
  headerScroll();
  backTopScroll();
  highlightNav();
  
  // Add loaded class to body
  document.body.classList.add('loaded');
  
  console.log('Ultima Notebooks - Professional Website Loaded ✓');
});

/**
 * Handle external links
 */
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.href.includes(window.location.hostname)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Print styles trigger
 */
window.addEventListener('beforeprint', () => {
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});
