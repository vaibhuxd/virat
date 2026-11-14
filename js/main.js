/* ==========================================================================
   VIRAT & AAKANKSHA — Shared Interactive JavaScript (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions();
  initNavbar();
  initDaysTogetherCounter();
  initScrollReveals();
  initGalleryLightbox();
  initFloatingBackgroundHearts();
  initSurprisePage();
});

/* --------------------------------------------------------------------------
   1. SMOOTH PAGE TRANSITIONS
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        overlay.classList.add('is-hidden');
      }, 60);
    });
  }

  // Handle internal page navigation links smoothly
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      e.preventDefault();
      if (overlay) {
        overlay.classList.remove('is-hidden');
        setTimeout(() => {
          window.location.href = href;
        }, 380);
      } else {
        window.location.href = href;
      }
    });
  });

  // Restore overlay state if navigating via browser Back/Forward cache
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && overlay) {
      overlay.classList.add('is-hidden');
    }
  });
}

/* --------------------------------------------------------------------------
   2. SHARED NAVBAR & MOBILE HAMBURGER MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Scroll state
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 36) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. LIVE "DAYS TOGETHER" COUNTER (From April 16, 2026)
   -------------------------------------------------------------------------- */
function initDaysTogetherCounter() {
  const daysEl = document.getElementById('counter-days');
  const hoursEl = document.getElementById('counter-hours');
  const minutesEl = document.getElementById('counter-minutes');
  const secondsEl = document.getElementById('counter-seconds');

  if (!daysEl || !hoursEl || !minutesEl) return;

  // Start date: April 16, 2026 at midnight local time
  const startDate = new Date(2026, 3, 16, 0, 0, 0);

  function updateCounter() {
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - startDate.getTime());

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = Math.floor((diffMs / 1000) % 60);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

/* --------------------------------------------------------------------------
   4. SCROLL-REVEAL ANIMATIONS (Timeline, Cards, & Love Letter Paragraphs)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .timeline-item');
  const letterParagraphs = document.querySelectorAll('.letter-paragraph, .letter-signature');

  if ('IntersectionObserver' in window) {
    const standardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            standardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => standardObserver.observe(el));

    // Paragraph-by-paragraph reveal on the Love Letter page
    const letterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            letterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -30px 0px' }
    );

    letterParagraphs.forEach((p, idx) => {
      // Reveal the first two paragraphs gently on load if already in viewport
      if (idx < 2) {
        setTimeout(() => {
          p.classList.add('is-revealed');
        }, 350 + idx * 450);
      } else {
        letterObserver.observe(p);
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-visible'));
    letterParagraphs.forEach((p) => p.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   5. GALLERY MASONRY LIGHTBOX & TOUCH SWIPE (gallery.html)
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('gallery-lightbox');
  const badgeToggleBtn = document.getElementById('toggle-slot-badges');
  const masonryGrid = document.querySelector('.masonry-grid');

  if (badgeToggleBtn && masonryGrid) {
    badgeToggleBtn.addEventListener('click', () => {
      const hidden = masonryGrid.classList.toggle('hide-slot-badges');
      badgeToggleBtn.textContent = hidden ? 'Show Slot Numbers' : 'Hide Slot Numbers';
    });
  }

  if (!cards.length || !lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const closeBtn = document.getElementById('lightbox-close');

  let currentIndex = 0;
  let touchStartX = 0;

  function showSlide(index) {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    const img = card.querySelector('img');
    const title = card.getAttribute('data-caption') || `Memory #${currentIndex + 1}`;

    lightboxImg.style.opacity = '0.3';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxCounter.textContent = `Photo ${currentIndex + 1} of ${cards.length}`;
      lightboxImg.style.opacity = '1';
    }, 120);
  }

  function openLightbox(index) {
    showSlide(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showSlide(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showSlide(currentIndex + 1); });
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });

  // Mobile swipe navigation
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        showSlide(currentIndex + 1);
      } else {
        showSlide(currentIndex - 1);
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   6. SUBTLE FLOATING HEARTS BACKGROUND (letter.html)
   -------------------------------------------------------------------------- */
function initFloatingBackgroundHearts() {
  const container = document.getElementById('floating-hearts-bg');
  if (!container) return;

  const symbols = ['♥', '♡', '❦'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'bg-heart';
    span.textContent = symbols[i % symbols.length];
    span.style.left = `${Math.random() * 96}%`;
    span.style.fontSize = `${0.9 + Math.random() * 1.4}rem`;
    span.style.animationDuration = `${12 + Math.random() * 14}s`;
    span.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(span);
  }
}

/* --------------------------------------------------------------------------
   7. SURPRISE PAGE — ONE-BY-ONE LIST REVEAL & CONFETTI HEARTS (surprise.html)
   -------------------------------------------------------------------------- */
function initSurprisePage() {
  const reasonCards = document.querySelectorAll('.reason-card');
  const celebrateBtn = document.getElementById('trigger-hearts-btn');
  const canvas = document.getElementById('confetti-canvas');

  // Reveal "Why I Love You" items one line at a time sequentially
  if (reasonCards.length > 0) {
    reasonCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('is-revealed');
      }, 450 + index * 520);
    });
  }

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const palette = ['#631D32', '#C8A265', '#E57A93', '#F2B8C6', '#D4AF37', '#9E2A47'];

  function createHeartBurst(amount = 65) {
    for (let i = 0; i < amount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 180,
        size: 8 + Math.random() * 11,
        speedY: 1.4 + Math.random() * 2.6,
        speedX: (Math.random() - 0.5) * 1.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: palette[Math.floor(Math.random() * palette.length)],
        opacity: 0.9,
        isHeart: Math.random() > 0.25
      });
    }
    if (!animFrameId) {
      renderParticles();
    }
  }

  function drawHeart(ctx, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.015) * 0.4;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height * 0.78) {
        p.opacity -= 0.015;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.isHeart) {
        drawHeart(ctx, p.size);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });

    particles = particles.filter((p) => p.y < canvas.height + 40 && p.opacity > 0.02);

    if (particles.length > 0) {
      animFrameId = requestAnimationFrame(renderParticles);
    } else {
      animFrameId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Launch romantic hearts & gold confetti on page load
  setTimeout(() => createHeartBurst(75), 350);

  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => createHeartBurst(65));
  }
}
