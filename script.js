/* ============================================================
   OWEN EGHAGHE — PORTFOLIO JS
   ============================================================ */

"use strict";

// ===== PARTICLES =====
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W,
    H,
    particles = [];
  const COUNT = 80;
  const COLORS = ["#3b82f6", "#06b6d4", "#6366f1"];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();

// ===== TYPING EFFECT =====
// FIX 1: Typing now starts with an empty string — no pre-rendered "|" artifact on load
(function initTyping() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const phrases = [
    "Azure Cloud Operations Engineer",
    "DevOps Specialist",
    "Kubernetes Administrator",
    "DevSecOps Architect",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Start blank — the CSS cursor handles the blinking pipe
  el.textContent = "";

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 45 : 75;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Small initial delay so page finishes rendering before typing starts
  setTimeout(type, 600);
})();

// ===== NAVBAR SCROLL STATE =====
(function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ===== HAMBURGER MENU =====
(function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove("open");
      btn.classList.remove("open");
    }
  });
})();

// ===== SCROLL REVEAL =====
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll(
            ".reveal:not(.visible)",
          );
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// ===== ACTIVE NAV LINK =====
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ===== CONTACT FORM =====
(function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 0 1-9 9"/>
        <path d="M3 12a9 9 0 0 1 9-9"/>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Message Sent!
      `;
      btn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        btn.style.background = "";
      }, 3000);
    }, 1400);
  });
})();

// ===== PILL HOVER GLOW =====
(function initPillGlow() {
  const pills = document.querySelectorAll(".pill");
  const glows = [
    "rgba(59,130,246,0.4)",
    "rgba(6,182,212,0.4)",
    "rgba(99,102,241,0.4)",
  ];
  pills.forEach((pill) => {
    pill.addEventListener("mouseenter", () => {
      const g = glows[Math.floor(Math.random() * glows.length)];
      pill.style.boxShadow = `0 0 14px ${g}`;
    });
    pill.addEventListener("mouseleave", () => {
      pill.style.boxShadow = "";
    });
  });
})();

// ===== SPIN KEYFRAME =====
(function injectSpinKeyframe() {
  const style = document.createElement("style");
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
})();
