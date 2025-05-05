// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Adjust for fixed header
              behavior: 'smooth'
          });
      }
       // Close mobile menu after clicking a link
      if (document.querySelector('.nav-links').classList.contains('active')) {
          document.querySelector('.nav-links').classList.remove('active');
      }
  });
});


// Carousel Functionality
const carousels = document.querySelectorAll('.carousel, .hero-carousel'); // Select both types of carousels

carousels.forEach(carousel => {
  const container = carousel.querySelector('.carousel-container');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let scrollPosition = 0;

  // Determine scroll amount based on carousel type
  let scrollAmount = 0;
  let isHero = carousel.classList.contains('hero-carousel');
   let isScrolling = false; // Flag to prevent multiple clicks while animating

  // Function to update scroll amount and check button visibility (optional)
  function updateCarousel() {
       if (isHero) {
          // For the hero, scroll one full slide width
           scrollAmount = container.offsetWidth;
           // No need to hide buttons for hero - it wraps visually or is infinite
           prevBtn.style.display = 'block';
           nextBtn.style.display = 'block';
       } else {
          // For standard carousels, scroll by item width or a fixed value
          const firstItem = container.querySelector('.carousel-item');
          if (firstItem) {
              // Scroll by the width of one item plus gap
               const itemStyle = getComputedStyle(firstItem);
               const itemWidth = firstItem.offsetWidth;
               const gap = parseFloat(getComputedStyle(container).gap);
               scrollAmount = itemWidth + gap;
          } else {
               scrollAmount = 300; // Default fallback
          }

           // Hide/show buttons at ends (optional for infinite scroll later)
           const maxScroll = container.scrollWidth - container.offsetWidth;
           // Use scrollLeft to check current position
           const currentScroll = container.scrollLeft;

           prevBtn.style.display = currentScroll > 5 ? 'block' : 'none'; // Add slight tolerance
           nextBtn.style.display = currentScroll < maxScroll - 5 ? 'block' : 'none'; // Allow slight tolerance
       }
  }

   // Add scroll event listener to update button visibility while scrolling
   container.addEventListener('scroll', () => {
      if (!isHero) {
           updateCarousel();
       }
   });


   // Initial update
  updateCarousel();

  // Update on window resize
  window.addEventListener('resize', updateCarousel);


  prevBtn.addEventListener('click', () => {
       if (isScrolling) return; // Prevent multiple clicks
       isScrolling = true;

       // Use scrollLeft directly
      scrollPosition = Math.max(container.scrollLeft - scrollAmount, 0);
      container.scrollTo({
           left: scrollPosition,
           behavior: 'smooth'
       });
       // isScrolling will be reset by the 'scrollend' event (if supported) or a timeout
       // Simple timeout fallback:
        setTimeout(() => { isScrolling = false; }, 500); // Adjust timing as needed

  });

  nextBtn.addEventListener('click', () => {
       if (isScrolling) return; // Prevent multiple clicks
       isScrolling = true;

       // Use scrollLeft directly
       const maxScroll = container.scrollWidth - container.offsetWidth;
      scrollPosition = Math.min(container.scrollLeft + scrollAmount, maxScroll);
       container.scrollTo({
           left: scrollPosition,
           behavior: 'smooth'
       });
       // Simple timeout fallback:
       setTimeout(() => { isScrolling = false; }, 500); // Adjust timing as needed
  });


   // Optional: Add swipe functionality for touch devices (simplified)
   // Note: This basic implementation works alongside scroll-behavior: smooth
   // A more robust implementation might involve complex touch tracking and transform
   let touchStartX = 0;
   let touchEndX = 0;

   container.addEventListener('touchstart', (e) => {
       if (isHero) return;
       touchStartX = e.touches[0].clientX;
   });

    container.addEventListener('touchmove', (e) => {
         if (isHero) return;
        // Prevent default scroll behavior if you want to implement custom drag
        // e.preventDefault();
    });

   container.addEventListener('touchend', (e) => {
       if (isHero) return;
       touchEndX = e.changedTouches[0].clientX;
       const swipeThreshold = 50; // Minimum pixels for a swipe

       if (touchEndX < touchStartX - swipeThreshold) {
           // Swiped Left - Go to next
            const maxScroll = container.scrollWidth - container.offsetWidth;
            const targetScroll = Math.min(container.scrollLeft + scrollAmount, maxScroll);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });

       } else if (touchEndX > touchStartX + swipeThreshold) {
           // Swiped Right - Go to previous
            const targetScroll = Math.max(container.scrollLeft - scrollAmount, 0);
           container.scrollTo({
               left: targetScroll,
               behavior: 'smooth'
           });
       }
       // If swipe was not strong enough, scroll-behavior: smooth will handle snapping back due to native browser scroll

       // Update buttons after a potential scroll
       setTimeout(() => { updateCarousel(); }, 500); // Allow scroll to finish
   });


});


// Guest Action Prompt
document.querySelectorAll('.guest-action').forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
      // Check if user is logged in (using a placeholder localStorage item)
      if (!localStorage.getItem('loggedIn')) {
          alert('Please sign up or log in to use this feature.');
           // Optional: Scroll to the signup form
          const signupSection = document.querySelector('#join-us');
           if (signupSection) {
               window.scrollTo({
                   top: signupSection.offsetTop - document.querySelector('header').offsetHeight - 20, // Adjust for header and spacing
                   behavior: 'smooth'
               });
           }
      } else {
          // Placeholder for actual action (e.g., add to cart, favorite)
           const actionText = link.textContent.trim().replace('(Login)', '').trim(); // Get text without the hint
           const item = link.closest('.product-card') || link.closest('.seller-card');
           const itemName = item ? (item.querySelector('h3') ? item.querySelector('h3').textContent.trim() : 'Item') : 'Unknown Item';
           alert(`User logged in. Performing action: "${actionText}" on "${itemName}". (This is a placeholder)`);
          // Here you would add actual logic (API calls, state updates, etc.)
      }
  });
});

// Simple Form Validation and Placeholder Signup
document.querySelector('#signup-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent actual form submission

  const role = document.getElementById('role').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (!name || !email || !password) {
      alert('Please fill in all required fields.');
      return; // Stop execution if validation fails
  }

  // Basic email format check (optional but good practice)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
  }

  // Simulate signup success
  alert(`Simulating signup for ${name} as a ${role}.\n(This is a placeholder. No data is saved.)`);

  // In a real application:
  // 1. Send data to backend server via Fetch API or XMLHttpRequest
  // 2. Handle server response (success/error)
  // 3. If successful, redirect to login or dashboard, or show success message.

  // For this demo, we'll just clear the form and simulate login status
  localStorage.setItem('loggedIn', 'true'); // Simulate successful login for guest actions
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';

  // Optional: Provide feedback
  alert('Signup simulated successfully! You are now "logged in" for demo purposes. Try the product actions.');

  // You might want to redirect or change UI state here in a real app
});