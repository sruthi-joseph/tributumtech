// Service List Logic
document.addEventListener("DOMContentLoaded", () => {
    const serviceItems = document.querySelectorAll('.service-item');

    const serviceData = {
    "01": ["Data Annotation & Labeling", "Cloud-based Platforms", "Data Collection", "Data Digitalisation", "Data Cleaning", "Multilingual Transcription", "Translation & Localization", "Dataset Creation", "GIS Annotation"],
    "02": ["Computer Vision", "NLP", "Conversational AI", "Speech AI", "Predictive Analytics", "Generative AI", "Edge AI"],
    "03": ["AI-powered Robotics", "Humanoid Robot Development", "Motion Capture", "Robot Training Data", "Autonomous Navigation", "Sensor Fusion", "Industrial Robotics", "Human-Robot Interaction", "Simulation & Testing"],
    "04": ["Cloud Deployment", "Data Pipelines", "MLOps", "Real-time Streaming", "API Development"],
    "05": ["Web & SaaS Platforms", "Mobile & Desktop apps", "AI Dashboards", "Automation Tools"],
    "06": ["Embedded Systems", "IoT Integration", "Real-time Control"],
    "07": ["CAN / LIN / Ethernet", "Diagnostics", "Loggers", "EOL Testing"],
    "08": ["PID Controllers", "Motor Control", "Servo Systems", "Energy Monitoring", "Wireless Automation"],
    "09": ["Tablet Control Apps", "Touch Displays", "UI Systems", "Figma to Production"],
    "10": ["Remote Diagnostics", "Fleet Monitoring", "Predictive Maintenance"],
    "11": ["Rapid Prototyping", "Simulation", "Custom Demos"],
    "12": ["Document AI", "Video Intelligence", "RGB LED Systems", "Custom R&D"],
    "13": [
        "Design and development of tailored algorithms for specific business and AI use cases",
        "Optimization algorithms for performance, efficiency, and scalability",
        "Computer Vision and NLP model customization for domain-specific applications",
        "Motion and behavior modeling algorithms for robotics and humanoid systems",
        "Path planning and decision-making algorithms for autonomous systems",
        "Data processing and feature engineering algorithms",
        "Real-time algorithm development for edge and embedded systems",
        "AI model fine-tuning and custom training pipelines",
        "Simulation-based algorithm testing and validation",
        "Algorithm integration with hardware, sensors, and cloud systems"
    ]
    };

    serviceItems.forEach((item) => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.service-title').textContent;
        const theme = item.getAttribute('data-theme');
        const serviceId = item.getAttribute('data-service');

        const items = serviceData[serviceId] || [];
        const itemsHTML = items.map(subItem => `<li>${subItem}</li>`).join('');

        localStorage.setItem('selectedServiceTitle', title);
        localStorage.setItem('selectedServiceItems', itemsHTML);
        localStorage.setItem('selectedServiceTheme', theme);

        window.location.href = 'service-details.html';
    });
    });

    // Hero entrance animation (only applies if .services-hero exists)
    if (document.querySelector(".services-hero")) {
        gsap.fromTo(".services-hero .fade-up",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.5 }
        );

        // Hero content parallax animation (upward movement on scroll) - Desktop Only
        if (window.innerWidth > 768) {
            gsap.to(".services-hero > *:not(.holographic-grid)", {
                y: -150,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".services-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    // Simple GSAP entrance animation removed to avoid conflict with reveal-on-scroll
});
