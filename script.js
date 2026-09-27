/* ═══════════════════════════════════════════════════
   UMARAJ MB — PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════════ */

// ── 1. Mobile Nav Toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const siteNav   = document.getElementById('siteNav');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    this.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// ── 2. Navbar Scroll Shadow + Active Link Highlighting ──
const sections   = Array.from(document.querySelectorAll('section[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

function onScroll() {
  const scrollY = window.scrollY;

  if (siteNav) siteNav.classList.toggle('scrolled', scrollY > 30);

  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── 3. Scroll Reveal (Intersection Observer) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.section, .project-card, .edu-card, .achieve-card, .exp-card, .contact-link-card, .hero-text, .hero-portrait'
).forEach(el => revealObserver.observe(el));

// ── 4. Stat Counter Animation ──
const statNumbers = document.querySelectorAll('.stat-number');
let counted = false;

function animateCounters() {
  if (counted) return;
  const about = document.getElementById('about');
  if (!about) return;
  if (about.getBoundingClientRect().top <= window.innerHeight * 0.8) {
    counted = true;
    statNumbers.forEach(el => {
      const target = parseFloat(el.textContent);
      if (isNaN(target)) return;
      const isFloat = target % 1 !== 0;
      const steps = 50;
      const increment = target / steps;
      let count = 0;
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          el.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
          clearInterval(timer);
        } else {
          el.textContent = isFloat ? count.toFixed(1) : Math.floor(count);
        }
      }, 28);
    });
  }
}

window.addEventListener('scroll', animateCounters, { passive: true });
animateCounters();

// ── 5. Subtle Card Tilt on Hover ──
document.querySelectorAll('.project-card, .exp-card, .contact-link-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// ── 6. Contact Form (AJAX via FormSubmit) ──
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('formName')?.value.trim();
    const email   = document.getElementById('formEmail')?.value.trim();
    const message = document.getElementById('formMessage')?.value.trim();

    if (!name || !email || !message) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending\u2026';
    }

    try {
      const res = await fetch('https://formsubmit.co/ajax/mbumaraj21@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: `New Portfolio Message from ${name}` })
      });
      const data = await res.json();

      if (res.ok || data.success === 'true' || data.success === true) {
        showFormMsg(contactForm, 'success', '\u2713 Message sent! Umaraj will get back to you shortly.');
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      showFormMsg(contactForm, 'error', '\u2715 Something went wrong. Email directly: mbumaraj21@gmail.com');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send"></i> SEND MESSAGE';
      }
    }
  });
});

function showFormMsg(form, type, text) {
  form.querySelector('.form-alert')?.remove();
  const div = document.createElement('div');
  div.className = `form-alert form-alert--${type}`;
  div.textContent = text;
  form.prepend(div);
  setTimeout(() => div.remove(), 6000);
}
