console.log('FAQ script loaded');

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded, initializing FAQ functionality');
  // FAQ Accordion Functionality
  const faqItems = document.querySelectorAll('.faq-item');

  // Function to close all FAQ items except the one being opened
  function closeAllFaqItems(exceptThisOne = null) {
    faqItems.forEach((item) => {
      if (exceptThisOne && item === exceptThisOne) return;

      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const answerContent = answer?.querySelector('.answer-content');

      if (question && answer && answerContent) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.padding = '0';
        answer.style.overflow = 'hidden';
        answerContent.style.opacity = '0';
        answerContent.style.transform = 'translateY(-10px)';
      }
    });
  }

  // Initialize FAQ items
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerContent = answer?.querySelector('.answer-content');

    if (!question || !answer || !answerContent) return;

    // Set initial state
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    answer.style.maxHeight = '0';
    answer.style.padding = '0';
    answer.style.overflow = 'hidden';
    answerContent.style.opacity = '0';
    answerContent.style.transform = 'translateY(-10px)';
    answerContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // Add click handler
    question.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      if (!isExpanded) {
        closeAllFaqItems(item);

        // Open clicked item
        this.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '1.5rem';

        // Trigger reflow
        void answer.offsetHeight;

        answerContent.style.opacity = '1';
        answerContent.style.transform = 'translateY(0)';
      } else {
        // Close clicked item
        this.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answerContent.style.opacity = '0';
        answerContent.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          answer.style.maxHeight = '0';
          answer.style.padding = '0';
        }, 200);
      }
    });

    // Make entire FAQ item clickable
    item.style.cursor = 'pointer';
    item.addEventListener('click', function (e) {
      if (
        e.target.tagName !== 'A' &&
        e.target.tagName !== 'BUTTON' &&
        !e.target.closest('a') &&
        !e.target.closest('button')
      ) {
        question.click();
      }
    });

    // Add keyboard navigation
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });

    // Set ARIA attributes
    const questionId = `faq-question-${index}`;
    const answerId = `faq-answer-${index}`;

    question.setAttribute('id', questionId);
    question.setAttribute('aria-controls', answerId);
    answer.setAttribute('id', answerId);
    answer.setAttribute('aria-labelledby', questionId);
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstQuestion = faqItems[0].querySelector('.faq-question');
    if (firstQuestion) {
      firstQuestion.click();
    }
  }

  // Close FAQ when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.faq-item')) {
      closeAllFaqItems();
    }
  });
});
