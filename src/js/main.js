// Import styles
import '../scss/main.scss';

// Import modules
import formHandler from './modules/form';
import animations from './modules/animations';

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  formHandler.init();
  animations.init();

  // Add any other initialization code here
  console.log('Website initialized');
});
