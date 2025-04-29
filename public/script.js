document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      menuToggle.textContent = isExpanded ? '✕' : '☰';
  });

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href').substring(1);
          scrollToSection(targetId);
          // Close mobile menu if open
          if (navLinks.classList.contains('active')) {
              navLinks.classList.remove('active');
              menuToggle.setAttribute('aria-expanded', 'false');
              menuToggle.textContent = '☰';
          }
      });
  });

  // Smooth Scrolling Function (defined globally for the inline onclick)
  window.scrollToSection = function(sectionId) { // Changed to be globally accessible
      const section = document.getElementById(sectionId);
      if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
      }
  }

  // Join Popup Form
  const joinButtons = document.querySelectorAll('.cta-button');
  let popupForm = null;
  let escapeKeyListener = null; // To store listener reference for removal
  let focusTrapListener = null; // To store listener reference for removal
  let outsideClickListener = null; // To store listener reference for removal

  joinButtons.forEach(button => {
      // Check if the button is specifically the "Join eTinda Now" button
      // It's better to add an ID or data-attribute in HTML, but checking text works for now.
      if (button.textContent.trim() === 'Join eTinda Now') {
          button.addEventListener('click', (e) => {
              e.preventDefault();
              showJoinPopup();
          });
      }
      // Note: The other button "Start Selling Today" uses an inline onclick="scrollToSection('join')"
      // which needs the scrollToSection function to be global.
  });

  function showJoinPopup() {
      // Remove existing popup if it exists
      if (popupForm) {
          popupForm.remove();
      }

      // Create Popup
      popupForm = document.createElement('div');
      popupForm.classList.add('popup'); // Needs corresponding CSS
      popupForm.setAttribute('role', 'dialog');
      popupForm.setAttribute('aria-modal', 'true'); // Added aria-modal
      popupForm.setAttribute('aria-labelledby', 'popup-title');
      popupForm.innerHTML = `
          <div class="popup-content"> // Needs corresponding CSS
              <button type="button" class="close-popup" aria-label="Close dialog">&times;</button> // Moved close button up, added aria-label
              <h3 id="popup-title">Join eTinda</h3>
              <p>Start selling your sustainable products today!</p>
              <form id="join-form">
                  <label for="seller-name">Name:</label>
                  <input type="text" id="seller-name" name="name" maxlength="50" required aria-required="true">
                  <label for="seller-email">Email:</label>
                  <input type="email" id="seller-email" name="email" maxlength="100" required aria-required="true">
                  <label for="store-name">Store Name:</label>
                  <input type="text" id="store-name" name="store-name" maxlength="50" required aria-required="true">
                  <button type="submit">Submit</button>
              </form>
          </div>
      `;

      document.body.appendChild(popupForm);
      // Focus the close button initially for better accessibility
      const closeButton = popupForm.querySelector('.close-popup');
      closeButton.focus();

      // Trap focus within the popup
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusableElement = popupForm.querySelectorAll(focusableElements)[0];
      const focusableContent = popupForm.querySelectorAll(focusableElements);
      const lastFocusableElement = focusableContent[focusableContent.length - 1];

      focusTrapListener = (e) => trapFocus(e, firstFocusableElement, lastFocusableElement);
      document.addEventListener('keydown', focusTrapListener);

      // Handle Form Submission (Client-Side Only for Now)
      const form = popupForm.querySelector('#join-form');
      form.addEventListener('submit', handleFormSubmit);

      // Close Popup Button
      closeButton.addEventListener('click', closePopup);

      // Close on Escape Key
      escapeKeyListener = (e) => handleEscape(e);
      document.addEventListener('keydown', escapeKeyListener);

      // Close on clicking outside the popup content
      outsideClickListener = (e) => handleOutsideClick(e);
      popupForm.addEventListener('click', outsideClickListener);

      function handleFormSubmit(e) {
          e.preventDefault();
          const name = form.querySelector('#seller-name').value;
          const email = form.querySelector('#seller-email').value;
          const storeName = form.querySelector('#store-name').value;

          if (name && email && storeName) {
              alert(`Thank you, ${name}! We'll reach out to ${email} to help you set up ${storeName} on eTinda.`);
              closePopup();
          } else {
              alert('Please fill out all fields.');
          }
      }

      function handleEscape(e) {
          if (e.key === 'Escape' && popupForm) {
              closePopup();
          }
      }

      function handleOutsideClick(e) {
          if (e.target === popupForm) { // Clicked on the background overlay
              closePopup();
          }
      }

      function trapFocus(e, firstFocusableElement, lastFocusableElement) {
          let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
          if (!isTabPressed || !popupForm) {
              return;
          }

          if (e.shiftKey) { // Shift + Tab
              if (document.activeElement === firstFocusableElement) {
                  lastFocusableElement.focus();
                  e.preventDefault();
              }
          } else { // Tab
              if (document.activeElement === lastFocusableElement) {
                  firstFocusableElement.focus();
                  e.preventDefault();
              }
          }
      }

      function closePopup() {
          if (popupForm) {
              document.removeEventListener('keydown', escapeKeyListener);
              document.removeEventListener('keydown', focusTrapListener);
              // No need to remove outsideClickListener from popupForm as it gets removed with the element
              popupForm.remove();
              popupForm = null;
              escapeKeyListener = null;
              focusTrapListener = null;
              outsideClickListener = null;
              // Optionally return focus to the button that opened the popup
              joinButtons.forEach(button => {
                  if (button.textContent.trim() === 'Join eTinda Now') {
                      button.focus();
                  }
              });
          }
      }
  } // End of showJoinPopup

  // Ensure Keyboard Navigation for Accessibility
  document.querySelectorAll('.nav-links a, .cta-button').forEach(element => {
      element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              element.click();
          }
      });
  });
});
