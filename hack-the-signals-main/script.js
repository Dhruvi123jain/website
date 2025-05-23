/*
==============================================
FILE: script.js
==============================================
DESCRIPTION:
Main JavaScript file for the Hack The Signals website.
Handles core functionality like theme toggling, countdown timer,
carousel, and mobile menu.

CONNECTIONS:
- Loaded by index.html with defer attribute
- Works with styles.css for theme switching
- Uses AOS library for scroll animations
- Interacts with DOM elements defined in index.html
- Some functionality may be enhanced by animations.js and cursor.js

SECTIONS IN THIS FILE:
1. Theme toggle functionality
2. Countdown timer
3. Carousel/slider functionality
4. AOS (Animate On Scroll) initialization
5. Mobile detection and menu handling
6. Timeline animations
7. Element animation assignments
==============================================
*/

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Check for saved theme preference or use default dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Initialize stat counters animation
    initStatCounters();

    // Enhance the countdown display with additional time units
    enhanceCountdownDisplay();

    // Initial countdown update
    updateCountdown();

    // Add a button to test the white screen transition
    addTestControls();
});

// Function to animate stat counters from 0 to their target values
function initStatCounters() {
    // Get all stat number elements
    const statNumbers = document.querySelectorAll('.stat-number');

    // Define the target values and formats
    const targetValues = [
        { value: 24, format: (val) => Math.round(val) },
        { value: 300, format: (val) => Math.round(val) + '+' },
        { value: 80, format: (val) => '₹' + Math.round(val) + 'K' }
    ];

    // Animation duration in milliseconds
    const duration = 2000;
    // Number of steps in the animation
    const steps = 60;
    // Time between steps
    const stepTime = duration / steps;

    // For each stat number
    statNumbers.forEach((element, index) => {
        // Skip if no target value defined
        if (!targetValues[index]) return;

        // Get target value and format function
        const { value, format } = targetValues[index];

        // Set initial value to 0
        let currentValue = 0;
        element.textContent = format(currentValue);

        // Calculate increment per step
        const increment = value / steps;

        // Start animation after a small delay based on index
        setTimeout(() => {
            // Create interval for animation
            const interval = setInterval(() => {
                // Increment current value
                currentValue += increment;

                // Add updating class for bounce effect
                element.classList.add('updating');

                // Remove the class after a short delay
                setTimeout(() => {
                    element.classList.remove('updating');
                }, 100);

                // If reached or exceeded target, set to target and clear interval
                if (currentValue >= value) {
                    currentValue = value;
                    element.textContent = format(currentValue);
                    clearInterval(interval);
                } else {
                    // Otherwise update with current value
                    element.textContent = format(currentValue);
                }
            }, stepTime);
        }, index * 300); // Increased stagger time for better visual effect
    });
}



// Set the date and time we're counting down to (event start time)
const eventStartDate = new Date("September 1, 2025 14:00:00").getTime(); // 2 PM on Sep 1, 2025

// Set the date and time when the event ends
const eventEndDate = new Date("September 2, 2025 14:00:00").getTime(); // 2 PM on Sep 2, 2025

// Set the time when the white screen transition should happen (in milliseconds before event end)
// For example, 300000 ms = 5 minutes before the event ends
const whiteScreenTransitionTime = 300000; // 5 minutes before event end

// Duration of the white screen transition (how long it takes to fade to white)
const transitionDuration = 10000; // 10 seconds to fully transition



// Create white screen overlay element
const createWhiteOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'white-screen-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = `opacity ${transitionDuration/1000}s ease-in`;
    document.body.appendChild(overlay);
    return overlay;
};

// Create the white overlay but keep it transparent initially
const whiteOverlay = createWhiteOverlay();

// Function to enhance the countdown display with additional time units
function enhanceCountdownDisplay() {
    const countdownTimer = document.querySelector('.countdown-timer');
    if (!countdownTimer) return;

    // Check if we already have the enhanced display
    if (document.getElementById('months')) return;

    // Create new time boxes for months and weeks
    const monthsBox = document.createElement('div');
    monthsBox.className = 'time-box neon-border neon-pulse';
    monthsBox.innerHTML = `
        <span id="months" class="time-number">00</span>
        <span class="time-label">Months</span>
    `;

    const weeksBox = document.createElement('div');
    weeksBox.className = 'time-box neon-border neon-pulse';
    weeksBox.innerHTML = `
        <span id="weeks" class="time-number">00</span>
        <span class="time-label">Weeks</span>
    `;

    // Insert at the beginning of the countdown timer
    countdownTimer.insertBefore(weeksBox, countdownTimer.firstChild);
    countdownTimer.insertBefore(monthsBox, countdownTimer.firstChild);

    console.log('Enhanced countdown display with months and weeks');
}

// Function to start the white screen transition
function startWhiteScreenTransition() {
    console.log('Starting white screen transition...');

    // Make sure the overlay exists
    if (!document.getElementById('white-screen-overlay')) {
        createWhiteOverlay();
    }

    // Get the overlay
    const overlay = document.getElementById('white-screen-overlay');

    // Make it visible and start transition
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    overlay.style.opacity = '1';

    // Add a message to the overlay
    const message = document.createElement('div');
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = '#000';
    message.style.fontSize = '2rem';
    message.style.fontWeight = 'bold';
    message.style.textAlign = 'center';
    message.style.opacity = '0';
    message.style.transition = 'opacity 2s ease-in';
    message.innerHTML = 'Hack The Signals<br>Has Concluded';

    overlay.appendChild(message);

    // Fade in the message after a delay
    setTimeout(() => {
        message.style.opacity = '1';
    }, transitionDuration / 2);
}

