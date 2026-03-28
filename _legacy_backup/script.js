// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  rx += (e.clientX - rx) * 0.12;
  ry += (e.clientY - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
});

function animateRing() {
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Scrolled nav and fade elements
const nav = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
const marqueeStrip = document.querySelector('.marquee-strip');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;
  nav.classList.toggle('scrolled', scrollPos > 60);

  if (scrollIndicator) {
    const opacity = Math.max(0, 1 - scrollPos / 100);
    scrollIndicator.style.opacity = opacity;
    scrollIndicator.style.transform = `translateY(${scrollPos * 0.4}px)`;
    scrollIndicator.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
  }

  if (marqueeStrip) {
    const opacity = Math.max(0, 1 - scrollPos / 250);
    marqueeStrip.style.opacity = opacity;
    marqueeStrip.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
  }
});

// Reveal observer
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      // Re-trigger animation when scrolling back
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));

// Form
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
  }, 3000);
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Mobile Nav Toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileNavToggle) {
  mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNavToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const currentTheme = body.classList.contains('light-mode') ? 'light-mode' : '';
  localStorage.setItem('theme', currentTheme);
});
