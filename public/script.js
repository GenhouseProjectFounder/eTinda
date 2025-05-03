document.addEventListener('DOMContentLoaded', () => {
  // Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Carousel Navigation
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mouseleave', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
    });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  });

  // Form Submission
  const signupForm = document.querySelector('.signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    if (name && email && role) {
      alert(`Thank you, ${name}! You've signed up as a ${role}. We'll send updates to ${email}.`);
      signupForm.reset();
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Button Interactions
  const favoriteButtons = document.querySelectorAll('.favorite-button');
  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.textContent = button.textContent === 'Favorite' ? 'Favorited' : 'Favorite';
      button.classList.toggle('favorited');
    });
  });

  const addToCartButtons = document.querySelectorAll('.cta-button:not(.favorite-button):not(.buy-button)');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Item added to cart!');
    });
  });

  const buyButtons = document.querySelectorAll('.buy-button');
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Proceeding to checkout...');
    });
  });
});