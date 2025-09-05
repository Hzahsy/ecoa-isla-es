// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('multiStepForm');
    if (!form) return;

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get all form data
        const formData = new FormData(form);
        const formValues = {};
        
        // Convert FormData to object
        formData.forEach((value, key) => {
            formValues[key] = value;
        });
        
        // Get radio button values
        const vivienda = document.querySelector('input[name="vivienda"]:checked');
        const atico = document.querySelector('input[name="atico"]:checked');
        
        if (vivienda) formValues.vivienda = vivienda.value;
        if (atico) formValues.atico = atico.value;
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando...';
            
            // Send data to server
            const response = await fetch('http://localhost:3001/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                showFormMessage('¡Formulario enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                form.reset();
                // Reset form steps if needed
                const firstStep = document.querySelector('.form-step[data-step="1"]');
                if (firstStep) {
                    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
                    firstStep.classList.add('active');
                    // Reset progress steps
                    document.querySelectorAll('.progress-step').forEach((step, index) => {
                        if (index === 0) {
                            step.classList.add('active');
                        } else {
                            step.classList.remove('active');
                        }
                    });
                }
            } else {
                throw new Error(result.message || 'Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error:', error);
            showFormMessage(error.message || 'Error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        }
    });
    
    // Helper function to show messages
    function showFormMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create and show new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Insert after form title or at the end of form
        const formTitle = form.querySelector('h2');
        if (formTitle) {
            formTitle.insertAdjacentElement('afterend', messageDiv);
        } else {
            form.prepend(messageDiv);
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
});
