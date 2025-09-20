document.addEventListener("DOMContentLoaded", () => {
    const productListContainer = document.getElementById('product-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

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
                window.addToCart(productId);
            });
        });
    };

    // Filter products based on active category
    const filterProducts = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('filter');
        let activeCategory = urlCategory || 'all';
        
        // Check for active class from filter buttons
        const activeButton = document.querySelector('.filter-btn.active');
        if (activeButton) {
            activeCategory = activeButton.dataset.category;
        }
        
        const filtered = products.filter(product => {
            return activeCategory === 'all' || product.category === activeCategory;
        });
        
        renderProducts(filtered);
    };

    // Event listeners for filter buttons on category page
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterProducts();
            });
        });

        // Handle URL parameter on page load
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('filter');
        if (urlCategory) {
            filterButtons.forEach(btn => {
                if (btn.dataset.category === urlCategory) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    // Initial render of products on page load
    filterProducts();
});