const header = document.querySelector(".site-header");
const mobileFooterNav = document.querySelector(".mobile-footer-nav");
const mobileNavBreakpoint = 1024;
const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-footer-nav a")];
const desktopNavLinks = [...document.querySelectorAll(".desktop-nav a")];
const mobileFooterNavLinks = [...document.querySelectorAll(".mobile-footer-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const magneticTargets = [...document.querySelectorAll(".magnetic")];
const tiltTargets = [...document.querySelectorAll(".project-tilt, [data-hover-lift]")];

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 0.9,
  smoothWheel: true,
  smoothTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ==========================================
// 1. MOBILE FOOTER NAV — uses Lenis scroll
//    event so it works with smooth scrolling.
//    Header is always visible (fixed in CSS).
// ==========================================
let lastScrollY = lenis.scroll;

lenis.on("scroll", ({ scroll, direction }) => {
  if (!mobileFooterNav) return;
  if (window.innerWidth > mobileNavBreakpoint) return;

  // Guard against iOS rubber-band overscroll past the top
  if (scroll <= 0) {
    mobileFooterNav.classList.remove("is-hidden");
    lastScrollY = scroll;
    return;
  }

  // direction: 1 = scrolling down, -1 = scrolling up
  if (direction === 1) {
    mobileFooterNav.classList.add("is-hidden");
  } else if (direction === -1) {
    mobileFooterNav.classList.remove("is-hidden");
  }

  lastScrollY = scroll;
});

// ==========================================
// 2. HEADER SCROLL STATE (visual only —
//    adds .is-scrolled for background tint)
// ==========================================
const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

// Re-show footer nav if user resizes back to desktop
window.addEventListener("resize", () => {
  if (!mobileFooterNav) return;
  if (window.innerWidth > mobileNavBreakpoint) {
    mobileFooterNav.classList.remove("is-hidden");
  }
});

// ==========================================
// 3. NAVIGATION SMOOTH SCROLL
// ==========================================
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    const navOffset = window.innerWidth <= mobileNavBreakpoint ? -10 : -6;

    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, { offset: navOffset });
  });
});

// ==========================================
// 4. MAGNETIC & TILT INTERACTIONS
//    (desktop only)
// ==========================================
const desktopCursorEnabled = window.matchMedia("(min-width: 821px)").matches;

magneticTargets.forEach((target) => {
  target.addEventListener("mousemove", (event) => {
    if (!desktopCursorEnabled) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(target, {
      x: x * 0.12,
      y: y * 0.12,
      duration: 0.18,
      ease: "power2.out",
    });
  });

  target.addEventListener("mouseleave", () => {
    gsap.to(target, { x: 0, y: 0, duration: 0.2, ease: "power2.out" });
  });
});

tiltTargets.forEach((target) => {
  target.addEventListener("mousemove", (event) => {
    if (!desktopCursorEnabled) return;
    const rect = target.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 10;

    gsap.to(target, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.18,
      ease: "power2.out",
    });
  });

  target.addEventListener("mouseleave", () => {
    gsap.to(target, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  });
});

// ==========================================
// 5. GSAP SCROLL ANIMATIONS
// ==========================================

// Active nav link highlighting
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onToggle: ({ isActive }) => {
      if (!isActive) return;
      const id = section.getAttribute("id");
      desktopNavLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
      mobileFooterNavLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    },
  });
});

// Intro
gsap.from(".intro-copy h1 span", {
  yPercent: 110,
  opacity: 0,
  duration: 0.24,
  stagger: 0.06,
  ease: "power2.out",
});

gsap.from(".intro-copy p, .intro-card", {
  y: 28,
  opacity: 0,
  duration: 0.22,
  stagger: 0.05,
  delay: 0.12,
  ease: "power2.out",
});

gsap.to(".intro-card", {
  y: -18,
  scrollTrigger: {
    trigger: ".intro-scene",
    start: "top top",
    end: "bottom top",
    scrub: 0.7,
  },
});

// Journey
gsap.utils.toArray(".journey-step").forEach((step, index) => {
  gsap.from(step, {
    x: index % 2 === 0 ? -32 : 32,
    opacity: 0,
    duration: 0.22,
    ease: "power2.out",
    scrollTrigger: {
      trigger: step,
      start: "top 82%",
    },
  });
});

// Featured project
gsap.from(".featured-project", {
  scale: 0.96,
  opacity: 0,
  duration: 0.24,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".featured-project",
    start: "top 78%",
  },
});

// Project cards
gsap.utils.toArray(".project-card").forEach((card, index) => {
  gsap.from(card, {
    y: 28,
    opacity: 0,
    duration: 0.2,
    delay: index * 0.04,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 86%",
    },
  });
});

// Badge cards
gsap.from(".badge-card", {
  y: 48,
  rotate: (_, target) => (target.classList.contains("badge-two") ? -4 : 4),
  opacity: 0,
  stagger: 0.08,
  duration: 0.24,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".badge-stage",
    start: "top 78%",
  },
});

gsap.to(".badge-one", {
  y: -12,
  scrollTrigger: {
    trigger: ".community-scene",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.8,
  },
});

gsap.to(".badge-three", {
  y: 16,
  scrollTrigger: {
    trigger: ".community-scene",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.8,
  },
});

// Skills
gsap.from(".skill-orb", {
  scale: 0.86,
  opacity: 0,
  stagger: 0.05,
  duration: 0.22,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".skills-orbit",
    start: "top 82%",
  },
});

// Ending
gsap.from(".ending-layout > *", {
  y: 36,
  opacity: 0,
  stagger: 0.08,
  duration: 0.24,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".ending-scene",
    start: "top 82%",
  },
});