// Form initialization and validation
function initializeNewForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Remove any existing submit event listeners to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Validate form
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Send to server
            const response = await fetch('http://localhost:3002/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showFormMessage('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.', 'success');
                form.reset();
            } else {
                showFormMessage('Error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showFormMessage('Error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Show form message
function showFormMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm') || document.querySelector('form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Initialize form when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewForm);
} else {
    // DOMContentLoaded has already fired
    initializeNewForm();
}
