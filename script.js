document.addEventListener('DOMContentLoaded', () => {
    /* ========== Shopping Modal ========== */
    const cartModal = document.getElementById('cartModal');
    const openCartBtn = document.getElementById('openCartBtn');
    const cartNote = document.getElementById('cartNote');
    const cartProcessBtn = document.getElementById('cartProcessBtn');
    const cartClearBtn = document.getElementById('cartClearBtn');
    
    function openCart(){
        if (!cartModal) return;
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
    
    cartProcessBtn?.addEventListener('click', () => {
        if (cartNote) cartNote.textContent = '"Thank you for your order!"';
        alert('Thank you for your order.');
    });
    
    cartClearBtn?.addEventListener('click', () => {
        document.querySelectorAll('.cart_row').forEach((r) => r.remove());
        const total = document.querySelector('.cart_total_price');
        if (total) total.textContent = "$0.00";
        if (cartNote) cartNote.textContent = "";
        alert('Cart cleared.');
    });

    // Subscribe alert for all pages
    document.querySelectorAll('.newsletter-form').forEach((btn) => {
        btn.addEventListener('submit', (e) => {
            e.preventDefault();  // See alert consistently, stops reload
            alert('Thank you for subscribing.');
        });
    });

    // Add to Cart alert (Gallery and Home)
    if (document.body.classList.contains('page-gallery') || document.body.classList.contains('page-home')) {
        document.querySelectorAll('.add-to-cart').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Item added to the cart.');
            });
        });
    }

    // Contact form submit alert (About/Contact page)
    document.querySelectorAll('.contact-form, .contact-mini-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message.');
        });
    });
});