// Simple black background instead of neon cursor effect
document.addEventListener('DOMContentLoaded', function() {
  // Set the body background to solid black
  document.body.style.backgroundColor = '#000000';

  // Set the app element background to black
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.style.backgroundColor = '#000000';
    appElement.style.position = 'fixed';
    appElement.style.top = '0';
    appElement.style.left = '0';
    appElement.style.width = '100%';
    appElement.style.height = '100%';
    appElement.style.zIndex = '-1';
  }

  // Override any other background styles
  document.documentElement.style.setProperty('--bg-primary', '#000000');
  document.documentElement.style.setProperty('--bg-secondary', '#000000');
  document.documentElement.style.setProperty('--bg-dark', '#000000');
  document.documentElement.style.setProperty('--bg-dark-secondary', '#000000');
});
