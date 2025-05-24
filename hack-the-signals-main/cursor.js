/*
==============================================
FILE: cursor.js
==============================================
DESCRIPTION:
Creates and manages a custom signal-themed cursor for desktop users.
Provides interactive cursor effects when hovering over elements.

CONNECTIONS:
- Not directly loaded in HTML but can be included manually
- Works with cursor styles defined in styles.css
- Compatible with neon-effects.css for the glowing cursor effect
- Only activates on desktop devices (disabled on mobile)

SECTIONS IN THIS FILE:
1. Mobile detection
2. Cursor initialization
3. Mouse tracking
4. Animation loop
5. Interactive element effects
6. Click effects
==============================================
*/

/*
==============================================
FILE: cursor.js
==============================================
DESCRIPTION:
Creates and manages a custom signal-themed cursor for desktop users.
Provides interactive cursor effects when hovering over elements.

CONNECTIONS:
- Not directly loaded in HTML but can be included manually
- Works with cursor styles defined in styles.css
- Compatible with neon-effects.css for the glowing cursor effect
- Only activates on desktop devices (disabled on mobile)

SECTIONS IN THIS FILE:
1. Mobile detection
2. Cursor initialization
3. Mouse tracking
4. Animation loop
5. Interactive element effects
6. Click effects
==============================================
*/

// Signal Cursor Animation for Hack The Signals Website

// Disabling the custom cursor since we're using the neon cursor effect
// If you want to re-enable this cursor, uncomment the code below

/*
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile/touch device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (window.matchMedia("(max-width: 768px)").matches);

    // Only initialize custom cursor on non-mobile devices
    if (!isMobile) {
        initSignalCursor();
    }
});
*/

function initSignalCursor() {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Update mouse position
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor
    function animateCursor() {
        // Smooth follow for ring
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;

        // Update cursor positions
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .pricing-card, .time-box');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorRing.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorRing.classList.remove('cursor-hover');
        });
    });

    // Add click effect
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('cursor-click');
        cursorRing.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        cursorDot.classList.remove('cursor-click');
        cursorRing.classList.remove('cursor-click');
    });

    // Hide default cursor
    document.body.classList.add('custom-cursor');
}
