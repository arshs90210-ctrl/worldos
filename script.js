// script.js
// Set the current year in the footer dynamically
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    const now = new Date();
    yearEl.textContent = now.getFullYear();
  }
});