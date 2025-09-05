const animations = {
  init() {
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    }

    // Initialize other animations
    this.setupScrollAnimations();
    this.setupHoverEffects();
  },

  setupScrollAnimations() {
    // Add scroll animations for elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  },

  setupHoverEffects() {
    // Add hover effects for interactive elements
    const hoverElements = document.querySelectorAll('.btn, .card, .nav-link');

    hoverElements.forEach((element) => {
      element.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.transition = 'transform 0.2s ease-in-out';
      });

      element.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      });
    });
  },
};

export default animations;
