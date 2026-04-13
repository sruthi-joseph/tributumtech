/**
 * Neural Network Canvas Animation for About Us Page
 */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth > 768 ? 100 : 50;
  
  // Theme colors
  const primaryColor = 'rgba(0, 240, 255, '; // Cyan
  const secondaryColor = 'rgba(255, 158, 0, '; // Amber
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.about-hero').offsetHeight + 200;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.type = Math.random() > 0.8 ? 'secondary' : 'primary';
      this.homeX = this.x;
      this.homeY = this.y;
      this.gravitate = false; 
    }

    update(scrollOffset) {
      // Base movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Gravitate behavior triggered via scroll
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

  // Bind properties to scroll progress
  let scrollProgress = 0;
  ScrollTrigger.create({
    trigger: ".about-hero",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      scrollProgress = self.progress;
      // When scrolling down, particles gravitate towards a central node
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

        // Connection distance gets larger as we scroll (nodes connect more)
        const connectDist = 150 + (scrollProgress * 200);

        if (dist < connectDist) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          let opacity = 1 - (dist / connectDist);
          // Darken connections slightly
          opacity *= 0.3;
          
          if(p1.type === 'secondary' || p2.type === 'secondary') {
            ctx.strokeStyle = secondaryColor + opacity + ')';
          } else {
            ctx.strokeStyle = primaryColor + opacity + ')';
          }
          
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update(scrollProgress);
      p.draw();
    });
    
    drawLines();
    requestAnimationFrame(animate);
  }

  animate();

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
      start: "top 60%",
      onEnter: () => el.classList.add('active'),
      onLeaveBack: () => el.classList.remove('active')
    });
  });
});
