/**
 * TRIBUTUM TECH - Main JS Core
 * Handles Lenis Smooth Scrolling, Global GSAP animations, and Navigation state
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Global Animations Setup
  initGlobalAnimations();

  // 3. Page Specific Animations
  if (document.querySelector('.hero-bg-container')) {
    initHomeAnimations();
  }
});

function initGlobalAnimations() {
  // Reveal elements on load (Secondary Action + Exaggerated Slow Out)
  gsap.fromTo(".fade-up",
    { y: 60, opacity: 0, scale: 0.95 },   // Anticipation + Scale
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.15, // Overlapping
      ease: "power4.out", // Slow Out
      delay: 0.2
    }
  );

  // Header background on scroll
  const header = document.querySelector('.glass-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: header }
    });
  }

  // Global Scroll Reveal Animations for all pages
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Trigger when element is 85% down the viewport
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Mobile Menu Toggle logic
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      alert("Mobile menu clicked!");
    });
  }
}

function initHomeAnimations() {
  // 1. Hero Zoom & Macro Effect on Scroll 
  const tlHero = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=150%", // Immersive scroll duration
      scrub: 2, // Smooth follow through
      pin: true,
      pinSpacing: false
    }
  });

  // Focus & Scale for Hologram (Main Visual)
  tlHero.to([".hero-bg-img", ".hero-globe-rotator"], {
    scale: 2.5,
    y: 50,
    opacity: 0.1,
    filter: "brightness(1.5)",
    ease: "power2.inOut"
  }, 0)
    // HUD Elements Parallax Zoom (Moving faster for depth)
    .to(".hero-hud-container", {
      scale: 4,
      opacity: 0,
      ease: "power2.in"
    }, 0)
    // Hero text container scales and moves up
    .to(".hero-content", {
      y: -300,
      opacity: 0,
      scale: 1.2,
      filter: "none",
      ease: "power1.in"
    }, 0);

  // 2. Dash Card HD Reveals (Follow Through & Overlapping Action)
  gsap.fromTo(".dash-card",
    { y: 80, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.2, // Stagger reveals
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".dashboard-intro",
        start: "top 80%", // Anticipation: 20% visible trigger
        toggleActions: "play reverse play reverse"
      }
    }
  );

  // 3. Dashboard Intro Number Counting
  const numbers = document.querySelectorAll('.data-value');
  numbers.forEach(num => {
    const targetValue = parseFloat(num.getAttribute('data-value'));
    if (!isNaN(targetValue)) {
      ScrollTrigger.create({
        trigger: ".dashboard-intro",
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(num,
            { innerHTML: 0 },
            {
              innerHTML: targetValue,
              duration: 2.5, // Extending for smooth slow-out
              ease: "power4.out",
              snap: { innerHTML: 0.1 },
              onUpdate: function () {
                num.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
                if (targetValue > 1000) {
                  num.innerHTML = Math.floor(Number(this.targets()[0].innerHTML)).toLocaleString();
                }
              }
            }
          );
        },
        once: true
      });
    }
  });
}
