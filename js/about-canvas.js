/**
 * Neural Network Canvas Animation for About Us Page
 * Support for multiple canvases across sections
 */
document.addEventListener("DOMContentLoaded", () => {
  const canvases = document.querySelectorAll('.neural-canvas');
  if (canvases.length === 0) return;

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const parentSection = canvas.closest('section');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth > 768 ? 80 : 40;
    
    // Theme colors
    const primaryColor = 'rgba(0, 240, 255, '; // Cyan
    const secondaryColor = 'rgba(255, 158, 0, '; // Amber
    
    function resize() {
      width = canvas.width = parentSection.offsetWidth;
      height = canvas.height = parentSection.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.type = Math.random() > 0.8 ? 'secondary' : 'primary';
        this.gravitate = false; 
      }

      update(scrollProgress) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if(this.gravitate) {
          const dx = (width/2) - this.x;
          const dy = (height/2) - this.y;
          this.vx += dx * 0.0001; 
          this.vy += dy * 0.0001;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'primary' ? primaryColor + '0.8)' : secondaryColor + '0.8)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let scrollProgress = 0;
    ScrollTrigger.create({
      trigger: parentSection,
      start: "top 80%",
      end: "bottom 20%",
      onUpdate: (self) => {
        scrollProgress = self.progress;
        particles.forEach(p => {
          p.gravitate = scrollProgress > 0.2;
        });
      }
    });

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const connectDist = 120 + (scrollProgress * 150);

          if (dist < connectDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            let opacity = (1 - (dist / connectDist)) * 0.25;
            ctx.strokeStyle = p1.type === 'secondary' || p2.type === 'secondary' ? 
                             secondaryColor + opacity + ')' : primaryColor + opacity + ')';
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (isIntersecting) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update(scrollProgress);
          p.draw();
        });
        drawLines();
      }
      requestAnimationFrame(animate);
    }

    let isIntersecting = false;
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    
    observer.observe(canvas);
    animate();
  });

  // Custom Parallax for About page content (Desktop Only)
  if (window.innerWidth > 768) {
    gsap.utils.toArray('.parallax-element').forEach(el => {
      const speed = el.getAttribute('data-speed') || 1;
      gsap.to(el, {
        y: () => (1 - speed) * ScrollTrigger.maxScroll(window),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0
        }
      });
    });
  }

  // Timeline Scroll Animation
  gsap.utils.toArray('.timeline-item').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: window.innerWidth > 768 ? "top 60%" : "top 85%", /* Trigger earlier on mobile to ensure visibility */
      onEnter: () => el.classList.add('active'),
      onLeaveBack: () => el.classList.remove('active')
    });
  });
});
