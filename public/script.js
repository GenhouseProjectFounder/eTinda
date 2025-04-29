// CTA Button Alert
const shopNowBtn = document.getElementById('shop-now-btn');
shopNowBtn.addEventListener('click', () => {
  alert('Welcome to eTinda! Start shopping sustainably now.');
});

// Smooth Scroll for Footer Links
const footerLinks = document.querySelectorAll('.footer-link');
footerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});