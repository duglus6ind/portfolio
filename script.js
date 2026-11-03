// ── Underwater Opening Screen ──────────────────────────────────
const openingScreen = document.getElementById('opening-screen');

if (openingScreen) {
  document.body.classList.add('intro-active');
  const bubbleContainer = openingScreen.querySelector('.opening-bubbles');
  const rippleContainer = openingScreen.querySelector('.opening-ripples');
  let isOpening = false;
  let lastRippleTime = 0;

  if (bubbleContainer) {
    for (let i = 0; i < 18; i += 1) {
      const bubble = document.createElement('span');
      bubble.className = 'bubble';
      bubble.style.setProperty('--bubble-size', `${8 + Math.random() * 18}px`);
      bubble.style.setProperty('--bubble-left', `${Math.random() * 100}%`);
      bubble.style.setProperty('--bubble-speed', `${7 + Math.random() * 9}s`);
      bubble.style.setProperty('--bubble-delay', `${Math.random() * -12}s`);
      bubbleContainer.appendChild(bubble);
    }
  }

  openingScreen.addEventListener('mousemove', event => {
    if (!prefersReduced) {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      openingScreen.style.setProperty('--pointer-x', `${x * -18}px`);
      openingScreen.style.setProperty('--pointer-y', `${y * -18}px`);

      const now = performance.now();
      if (now - lastRippleTime > 520) {
        lastRippleTime = now;
        createRipple(event);
      }
    }
  });

  openingScreen.addEventListener('mouseleave', () => {
    openingScreen.style.setProperty('--pointer-x', '0px');
    openingScreen.style.setProperty('--pointer-y', '0px');
  });

  const createRipple = event => {
    if (!rippleContainer) return;
    const ripple = document.createElement('span');
    ripple.className = 'water-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    rippleContainer.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const enterPortfolio = event => {
    if (isOpening) return;
    isOpening = true;
    createRipple(event);

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    openingScreen.style.setProperty('--enter-x', `${x}px`);
    openingScreen.style.setProperty('--enter-y', `${y}px`);
    document.body.classList.remove('intro-active');
    openingScreen.classList.add('is-leaving');

    window.setTimeout(() => {
      openingScreen.remove();
    }, 1400);
  };

  openingScreen.addEventListener('pointerdown', createRipple, { passive: true });
  openingScreen.addEventListener('click', enterPortfolio);
  openingScreen.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      enterPortfolio(event);
    }
  });
}

// ── Footer Year ───────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ── Scroll Progress Bar ────────────────────────────────────────
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.prepend(scrollProgress);

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
  document.querySelector('nav')?.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Mobile Navigation ─────────────────────────────────────────
const nav = document.querySelector('nav');
const navList = nav?.querySelector('ul');

if (nav && navList) {
  const menuButton = document.createElement('button');
  menuButton.className = 'menu-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(menuButton, navList);

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    });
  });
}

// ── Rotating Hero Role ────────────────────────────────────────
const roleText = document.getElementById('role-text');
if (roleText && !prefersReduced) {
  const roles = ['Flutter Developer', 'Full-Stack Developer', 'UI/UX Designer'];
  let roleIndex = 0;

  setInterval(() => {
    roleText.classList.add('is-changing');
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.textContent = roles[roleIndex];
      roleText.classList.remove('is-changing');
    }, 180);
  }, 2800);
}

// ── Active Navigation Section Observer ────────────────────────
const navLinks = document.querySelectorAll('nav ul a');
const navSections = [...navLinks].map(a => {
  const href = a.getAttribute('href');
  return href && href.startsWith('#') ? document.querySelector(href) : null;
}).filter(Boolean);

if (navSections.length > 0) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-35% 0px -50% 0px' });

  navSections.forEach(section => navObserver.observe(section));
}

// ── Scroll Reveal Animations ─────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // once revealed, stay revealed
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ── Ambient Cursor Spotlight (Desktop) ────────────────────────
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
  let mouseX = -500;
  let mouseY = -500;
  let currentX = -500;
  let currentY = -500;
  let isMoving = false;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      glow.style.opacity = '1';
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.14;
    currentY += (mouseY - currentY) * 0.14;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderGlow);
  }
  requestAnimationFrame(renderGlow);
}

// ── Interactive Project Card Spotlight ────────────────────────
document.querySelectorAll('.slot').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
});

// ── Back to Top Button ────────────────────────────────────────
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.append(backToTop);

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
});


// ── Service Accordion Behavior ────────────────────────────────
const serviceDetails = document.querySelectorAll('.svc-list details');
serviceDetails.forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    serviceDetails.forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});


// ── Interactive Subtle 3D Card Hover Tilt ────────────────────
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
  const cards = document.querySelectorAll('.slot');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
