/**
 * Benefits Section - Interactive Enhancements
 * Handles animations, hover effects, and interactivity for the benefits section
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS for benefit cards
  const benefitCards = document.querySelectorAll('.benefit-card');

  // Add hover effect to benefit cards
  benefitCards.forEach((card, index) => {
    // Set data-aos attributes if not already set
    if (!card.hasAttribute('data-aos')) {
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', index * 100 + 100);
      card.setAttribute('data-aos-duration', '600');
    }

    // Add hover effect
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      this.style.transition = 'all 0.3s ease-in-out';

      // Add pulse effect to the icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = 'pulse 1.5s infinite';
      }
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';

      // Remove pulse effect from the icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.animation = 'none';
      }
    });
  });

  // Benefit cards with expandable content
  const benefitCardsWithExpand = document.querySelectorAll('.benefit-card[data-expandable]');

  benefitCardsWithExpand.forEach((card) => {
    const content = card.querySelector('.benefit-expandable');
    const toggleBtn = card.querySelector('.benefit-toggle');

    if (content && toggleBtn) {
      // Initially hide the expandable content
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease-in-out';

      // Toggle expandable content
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isExpanded = content.style.maxHeight !== '0px';
        content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';

        // Update button text
        toggleBtn.innerHTML = isExpanded
          ? 'Ver más <i class="fas fa-chevron-down"></i>'
          : 'Ver menos <i class="fas fa-chevron-up"></i>';

        // Toggle aria-expanded attribute for accessibility
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
      });
    }
  });

  // Add animation to benefit icons
  const benefitIcons = document.querySelectorAll('.benefit-card .benefit-icon');
  benefitIcons.forEach((icon) => {
    // Add hover effect to icons
    icon.addEventListener('mouseenter', function () {
      this.style.transform = 'rotate(5deg) scale(1.1)';
    });

    icon.addEventListener('mouseleave', function () {
      this.style.transform = 'rotate(0) scale(1)';
    });
  });

  // Add animation to CTA buttons in benefits section
  const ctaButtons = document.querySelectorAll('.benefits-cta .btn');
  ctaButtons.forEach((button) => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
  });

  // Add parallax effect to benefit section background
  const benefitsSection = document.querySelector('.benefits-section');
  if (benefitsSection) {
    window.addEventListener('scroll', function () {
      const scrollPosition = window.scrollY;
      const sectionOffset = benefitsSection.offsetTop;
      const sectionHeight = benefitsSection.offsetHeight;

      // Only apply effect when section is in view
      if (
        scrollPosition > sectionOffset - window.innerHeight &&
        scrollPosition < sectionOffset + sectionHeight
      ) {
        const yPos = -(scrollPosition - sectionOffset) * 0.1;
        benefitsSection.style.backgroundPositionY = yPos + 'px';
      }
    });
  }

  // Add animation to benefit numbers/counters if they exist
  const benefitNumbers = document.querySelectorAll('.benefit-number');
  if (benefitNumbers.length > 0) {
    const animateNumbers = () => {
      benefitNumbers.forEach((number) => {
        const target = parseInt(number.getAttribute('data-target'));
        const suffix = number.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 16)); // 60fps
        let current = 0;

        const updateNumber = () => {
          current += step;
          if (current >= target) {
            number.textContent = target + suffix;
          } else {
            number.textContent = current + suffix;
            requestAnimationFrame(updateNumber);
          }
        };

        // Start animation when number is in viewport
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            updateNumber();
            observer.unobserve(number);
          }
        });

        observer.observe(number);
      });
    };

    // Initialize number animation
    animateNumbers();
  }
});

// Styles are now in the main CSS file
