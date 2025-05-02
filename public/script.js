document.addEventListener('DOMContentLoaded', () => {
    // Toggle mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
  
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  
    // Sample product data (replace with API call in production)
    const products = [
      {
        id: 1,
        name: 'Organic Handwoven Basket',
        price: 500,
        image: '../images/sample-product.jpg',
      },
      // Add more products as needed
    ];
  
    // Populate product grid
    const productGrid = document.querySelector('.product-grid');
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>₱${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productGrid.appendChild(card);
    });
  
    // Cart functionality
    let cart = [];
    productGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const productId = e.target.getAttribute('data-id');
        const product = products.find(p => p.id == productId);
        cart.push(product);
        alert(`${product.name} added to cart!`);
        // Update cart UI or send to server in production
      }
    });
  
    // Admin Dashboard (placeholder, assumes admin page exists)
    if (document.querySelector('.admin-dashboard')) {
      // Sample user data (replace with API call)
      const users = [
        { id: 1, name: 'Maria Cruz', role: 'Buyer', status: 'Active' },
        { id: 2, name: 'Carlo Reyes', role: 'Seller', status: 'Pending' },
      ];
  
      const userTableBody = document.querySelector('.user-table tbody');
      if (userTableBody) {
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>
              <button class="action-button" data-id="${user.id}" data-action="approve">Approve</button>
              <button class="action-button" data-id="${user.id}" data-action="deactivate">Deactivate</button>
            </td>
          `;
          userTableBody.appendChild(row);
        });
  
        userTableBody.addEventListener('click', (e) => {
          if (e.target.classList.contains('action-button')) {
            const userId = e.target.getAttribute('data-id');
            const action = e.target.getAttribute('data-action');
            alert(`Action: ${action} for user ID ${userId}`);
            // In production, send API request to update user status
          }
        });
      }
    }
  });