// Enhanced countdown function
function updateCountdown() {
    const now = new Date().getTime();

    // Use custom end date if set (for testing purposes)
    const actualEndDate = window.customEventEndDate || eventEndDate;

    // Check if we're before, during, or after the event
    let targetDate, countdownLabel, distance;

    if (now < eventStartDate) {
        // Before event starts - count down to start
        targetDate = eventStartDate;
        countdownLabel = "Time Until Hackathon Starts";
        distance = targetDate - now;
    } else if (now < actualEndDate) {
        // During event - count down to end
        targetDate = actualEndDate;
        countdownLabel = "Hackathon Time Remaining";
        distance = targetDate - now;

        // Check if it's time for the white screen transition
        if (distance <= whiteScreenTransitionTime &&
            document.getElementById('white-screen-overlay') &&
            !document.getElementById('white-screen-overlay').style.opacity) {
            startWhiteScreenTransition();
        }
    } else {
        // After event - show zeros and completed message
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        // If we haven't already transitioned to white screen, do it now
        if (document.getElementById('white-screen-overlay') &&
            !document.getElementById('white-screen-overlay').style.opacity) {
            startWhiteScreenTransition();
        }

        // Update countdown label
        const labelElement = document.querySelector('.countdown-section h2');
        if (labelElement) {
            labelElement.textContent = "Hackathon Completed";
        }

        clearInterval(countdownInterval);
        return;
    }

    // Update countdown label if it exists
    const labelElement = document.querySelector('.countdown-section h2');
    if (labelElement && labelElement.textContent !== countdownLabel) {
        labelElement.textContent = countdownLabel;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Calculate additional units for enhanced display
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    const weeks = Math.floor(remainingDays / 7);
    const remainingDaysAfterWeeks = remainingDays % 7;

    // Update the countdown display
    document.getElementById("days").textContent = days.toString().padStart(2, "0");
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");

    // If we have elements for the enhanced display, update them too
    if (document.getElementById("months")) {
        document.getElementById("months").textContent = months.toString().padStart(2, "0");
    }
    if (document.getElementById("weeks")) {
        document.getElementById("weeks").textContent = weeks.toString().padStart(2, "0");
    }

    // Add a detailed countdown to the console for debugging
    if (distance % 60000 < 1000) { // Log only once per minute to avoid console spam
        console.log(`Countdown: ${months} months, ${weeks} weeks, ${remainingDaysAfterWeeks} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    }
}

// Update countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

// Initial call to display immediately
updateCountdown();

// =============================================
// TESTING AND MANUAL CONTROL FUNCTIONS
// =============================================

// Function to manually trigger the white screen transition (for testing)
function testWhiteScreenTransition() {
    startWhiteScreenTransition();
    return "White screen transition started manually";
}

// Function to set a custom end time (for testing)
function setCustomEndTime(minutes) {
    const newEndTime = new Date().getTime() + (minutes * 60 * 1000);
    console.log(`Setting custom end time to ${new Date(newEndTime).toLocaleString()}`);
    window.customEventEndDate = newEndTime;
    return `Custom end time set to ${minutes} minutes from now`;
}

// Function to reset to the original end time
function resetEndTime() {
    window.customEventEndDate = null;
    console.log(`Reset to original end time: ${new Date(eventEndDate).toLocaleString()}`);
    return "End time reset to original value";
}

// Function to get current countdown status
function getCountdownStatus() {
    const now = new Date().getTime();
    const targetEndDate = window.customEventEndDate || eventEndDate;
    const timeRemaining = targetEndDate - now;

    if (timeRemaining <= 0) {
        return "Event has ended";
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Add these functions to the window object for easy access from the console
window.hackathonControls = {
    testWhiteScreenTransition,
    setCustomEndTime,
    resetEndTime,
    getCountdownStatus
};

// Log instructions to the console for manual testing
console.log(`
==============================================
HACK THE SIGNALS - COUNTDOWN CONTROLS
==============================================
To manually test the white screen transition, run:
    hackathonControls.testWhiteScreenTransition()

To set a custom end time (e.g., 2 minutes from now), run:
    hackathonControls.setCustomEndTime(2)

To reset to the original end time, run:
    hackathonControls.resetEndTime()

To check the current countdown status, run:
    hackathonControls.getCountdownStatus()
==============================================
`);

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    let currentIndex = 0;
    const totalItems = carouselItems.length;

    // Set initial position
    updateCarousel();

    // Event listeners for buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        });

        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        });
    }

    // Auto slide every 5 seconds
    setInterval(function() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000);

    function updateCarousel() {
        if (carousel) {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }
});

// Additional initialization for mobile and other features
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile/touch device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (window.matchMedia("(max-width: 768px)").matches);

    // Add mobile class
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');

            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Add tooltips to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        const hour = parseInt(item.getAttribute('data-hour')) || 1;

        // Add tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'hour-tooltip';
        tooltip.textContent = `Hour ${hour}`;
        item.appendChild(tooltip);
    });
});

// Import and use the database service for glimpses carousel
import { getGlimpses } from './database-service.js';

async function loadGlimpsesCarousel() {
    const glimpses = await getGlimpses();
    const container = document.getElementById('glimpses-carousel');
    if (!container) return;
    container.innerHTML = '';
    glimpses.forEach(url => {
        if (url) {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.innerHTML = `<img src="${url}" alt="Hackathon Glimpse">`;
            container.appendChild(div);
        }
    });
}
document.addEventListener('DOMContentLoaded', loadGlimpsesCarousel);
