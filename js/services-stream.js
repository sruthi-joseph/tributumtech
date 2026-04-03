/**
 * Services Data Stream Canvas
 * Renders flowing matrix-style digital streams in the background
 */

document.addEventListener("DOMContentLoaded", () => {
  const serviceItems = document.querySelectorAll('.service-item');
  const canvas = document.getElementById('data-stream-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Recalculate columns on resize
    columns = Math.floor(width / fontSize);
    
    // Smoothly adjust drops array
    const oldLength = drops.length;
    if (columns > oldLength) {
      for (let i = oldLength; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }
    } else if (columns < oldLength) {
      drops.length = columns;
    }
  }
  window.addEventListener('resize', resize);
  resize();

  // Characters used in data stream loosely resembling data/code
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/'.split('');
  
  const fontSize = 16;
  let columns = Math.floor(canvas.width / fontSize);
  
  // Array holding the 'y' coordinate for each column
  const drops = [];
  for(let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100; // Start offscreen randomly
  }

  // Current active theme colors
  let colorString = '0, 240, 255'; // Cyan default
  let scrollSpeedMod = 1;

  function draw() {
    // Fill with translucent black to create trail effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; /* Reduced from 0.1 for longer trails */
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = `rgb(${colorString})`; 
    ctx.font = fontSize + 'px monospace';
    
    for(let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop mapping linearly with window bounds
        if(drops[i] * fontSize > height && Math.random() > 0.95) {
            drops[i] = 0;
        }
        drops[i] += scrollSpeedMod;
    }
  }

  // Render loop
  function animate() {
    draw();
    // Using setTimeout to throttle framerate slightly to look like retro data stream
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 50);
  }

  animate();

  // GSAP logic to link scroll to stream properties
  gsap.utils.toArray('.service-item').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => activateCard(el),
      onEnterBack: () => activateCard(el),
      onLeave: () => deactivateCard(el),
      onLeaveBack: () => deactivateCard(el)
    });
  });

  function activateCard(el) {
    serviceItems.forEach(item => {
      item.classList.remove('active');
    });

    el.classList.add('active');
    
    const theme = el.getAttribute('data-theme');
    if (theme === 'secondary') {
      colorString = '0, 119, 255'; // Deep Tech Blue for secondary
      scrollSpeedMod = 1.3;
    } else {
      colorString = '0, 240, 255'; // Cyan for primary
      scrollSpeedMod = 1;
    }
  }

  function deactivateCard(el) {
    el.classList.remove('active');
  }

  // Parallax effect for the canvas itself
  gsap.to(canvas, {
    y: -50,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
});
