document.addEventListener('DOMContentLoaded', () => {

    /* ========== Helpers ========== */
    const CART_KEY = "bh_cart";  // sessionStorage key
    const ORDER_KEY = "bh_custom_orders";  // localStorage key (array)

    function readCart() {
        try {
            return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
        }
        catch {
            return [];
        }
    }

    function writeCart(cart) {
        sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function addItemToCart(item) {
        const cart = readCart();
        const existing = cart.find((x) => x.id === item.id);

        if (existing) {
            existing.qty += 1;
        }
        else {
            cart.push({ ...item, qty: 1 });
        }

        writeCart(cart);
    }

    function clearCart() {
        sessionStorage.removeItem(CART_KEY);
    }

    function cartTotal(cart) {
        return cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    }

    function formatMoney(n) {
        return `$${n.toFixed(2)}`;
    }

    function renderCartIntoModal() {
        const cart = readCart();

        /* ===== BEFORE-CLEAR PROOF
        alert('CURRENT DATA IS: ' + JSON.stringify(cart));
        ================================================== */

        const cartBox = document.querySelector(".cart_box");
        const totalE1 = document.querySelector(".cart_total_price");

        if (!cartBox || !totalE1) return;

        // Clear current rows
        cartBox.innerHTML = "";

        if (cart.length === 0) {
            // EMPTY state
            const empty = document.createElement("div");
            empty.className = "cart_row";
            empty.innerHTML = `<span>Your cart is empty.</span><span class="cart_price">$0.00</span>`;
            cartBox.appendChild(empty);
            totalE1.textContent = "$0.00";
            return;
        }

        // Render each row
        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "cart_row";
            row.innerHTML = `
                <span>${item.name}: x${item.qty}</span>
                <span class="cart_price">${formatMoney(item.price * item.qty)}</span>
            `;
            cartBox.appendChild(row);
        });

        totalE1.textContent = formatMoney(cartTotal(cart));
    }

    /* ========== Shopping Modal ========== */
    const cartModal = document.getElementById('cartModal');
    const openCartBtn = document.getElementById('openCartBtn');
    const cartNote = document.getElementById('cartNote');
    const cartProcessBtn = document.getElementById('cartProcessBtn');
    const cartClearBtn = document.getElementById('cartClearBtn');
    
    function openCart(){
        if (!cartModal) return;
        renderCartIntoModal();  // Reads sessionStorage into modal
        cartModal.classList.add('is-open');
        cartModal.setAttribute('aria-hidden', 'false');
        if (cartNote) cartNote.textContent = "";
    }

    function closeCart(){
        if (!cartModal) return;
        cartModal.classList.remove('is-open');
        cartModal.setAttribute('aria-hidden', 'true');
    }
    
    openCartBtn?.addEventListener('click', openCart);
    
    cartModal?.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.dataset && t.dataset.close === 'true') closeCart();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal?.classList.contains('is-open')) closeCart();
    });
    
    // Process order, must clear sessionStorage
    cartProcessBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        clearCart();
        renderCartIntoModal();
        if (cartNote) cartNote.textContent = '"Thank you for your order!"';
        alert('Thank you for your order.');
    });
    
    // Clear cart, must clear sessionStorage
    cartClearBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        clearCart();
        renderCartIntoModal();
        if (cartNote) cartNote.textContent = "";
        alert('Cart cleared.');
    });

    /* ===== Add to Cart (Gallery/Home) sessionStorage ===== */
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Read data from button (for storage)
            const id = btn.dataset.id || btn.getAttribute('data-id');
            const name = btn.dataset.name || btn.getAttribute('data-name') || 'Item';
            const priceRaw = btn.dataset.price || btn.getAttribute('data-price') || '0';
            const price = Number(priceRaw);

            if (!id || Number.isNaN(price)) {
                alert('Item data is missing (data-id / data-price).');
                return;
            }

            addItemToCart({ id, name, price });
            alert('Item added to the cart.');
        });
    });

    // Subscribe alert for all pages
    document.querySelectorAll('.newsletter-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();  // See alert consistently, stops reload
            alert('Thank you for subscribing.');
        });
    });

    /* ===== About Us/Contact Us Forms (for localStorage) ===== */
    function readOrders() {
        try {
            return JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
        }
        catch {
            return [];
        }
    }

    function writeOrders(orders) {
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    }

    document.querySelectorAll('.contact-form, .contact-mini-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());

            // Add metadata for tracking
            const submission = {
                ...data,
                submittedAt: new Date().toISOString(),
                page: document.body.className || 'unknown'
            };

            const orders = readOrders();
            orders.push(submission);
            writeOrders(orders);

            alert("Thank you for your message!");

            form.reset();
        });
    });

    /* ======= Hamburger Menu toggle (vertical dropdown menu) ======= */
    const navToggleBtn = document.getElementById('navToggleBtn');
    const primaryNav = document.getElementById('primaryNav');

    if (navToggleBtn && primaryNav) {
        navToggleBtn.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('is-open');
            navToggleBtn.setAttribute('aria-expanded', String(isOpen));
            navToggleBtn.setAttribute('aria-label', isOpen ? "Close menu" : "Open menu");
        });
    }

    /* Close menu after clicking nav link on mobile */
    primaryNav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (primaryNav.classList.contains('is-open')) {
                primaryNav.classList.remove('is-open');
                navToggleBtn?.setAttribute('aria-expanded', 'false');
                navToggleBtn?.setAttribute('aria-label', 'Open menu');
            }
        });
    });

});