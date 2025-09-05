/**
 * Mobile Menu Functionality
 */
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const navLinks = document.querySelectorAll('.nav-link');
  const html = document.documentElement;
  const body = document.body;

  // Check if mobile menu elements exist
  if (!mobileMenuBtn || !navMenu || !menuOverlay) return;

  // Add ARIA attributes for accessibility
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.setAttribute('aria-controls', 'nav-menu');
  navMenu.setAttribute('id', 'nav-menu');
  navMenu.setAttribute('aria-label', 'Main navigation');

  // Toggle mobile menu
  function toggleMenu() {
    const isOpening = !navMenu.classList.contains('active');

    if (isOpening) {
      // Open menu
      body.classList.add('menu-open');
      menuOverlay.classList.add('active');
      navMenu.classList.add('active');
      menuIcon.classList.remove('active');
      closeIcon.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      html.style.overflow = 'hidden';

      // Show the menu with a smooth transition
      setTimeout(() => {
        navMenu.style.display = 'flex';
        setTimeout(() => {
          navMenu.style.opacity = '1';
          navMenu.style.transform = 'translateY(0)';
        }, 10);
      }, 10);

      // Trap focus inside menu when open
      trapFocus(navMenu);
    } else {
      // Close menu
      closeMenu();
    }

    // Prevent default button behavior
    return false;
  }

  // Close menu
  function closeMenu() {
    body.classList.remove('menu-open');
    menuOverlay.classList.remove('active');
    
    // Add closing animation
    if (navMenu) {
      navMenu.style.opacity = '0';
      navMenu.style.transform = 'translateY(-20px)';
      
      // Wait for animation to complete before hiding
      setTimeout(() => {
        navMenu.classList.remove('active');
        if (window.innerWidth >= 769 && window.innerWidth <= 1020) {
          navMenu.style.display = 'none';
        }
      }, 300);
    }
    
    // Update icons
    if (menuIcon) menuIcon.classList.add('active');
    if (closeIcon) closeIcon.classList.remove('active');
    
    // Update ARIA and styles
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    html.style.overflow = '';
    
    // Restore focus to menu button
    if (mobileMenuBtn) mobileMenuBtn.focus();
    
    // Remove focus trap
    removeFocusTrap();
  }

  // Event Listeners
  mobileMenuBtn.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when pressing Escape key or clicking outside
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    const isClickInside = navMenu.contains(e.target) || mobileMenuBtn.contains(e.target);
    if (!isClickInside && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Handle window resize
  function handleResize() {
    const isDesktop = window.innerWidth >= 1024; // 1024px and above
    const isTablet = window.innerWidth >= 768; // 768px and above
    
    if (isDesktop || isTablet) {
      // On desktop and tablet, ensure menu is visible and reset styles
      navMenu.style.display = 'flex';
      navMenu.style.opacity = '1';
      navMenu.style.transform = 'none';
      navMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      body.classList.remove('menu-open');
      html.style.overflow = '';
      mobileMenuBtn.style.display = 'none';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      
      // Ensure menu is visible for screen readers
      navMenu.removeAttribute('aria-hidden');
    } else {
      // On mobile, show menu button and handle menu state
      mobileMenuBtn.style.display = 'block';
      if (!navMenu.classList.contains('active')) {
        navMenu.style.display = 'none';
        navMenu.style.opacity = '0';
        navMenu.style.transform = 'translateY(-20px)';
      }
    }
  }

  // Trap focus inside menu when open
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );

    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    // Focus first element
    firstFocusableEl.focus();

    // Handle tab key navigation
    element.addEventListener('keydown', function trapHandler(e) {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableEl) {
          e.preventDefault();
          lastFocusableEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableEl) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
      }
    });

    // Store the trap handler for later removal
    element._trapHandler = trapHandler;
  }

  // Remove focus trap
  function removeFocusTrap() {
    if (navMenu._trapHandler) {
      navMenu.removeEventListener('keydown', navMenu._trapHandler);
      delete navMenu._trapHandler;
    }
  }

  // Listen for window resize
  window.addEventListener('resize', handleResize);

  // Initialize
  handleResize();
  
  // Ensure menu is visible on larger screens on page load
  if (window.innerWidth >= 768) {
    navMenu.style.display = 'flex';
    navMenu.style.opacity = '1';
    navMenu.style.transform = 'none';
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');
    html.style.overflow = '';
    mobileMenuBtn.style.display = 'none';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
});
