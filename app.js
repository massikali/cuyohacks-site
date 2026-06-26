/* ============================================================
   CUYO HACKS — App.js v2.0
   Modern interactions, animations & UX
   ============================================================ */

(function () {
  'use strict';

  // ──────── Header scroll behavior ────────
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ──────── Mobile menu ────────
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeMenu() {
    navToggle?.classList.remove('active');
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navToggle?.classList.add('active');
    navMenu?.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  navToggle?.addEventListener('click', () => {
    if (navMenu?.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay?.addEventListener('click', closeMenu);

  // Close menu on link click
  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Don't close if it's the submenu trigger
      if (link.parentElement?.classList.contains('nav-submenu')) return;
      closeMenu();
    });
  });

  // ──────── Submenu (desktop hover + mobile click) ────────
  const submenus = document.querySelectorAll('.nav-submenu');
  submenus.forEach(submenu => {
    const trigger = submenu.querySelector(':scope > a');
    let closeTimer = null;

    // Desktop: hover
    submenu.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        clearTimeout(closeTimer);
        submenu.classList.add('open');
      }
    });

    submenu.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        closeTimer = setTimeout(() => submenu.classList.remove('open'), 200);
      }
    });

    // Mobile: click
    trigger?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        submenu.classList.toggle('open');
      }
    });
  });

  // ──────── Smooth scroll for anchors ────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        closeMenu();
      }
    });
  });

  // ──────── Scroll Reveal (Intersection Observer) ────────
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ──────── Process Steps reveal ────────
  const processSteps = document.querySelectorAll('.process-step');

  if (processSteps.length > 0 && 'IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate steps one by one
          const step = entry.target;
          const index = Array.from(processSteps).indexOf(step);
          setTimeout(() => {
            step.classList.add('revealed');
          }, index * 350);
          stepObserver.unobserve(step);
        }
      });
    }, { threshold: 0.3 });

    processSteps.forEach(step => stepObserver.observe(step));
  }

  // ──────── Counter Animation ────────
  function animateCounter(element, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(start + (target - start) * easedProgress);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Observe KPI counters
  const counterElements = document.querySelectorAll('[data-count]');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          if (!isNaN(target)) {
            el.textContent = '0';
            animateCounter(el, target);
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // Stat counters (with + or % suffix)
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          if (!isNaN(target)) {
            const startTime = performance.now();
            const duration = 1500;

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(target * eased);
              el.textContent = prefix + current + suffix;
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = prefix + target + suffix;
            }

            requestAnimationFrame(update);
          }
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => statObserver.observe(el));
  }

  // ──────── Typing Effect ────────
  const typingElement = document.querySelector('[data-typing]');

  if (typingElement) {
    const text = typingElement.dataset.typing;
    const cursor = typingElement.querySelector('.typing-cursor');
    typingElement.textContent = '';
    if (cursor) typingElement.appendChild(cursor);

    let i = 0;
    function type() {
      if (i < text.length) {
        const textNode = document.createTextNode(text.charAt(i));
        if (cursor) {
          typingElement.insertBefore(textNode, cursor);
        } else {
          typingElement.appendChild(textNode);
        }
        i++;
        setTimeout(type, 50 + Math.random() * 40);
      }
    }

    // Start typing after a small delay
    setTimeout(type, 800);
  }

  // ──────── FAQ Accordion ────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
    });
  });

  // ──────── Contact Form ────────
  const contactForm = document.getElementById('contact-form');
  const mailtoBtn = document.getElementById('mailto-send');

  if (contactForm && mailtoBtn) {
    const to = 'directoracomercial@cuyohacks.site';

    // Real-time validation
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    function validateField(input) {
      const value = input.value.trim();
      const isRequired = input.hasAttribute('required');

      if (isRequired && !value) {
        input.style.borderColor = 'var(--danger)';
        input.classList.add('error');
        return false;
      }

      if (input.type === 'email' && value && !isValidEmail(value)) {
        input.style.borderColor = 'var(--danger)';
        input.classList.add('error');
        return false;
      }

      input.style.borderColor = '';
      input.classList.remove('error');
      return true;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    mailtoBtn.addEventListener('click', () => {
      const fd = new FormData(contactForm);
      const nombre = (fd.get('name') || '').trim();
      const email = (fd.get('email') || '').trim();
      const empresa = (fd.get('company') || '').trim();
      const tel = (fd.get('phone') || '').trim();
      const msg = (fd.get('message') || '').trim();

      // Validate all required fields
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(input => {
        if (!validateField(input)) valid = false;
      });

      if (!valid) return;

      const subject = `Nuevo contacto web: ${nombre}${empresa ? ' - ' + empresa : ''}`;
      let body = `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa}\nTeléfono: ${tel}\n\nMensaje:\n${msg}\n\n--\nEnviado desde el formulario del sitio`;

      if (body.length > 1500) body = body.slice(0, 1500) + '\n...[truncado]';

      const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    });
  }

  // ──────── Copyright year ────────
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
