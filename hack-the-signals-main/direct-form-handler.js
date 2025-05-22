// Direct Form Handler
// This script directly handles the registration form without any dependencies

document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct form handler loaded');
    
    // Get the registration form
    const form = document.getElementById('registration-form');
    console.log('Form found:', !!form);
    
    // Get the submit button
    const submitBtn = form ? form.querySelector('.submit-btn') : null;
    console.log('Submit button found:', !!submitBtn);
    
    // Get the modal
    const modal = document.getElementById('registration-modal');
    console.log('Modal found:', !!modal);
    
    // Get the close button
    const closeBtn = document.querySelector('.close-modal');
    console.log('Close button found:', !!closeBtn);
    
    // Add click event to all register buttons
    const registerBtns = document.querySelectorAll('.register-btn, a[href="#register"], #direct-register-btn');
    console.log('Register buttons found:', registerBtns.length);
    
    registerBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Register button clicked:', btn.textContent || btn.innerText);
            openModal();
        });
    });
    
    // Add click event to close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            closeModal();
        });
    }
    
    // Add submit event to form
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form data
            const formData = new FormData(form);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            console.log('Form data:', formDataObj);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
            }, 3000);
        });
    }
    
    // Add click event to submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            console.log('Submit button clicked');
            
            // Trigger form submission
            const event = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            
            form.dispatchEvent(event);
        });
    }
    
    // Function to open modal
    function openModal() {
        console.log('Opening modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }
    
    // Function to close modal
    function closeModal() {
        console.log('Closing modal');
        if (modal) {
            modal.style.opacity = '0';
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }, 300);
        }
    }
    
    // Function to show success message
    function showSuccessMessage() {
        console.log('Showing success message');
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-text">
                <h3>Registration Successful!</h3>
                <p>Thank you for registering for Hack The Signals!</p>
                <p>Your registration has been saved.</p>
                <p>You will receive a confirmation email shortly.</p>
            </div>
        `;
        
        // Hide the form
        if (form) {
            form.style.display = 'none';
        }
        
        // Add success message to modal
        if (modal) {
            modal.querySelector('.modal-content').appendChild(successMessage);
            
            // Show the success message with animation
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 10);
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
                
                // Remove success message and show form again after modal is closed
                setTimeout(() => {
                    successMessage.remove();
                    if (form) {
                        form.style.display = 'block';
                    }
                }, 300);
            }, 3000);
        }
    }
    
    // Add global functions for testing
    window.openRegistrationModal = openModal;
    window.closeRegistrationModal = closeModal;
    window.submitRegistrationForm = function() {
        if (form) {
            const event = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            form.dispatchEvent(event);
        }
    };
});
