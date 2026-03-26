/**
 * Contact Page Leaflet Map Integration
 * Uses a free dark-themed tile layer (CartoDB Dark Matter)
 */

document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Initialize map centered roughly on San Francisco (HQ)
  const map = L.map('map', {
    zoomControl: false, // We'll add it in a custom pos if needed, or leave it minimal
    scrollWheelZoom: false // Prevent scrolling hijacking the page
  }).setView([8.6781387, 76.9095717], 14);

  // Standard Detailed Road Map (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // 4. Interaction: Click to open Google Maps
  mapElement.style.cursor = 'pointer';
  map.on('click', () => {
    window.open("https://maps.app.goo.gl/SBQ9zWAMUdTjEKWQA?g_st=aw", "_blank");
  });

  // Custom Futuristic Marker
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="width: 20px; height: 20px; background: rgba(0, 240, 255, 0.2); border: 2px solid #00F0FF; border-radius: 50%; box-shadow: 0 0 15px rgba(0, 240, 255, 0.8); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: #00F0FF; border-radius: 50%;"></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  L.marker([8.6781387, 76.9095717], { icon: customIcon }).addTo(map)
    .bindPopup(`<div style="font-family: 'Space Grotesk', sans-serif; background: #0a0a0c; color: #fff; padding: 5px; border: 1px solid #00F0FF; border-radius: 4px;">TRIBUTUM TECH | South Node</div>`, {
      closeButton: false,
      className: 'custom-popup'
    });

  // GSAP Animation to reveal map
  gsap.from(mapElement, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    delay: 0.5
  });
});
