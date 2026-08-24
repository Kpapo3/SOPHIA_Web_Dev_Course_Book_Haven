const cartModal = document.getElementById('cartModal');
const openCartBtn = document.getElementById('openCartBtn');
const cartNote = document.getElementById('cartNote');
const cartProcessBtn = document.getElementById('cartProcessBtn');
const cartClearBtn = document.getElementById('cartClearBtn');

function openCart(){
    cartModal.classList.add('is-open');
    cartModal.setAttribute('aria-hidden', 'false');
    cartNote.textContent = '';
}

function closeCart(){
    cartModal.classList.remove('is-open');
    cartModal.setAttribute('aria-hidden', 'true');
}

openCartBtn?.addEventListener('click', openCart);

cartModal?.addEventListener('click', (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close === 'true') {
            closeCart();
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('is-open')) {
            closeCart();
    }
});
    
cartProcessBtn?.addEventListener('click', () => {
    cartNote.textContent = '"Thank you for your order!"';
});
    
cartClearBtn?.addEventListener('click', () => {
// demo behavior: clear rows + totals (replace with real cart logic later)
    document.querySelectorAll('.cart_row').forEach(r => r.remove());
    document.querySelector('.cart_total_price').textContent = '$0.00';
    cartNote.textContent = '';
});