/*
==============================================
FILE: animations.js
==============================================
DESCRIPTION:
Handles all animation initialization and management for the website.
Applies animation classes, manages timing, and creates dynamic effects.

CONNECTIONS:
- Not directly loaded in HTML but can be included manually
- Uses animation classes defined in animations.css
- Works with elements styled in styles.css and neon-effects.css
- Enhances the functionality in script.js

SECTIONS IN THIS FILE:
1. Animation initialization
2. Timeline animations
3. Hover effects
4. Helper functions
5. Signal wave effects
6. Performance optimization
==============================================
*/

// Basic Animation Handling for Hack The Signals Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();

    // Initialize timeline animations
    initTimelineAnimations();

    // Initialize hover effects
    initHoverEffects();

    // Add signal waves
    addSignalWave();
});

// Initialize animations that should run on page load
function initAnimations() {
    // Animate hero elements
    animateWithDelay('.hero-content > *', 'animate-fade-in', 100);

    // Animate stats
    animateWithDelay('.stat-item', 'animate-slide-up', 200);
}

// Initialize timeline animations
function initTimelineAnimations() {
    // Add staggered animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // Calculate delay based on position
        const delay = 0.1 + (index * 0.05);
        item.style.transitionDelay = `${delay}s`;
    });
}

// Initialize hover effects
function initHoverEffects() {
    // Add shimmer effect to buttons on hover
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('shimmer');
        });

        btn.addEventListener('mouseleave', function() {
            this.classList.remove('shimmer');
        });
    });

    // Add pulse effect to highlight items
    document.querySelectorAll('.highlight-item').forEach(item => {
        item.classList.add('animate-pulse');
    });
}

// Helper function to animate elements with delay
function animateWithDelay(selector, animationClass, delayIncrement) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        // Add animation class
        el.classList.add(animationClass);
        // Add delay class
        el.style.animationDelay = `${(index * delayIncrement) / 1000}s`;
    });
}

// Add signal wave effect to sections
function addSignalWave() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const wave = document.createElement('div');
        wave.classList.add('signal-wave');
        section.appendChild(wave);
    });
}

// Optimize animations based on device performance
function optimizeAnimations() {
    // Check if device is low-end
    const isLowEndDevice = window.navigator.hardwareConcurrency < 4;

    if (isLowEndDevice) {
        // Reduce animation complexity
        document.body.classList.add('reduce-animations');
    }
}

// Call optimization on load
optimizeAnimations();
