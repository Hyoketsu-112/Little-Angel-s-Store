document.addEventListener("DOMContentLoaded", () => {
    const productListContainer = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCountSpan = document.getElementById('cart-count');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    // New elements for promo code and customer details
    const promoCodeInput = document.getElementById('promo-code-input');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoMessageDiv = document.getElementById('promo-message');
    const discountItem = document.getElementById('discount-item');
    const cartDiscount = document.getElementById('cart-discount');
    const customerDetailsForm = document.getElementById('customer-details-form');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let discount = 0;

    // A list of valid promo codes and their discounts
    const promoCodes = {
        'SAVE10': 0.10, // 10% discount
        'FREESHIP': 0 // Placeholder for free shipping logic
    };

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Function to update cart count in the header
    const updateCartCount = () => {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalCount;
        }
    };

    // Function to render cart items on the page
    const renderCart = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <div class="item-price">₦${(product.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <span class="quantity-input">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            }
        });

        // Add event listeners to the new buttons
        attachEventListeners();
        updateSummary();
        updateCartCount();
    };

    // Function to update the subtotal and total
    const updateSummary = () => {
        const subtotal = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product.price * item.quantity);
        }, 0);
        
        let total = subtotal;

        // Apply discount if a valid one exists
        if (discount > 0) {
            const discountAmount = subtotal * discount;
            total = subtotal - discountAmount;
            
            if (discountItem) {
                discountItem.style.display = 'flex';
            }
            if (cartDiscount) {
                cartDiscount.textContent = `-₦${discountAmount.toLocaleString()}`;
            }
        } else {
            if (discountItem) {
                discountItem.style.display = 'none';
            }
        }

        if (cartSubtotal) {
            cartSubtotal.textContent = `₦${subtotal.toLocaleString()}`;
        }
        if (cartTotal) {
            cartTotal.textContent = `₦${total.toLocaleString()}`;
        }
    };

    // Function to add a product to the cart
    const addToCart = (productId) => {
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        alert(`${productToAdd.name} has been added to your cart!`);
    };

    // Attach event listeners for cart actions
    const attachEventListeners = () => {
        if (!cartItemsContainer) return;

        cartItemsContainer.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);

            // Handle quantity increase
            if (e.target.classList.contains('increase-btn')) {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    saveCart();
                    renderCart();
                }
            }

            // Handle quantity decrease
            if (e.target.classList.contains('decrease-btn')) {
                const item = cart.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    saveCart();
                    renderCart();
                } else if (item && item.quantity === 1) {
                    // Remove item if quantity is 1 and decreased
                    cart = cart.filter(i => i.id !== id);
                    saveCart();
                    renderCart();
                }
            }

            // Handle item removal
            if (e.target.closest('.remove-item')) {
                cart = cart.filter(i => i.id !== id);
                saveCart();
                renderCart();
            }
        });
    };

    // Event listener for the promo code button
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            if (promoCodes[code]) {
                discount = promoCodes[code];
                promoMessageDiv.textContent = 'Promo code applied successfully!';
                promoMessageDiv.classList.remove('error');
                promoMessageDiv.classList.add('success');
            } else {
                discount = 0;
                promoMessageDiv.textContent = 'Invalid promo code.';
                promoMessageDiv.classList.remove('success');
                promoMessageDiv.classList.add('error');
            }
            updateSummary();
        });
    }

    // Add event listener for the checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Validate the customer details form
            if (customerDetailsForm.checkValidity()) {
                alert('Order placed successfully! Thank you for shopping with us.');
                // Here you would clear the cart and redirect
                cart = [];
                saveCart();
                renderCart();
                // Optional: Redirect to a confirmation page
                // window.location.href = 'confirmation.html';
            } else {
                // Trigger browser's native validation UI
                customerDetailsForm.reportValidity();
            }
        });
    }

    // Call renderCart initially to display items on page load
    renderCart();

    // Export the addToCart function so it can be used by app.js
    window.addToCart = addToCart;
});