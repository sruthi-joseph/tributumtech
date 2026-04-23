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
  
  // Remove loading state explicitly to avoid blank page
  document.body.classList.remove('loading');

  // 2. Global Animations Setup
  initGlobalAnimations();

  // 3. Page Specific Animations
  if (document.querySelector('.hero-bg-container')) {
    initHomeAnimations();
  }

  // Back to Top Button Logic
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.2 });
    });
  }

  // 4. Mobile Menu Toggle logic (Moved into scope of lenis)
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const header = document.querySelector('.glass-header');
  
  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      header.classList.toggle('nav-active');
      
      // Manage Lenis Scrolling
      if (header.classList.contains('nav-active')) {
        lenis.stop();
        
        // Staggered animation for menu items
        gsap.fromTo(".main-nav li", 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
        );
      } else {
        lenis.start();
      }
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-active');
        lenis.start();
      });
    });
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
  const revealElements = document.querySelectorAll('.reveal, .reveal-on-scroll');
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

  // Responsive Animation Setup
  let mm = gsap.matchMedia();

  mm.add("(max-width: 1024px)", () => {
    // Mobile & Tablet: strictly vertical movements, no horizontal shifts
    const tlNetwork = gsap.timeline({
      scrollTrigger: {
        trigger: "#about-preview",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tlNetwork.fromTo(".network-reveal-image",
      { y: 50, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    )
    .fromTo(".network-reveal-content > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.8"
    );

    // Parallax on mobile (subtle)
    gsap.to(".network-reveal-image img", {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: "#about-preview",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  mm.add("(min-width: 1025px)", () => {
    // Desktop: Horizontal reveal logic
    const tlNetwork = gsap.timeline({
      scrollTrigger: {
        trigger: "#about-preview",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tlNetwork.fromTo(".network-reveal-image",
      { x: -100, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    )
    .fromTo(".network-reveal-content > *",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.8"
    );

    gsap.to(".network-reveal-image img", {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: "#about-preview",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}


