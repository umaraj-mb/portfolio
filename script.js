// 1. Scroll Reveal Observer
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 2. Custom Magnetic Cursor Glow & Dot
const glow = document.getElementById('cursorGlow');
const dot = document.getElementById('cursorDot');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX, glowY = mouseY;
let dotX = mouseX, dotY = mouseY;

window.addEventListener('pointermove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  dotX += (mouseX - dotX) * 0.3;
  dotY += (mouseY - dotY) * 0.3;

  if (glow) {
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
  }
  if (dot) {
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// 3. Navbar & Scroll Progress
const navbar = document.getElementById('mainNavbar');
const progress = document.getElementById('scrollProgress');

const updateNavbarAndProgress = () => {
  const scrollY = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }
  
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max ? (scrollY / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  }
  
  // Highlight active nav link
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const navLink = document.querySelector(`.navbar-nav a[href="#${id}"]`);
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
};

window.addEventListener('scroll', updateNavbarAndProgress, { passive: true });
updateNavbarAndProgress();

// Close Bootstrap mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.querySelector('.navbar-collapse');
    if (window.bootstrap && nav) {
      const bsCollapse = bootstrap.Collapse.getInstance(nav);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

// 4. Stat Counter Animation
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounters = () => {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top <= window.innerHeight * 0.75 && !counted) {
    counted = true;
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isFloat = target % 1 !== 0;
      let count = 0;
      const duration = 1500;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          counter.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
          clearInterval(timer);
        } else {
          counter.textContent = isFloat ? count.toFixed(1) : Math.floor(count);
        }
      }, stepTime);
    });
  }
};

window.addEventListener('scroll', startCounters);

// 6. Interactive 3D Tilt Effect on Cards
const tiltElements = document.querySelectorAll('.skill-card, .project-card, .experience-card, .portrait-frame, .hud-card');

tiltElements.forEach(card => {
  card.addEventListener('pointermove', e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// 7. Interactive Three.js Background Canvas
const initThreeCanvas = () => {
  const container = document.getElementById('three-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  camera.position.z = 7.5;

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Wireframe Core Structure
  const coreGeo = new THREE.IcosahedronGeometry(1.4, 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x67ecff,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  mainGroup.add(coreMesh);

  // Outer Torus Energy Ring
  const ringGeo = new THREE.TorusGeometry(2.1, 0.02, 12, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x9d7bff,
    transparent: true,
    opacity: 0.6
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = 1.2;
  mainGroup.add(ringMesh);

  // Outer Secondary Ring
  const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 12, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x67ecff,
    transparent: true,
    opacity: 0.35
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.y = 0.8;
  mainGroup.add(ringMesh2);

  // Interactive Floating Particles & Connected Circuit Nodes
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 16;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x67ecff,
    size: 0.035,
    transparent: true,
    opacity: 0.7
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse Interaction in 3D Space
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('pointermove', (e) => {
    targetRotationY = (e.clientX / window.innerWidth - 0.5) * 0.4;
    targetRotationX = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Core & Ring Groups
    mainGroup.rotation.y += 0.004;
    mainGroup.rotation.x += 0.0015;
    ringMesh.rotation.z += 0.003;
    ringMesh2.rotation.z -= 0.002;

    // Particle Swarm Orbit
    particles.rotation.y = elapsedTime * 0.02;
    particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.1;

    // Smooth Mouse Attraction
    mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
    mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;

    // Floating Sine Wave Bounce
    mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.18;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initThreeCanvas();

  // Contact Form Submission Handler via FormSubmit AJAX
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending Message...`;
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/mbumaraj21@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `New Portfolio Message from ${name}`
          })
        });

        const data = await response.json();

        if (response.ok || data.success === "true" || data.success === true) {
          formAlert.className = 'alert alert-success d-block text-center border-0 bg-success-subtle text-success-emphasis';
          formAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i><strong>Message Sent!</strong> Umaraj has received your email and will get back to you shortly.`;
          contactForm.reset();
        } else {
          throw new Error('Form submission failed.');
        }
      } catch (err) {
        formAlert.className = 'alert alert-danger d-block text-center border-0 bg-danger-subtle text-danger-emphasis';
        formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Something went wrong. Please try emailing directly at <strong>mbumaraj21@gmail.com</strong>`;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="bi bi-send-fill me-2"></i>Send Email Message`;
        }
      }
    });
  }
});
