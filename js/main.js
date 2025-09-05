/**
 * EcoAisla - Main JavaScript File
 * Handles all interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  if (mobileMenuBtn && navMenu) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      body.classList.toggle('menu-open');

      // Update aria-expanded attribute
      const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking on a nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          // Only for mobile
          mobileMenuBtn.classList.remove('active');
          navMenu.classList.remove('active');
          body.classList.remove('menu-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth',
        });

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      }
    });
  });

  // Sticky header on scroll with shadow and size change
  const header = document.getElementById('header');
  if (header) {
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;

    // Set initial padding to body to prevent content jump
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.body.style.paddingTop = `${headerHeight}px`;

    // Function to handle scroll events
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class based on scroll position
      if (currentScroll > 50) {
        header.classList.add('scrolled');

        // Hide header when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
          header.style.transform = `translateY(-${headerHeight}px)`;
        } else {
          header.style.transform = 'translateY(0)';
        }
      } else {
        header.classList.remove('scrolled');
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    };

    // Throttle scroll events for better performance
    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Handle window resize
    window.addEventListener(
      'resize',
      debounce(() => {
        const newHeaderHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${newHeaderHeight}px`);
        document.body.style.paddingTop = `${newHeaderHeight}px`;

        // Reset mobile menu state on desktop
        if (window.innerWidth > 992) {
          if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
          if (navMenu) navMenu.classList.remove('active');
          body.classList.remove('menu-open');
        }
      }, 250)
    );

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
      }

      if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }

      lastScroll = currentScroll;

      // Add/remove scrolled class for header background
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Form submission handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML =
          '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        contactForm.appendChild(successMessage);

        // Reset form
        contactForm.reset();

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1500);
    });
  }

  // Lazy loading for images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // Initialize tooltips
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach((element) => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});

// Tooltip functions
function showTooltip(e) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = this.getAttribute('data-tooltip');
  document.body.appendChild(tooltip);

  const rect = this.getBoundingClientRect();
  const tooltipHeight = tooltip.offsetHeight;
  const tooltipWidth = tooltip.offsetWidth;

  // Position the tooltip above the element
  tooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
  tooltip.style.left = `${rect.left + this.offsetWidth / 2 - tooltipWidth / 2}px`;

  this.setAttribute('aria-describedby', 'tooltip');
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
  this.removeAttribute('aria-describedby');
}

// Debounce function for scroll/resize events
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for scroll/resize events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
