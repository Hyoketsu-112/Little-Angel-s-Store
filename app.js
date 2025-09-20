document.addEventListener("DOMContentLoaded", () => {
    // javascript for landing page containing mobile toggle and category drop-down
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const categoryDropdown = document.querySelector('.category-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    function toggleMobileMenu() {
        headerNav.classList.toggle('active');
    }

    function toggleCategoryDropdown(event) {
        event.preventDefault(); 
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (categoryDropdown) {
        categoryDropdown.addEventListener('click', toggleCategoryDropdown);
    }

    // Toggle heart icon on product cards
    document.querySelectorAll('.product-card .heart i').forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('fa-solid');
            icon.classList.toggle('fa-regular');
        });
    });

    // Smooth scroll for hero buttons
    const shopNowBtn = document.querySelector('.peculiar-btn-1');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default button action
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const giftPackagesBtn = document.querySelector('.peculiar-btn-2');
    if (giftPackagesBtn) {
        giftPackagesBtn.addEventListener('click', () => {
            window.location.href = 'gift-package.html';
        });
    }

    // --- Dynamic Product Grid Rendering ---
    const productListContainer = document.getElementById('product-list');

    // Function to render products
    const renderProducts = (productsToRender) => {
        if (!productListContainer) return;
        productListContainer.innerHTML = ''; // Clear previous products

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <div class="image-wrapper">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <div class="tag">New</div>
                    <div class="heart">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                </div>
                <div class="info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <div class="price">₦${product.price.toLocaleString()}</div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productListContainer.appendChild(productCard);
        });

        // Add event listeners to the new "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                window.addToCart(productId); // Call the global function from cart.js
            });
        });
    };

    // --- Search & Category Filtering ---
    const searchInput = document.getElementById('search-input');
    const categoryItems = document.querySelectorAll('.category-item');

    // Filter products based on search query and category
    const filterProducts = () => {
        const query = searchInput.value.toLowerCase();
        let activeCategory = null;

        categoryItems.forEach(item => {
            if (item.classList.contains('active')) {
                activeCategory = item.dataset.category;
            }
        });
        
        const filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
            const matchesCategory = activeCategory === 'lookbook' || !activeCategory || product.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
        
        renderProducts(filtered);
    };

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Event listeners for category items
    if (categoryItems) {
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Toggle active class and filter
                categoryItems.forEach(i => i.classList.remove('active'));
                if (item.dataset.category !== 'lookbook') {
                    item.classList.add('active');
                    filterProducts();
                }
            });
        });
    }

    // Initial render of all products on page load
    renderProducts(products);

    // Update cart count on page load
    const updateCartCount = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountSpan = document.getElementById('cart-count');
        if (cartCountSpan) {
            cartCountSpan.textContent = totalCount;
        }
    };
    updateCartCount();

    // --- Login and Signup Logic ---
    const loginContainer = document.getElementById('login-container');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Toggle between login and sign-up forms
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('active');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.remove('active');
        });
    }

    // Handle form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic client-side validation
            const email = e.target.querySelector('#login-email').value;
            const password = e.target.querySelector('#login-password').value;

            if (email && password) {
                alert('Login successful! Redirecting to home page...');
                window.location.href = 'index.html'; // Redirect to home page on successful login
            } else {
                alert('Please enter both email and password.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic client-side validation
            const name = e.target.querySelector('#signup-name').value;
            const email = e.target.querySelector('#signup-email').value;
            const password = e.target.querySelector('#signup-password').value;

            if (name && email && password) {
                alert('Sign-up successful! You can now log in.');
                loginContainer.classList.remove('active'); // Switch back to login form
            } else {
                alert('Please fill out all fields.');
            }
        });
    }
});