// Enhanced Registration Form Functionality for Hack The Signals
// Integrated with Firebase Database

import { saveRegistration, getRegistrationStats, createTeam, getTeamByName } from './database-service.js';

// Variable to store current registration ID
let currentRegistrationId = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Update stats from database if available
    try {
        const stats = await getRegistrationStats();
        updateStatsDisplay(stats);
    } catch (error) {
        console.error("Error loading stats:", error);
    }
    // Get modal elements
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.close-modal');
    const registerBtns = document.querySelectorAll('.register-btn, a[href="#register"]');
    const membershipTypeDisplay = document.getElementById('membership-type');
    const priceDisplay = document.getElementById('price-display');
    const membershipSelect = document.getElementById('membership-type-select');
    const registrationForm = document.getElementById('registration-form');
    const formInputs = document.querySelectorAll('.registration-form input, .registration-form select, .registration-form textarea');

    console.log('Found register buttons:', registerBtns.length);

    // Membership types and prices
    const membershipPrices = {
        'cs-sps': '₹100',
        'ieee': '₹150',
        'non-ieee': '₹250'
    };

    const membershipLabels = {
        'cs-sps': 'IEEE CS/SPS Member',
        'ieee': 'IEEE Member',
        'non-ieee': 'Non-IEEE Member'
    };

    // Open modal when register buttons are clicked
    registerBtns.forEach(btn => {
        console.log('Adding click event to button:', btn.textContent || btn.innerText);

        btn.addEventListener('click', function(e) {
            console.log('Register button clicked');
            e.preventDefault();

            // Check if this button is in a pricing card
            const pricingCard = this.closest('.pricing-card');
            if (pricingCard) {
                console.log('Button is in pricing card');
                // Get the membership type from the card title
                const cardTitle = pricingCard.querySelector('h3').textContent;
                console.log('Card title:', cardTitle);

                // Set the appropriate membership type in the dropdown
                if (cardTitle.includes('CS/SPS')) {
                    membershipSelect.value = 'cs-sps';
                } else if (cardTitle.includes('IEEE Member')) {
                    membershipSelect.value = 'ieee';
                } else {
                    membershipSelect.value = 'non-ieee';
                }

                // Update the displayed membership type and price
                updateMembershipDisplay();
            }

            // Show the modal with animation
            console.log('Showing modal');
            modal.style.display = 'flex'; // Ensure the modal is displayed with flex
            modal.classList.add('active');

            // Force a reflow before changing opacity for the transition to work
            void modal.offsetWidth;

            // Set opacity after a tiny delay to ensure the display change has taken effect
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);

            document.body.style.overflow = 'hidden'; // Prevent scrolling

            // Focus on first input after modal is visible
            setTimeout(() => {
                document.getElementById('first-name').focus();
            }, 300);
        });
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Update membership type and price when dropdown changes
    membershipSelect.addEventListener('change', function() {
        updateMembershipDisplay();

        // Add animation to price change
        priceDisplay.classList.add('price-change');
        setTimeout(() => {
            priceDisplay.classList.remove('price-change');
        }, 500);
    });

    // Add animation class when inputs are focused
    formInputs.forEach(input => {
        // Add active class to parent when input is focused
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });

        // Remove active class when input loses focus
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('input-focused');
            }
        });

        // If input already has a value, add active class
        if (input.value !== '') {
            input.parentElement.classList.add('input-focused');
        }
    });

    // Handle form submission with validation
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        const isValid = validateForm();

        if (isValid) {
            // Get form data
            const formData = new FormData(registrationForm);
            const formDataObj = {};

            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            // Show loading state
            const submitBtn = registrationForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                // Check if team already exists or create a new team
                const teamName = formDataObj['team-name'];
                const teamMembers = formDataObj['team-members'] || '';

                if (teamName) {
                    try {
                        // Check if team exists
                        const existingTeam = await getTeamByName(teamName);

                        if (!existingTeam) {
                            // Create new team
                            const teamData = {
                                name: teamName,
                                members: [formDataObj['email']],
                                createdAt: new Date()
                            };

                            // Add team members if provided
                            if (teamMembers) {
                                const memberEmails = teamMembers.split(',').map(email => email.trim());
                                teamData.members = [...teamData.members, ...memberEmails];
                            }

                            await createTeam(teamData);
                            console.log('Team created:', teamName);
                        } else {
                            console.log('Team already exists:', teamName);
                        }
                    } catch (teamError) {
                        console.error('Error handling team:', teamError);
                        // Continue with registration even if team creation fails
                    }
                }

                // Save registration to Firebase
                const registrationId = await saveRegistration(formDataObj);
                console.log('Registration saved with ID:', registrationId);

                // Store the registration ID for the success message
                currentRegistrationId = registrationId;

                // Update stats display
                try {
                    const stats = await getRegistrationStats();
                    updateStatsDisplay(stats);
                } catch (error) {
                    console.error("Error updating stats:", error);
                }

                // Show success message with animation
                showSuccessMessage();

                // Close the modal and reset the form after delay
                setTimeout(() => {
                    closeModal();
                    registrationForm.reset();

                    // Remove all input-focused classes
                    document.querySelectorAll('.input-focused').forEach(el => {
                        el.classList.remove('input-focused');
                    });
                }, 2000);
            } catch (error) {
                console.error('Error saving registration:', error);
                showError(submitBtn, 'Failed to save registration. Please try again.');

                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });

    // Function to validate form
    function validateForm() {
        let isValid = true;
        const requiredInputs = registrationForm.querySelectorAll('[required]');

        // Remove any existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Check each required input
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            } else if (input.id === 'phone' && !isValidPhone(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid phone number');
            }
        });

        return isValid;
    }

    // Function to show error message
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        // Add error class to input
        input.classList.add('input-error');

        // Add error message after the input
        input.parentElement.appendChild(errorElement);

        // Remove error class after 3 seconds
        setTimeout(() => {
            input.classList.remove('input-error');
        }, 3000);

        // Remove error on input change
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }

    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate phone
    function isValidPhone(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }

    // Function to show success message
    function showSuccessMessage() {
        // Create success message element
        const successElement = document.createElement('div');
        successElement.className = 'success-message';

        // Create success icon
        const iconElement = document.createElement('div');
        iconElement.className = 'success-icon';
        iconElement.innerHTML = '<i class="fas fa-check-circle"></i>';

        // Create success text
        const textElement = document.createElement('div');
        textElement.className = 'success-text';
        textElement.innerHTML = `
            <h3>Registration Successful!</h3>
            <p>Thank you for registering for Hack The Signals!</p>
            <p>Your registration has been saved to our database.</p>
            <p>You will receive a confirmation email shortly.</p>
            <p class="registration-id">Registration ID: <span class="id-value">${currentRegistrationId || 'N/A'}</span></p>
        `;

        // Store registration ID for reference
        window.lastRegistrationId = currentRegistrationId;

        // Add elements to success message
        successElement.appendChild(iconElement);
        successElement.appendChild(textElement);

        // Hide the form
        registrationForm.style.opacity = '0';

        // Add success message to modal
        modal.querySelector('.modal-content').appendChild(successElement);

        // Animate success message
        setTimeout(() => {
            successElement.classList.add('show');
        }, 100);
    }

    // Function to update membership type and price display
    function updateMembershipDisplay() {
        const selectedType = membershipSelect.value;
        membershipTypeDisplay.textContent = membershipLabels[selectedType];
        priceDisplay.textContent = membershipPrices[selectedType];
    }

    // Function to close the modal
    function closeModal() {
        console.log('Closing modal');
        // First set opacity to 0 for the fade-out effect
        modal.style.opacity = '0';

        // After the transition completes, hide the modal and reset
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none'; // Explicitly hide the modal
            document.body.style.overflow = ''; // Restore scrolling

            // Remove success message if exists
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.remove();
            }

            // Show the form again
            registrationForm.style.opacity = '1';
        }, 300);
    }

    // Function to update stats display on the homepage
    function updateStatsDisplay(stats) {
        if (!stats) return;

        // Get stat number elements
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length < 3) return;

        // Update hours (first stat)
        statNumbers[0].textContent = '24';

        // Update participants (second stat)
        if (stats.totalRegistrations) {
            statNumbers[1].textContent = stats.totalRegistrations + '+';
        }

        // Update prize amount (third stat)
        statNumbers[2].textContent = '₹80K';
    }
});
