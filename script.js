// REFERENCE DOM ELEMENTS
import { menuArray } from './js/data.js';
const menuEl = document.getElementById('menu');
const orderEl = document.getElementById('section-order');
const totalPriceEl = document.getElementById('total-price');
const modalForm = document.querySelector('form');

let order = [];
// MODAL FORM EVENT LISTENER
modalForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameField = document.querySelector('#name');
    const cardNumber = document.querySelector('#cardNumber');
    const ccv = document.querySelector('#ccv');
    if (nameField.value.trim() === '' || cardNumber.value.trim() === '' || ccv.value.trim() === '') {
        return;
    }
    // REMOVES ORDER ITEMS LIST, TOTAL PRICE, PAYMENT FORM & RENDERS CONFIRMATION MESSAGE
    document.querySelectorAll('.order-item-wrapper').forEach(el => el.remove());
    document.querySelectorAll('.total-price-wrapper').forEach(el => el.remove());
    document.querySelectorAll('.btn-complete-order').forEach(el => el.remove());
    document.querySelectorAll('.section-modal').forEach(el => el.remove());

    const confirmationTemplate = `
        <div id="section-confirmation">
            <p>Thanks, ${nameField.value}! Your order is on its way!</p>
        </div>
    `;
    orderEl.innerHTML = confirmationTemplate;

    // APPLY STYLES TO SECTION-CONFIRMATION WHEN ACTIVE
    const sectionConfirmation = document.querySelector('#section-confirmation');
    sectionConfirmation.style.display = 'flex';
    sectionConfirmation.style.backgroundColor = '#ecfdf5';
    sectionConfirmation.style.color = '#065f46';
    sectionConfirmation.style.fontSize = '28px';
    sectionConfirmation.style.padding = '50px 0';
    sectionConfirmation.style.margin = '40px auto';
    sectionConfirmation.style.justifyContent = 'center';
    sectionConfirmation.style.alignItems = 'center';
});

// ADDS ITEM TO SECTION-ORDER
function handleMenuClick(e) {
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-add-item')) {
        const id = e.target.getAttribute('data-id');
        const itemToAdd = menuArray.find(item => item.id === id);
        order.push(itemToAdd);
        refreshOrderAndTotal();
    }
}

// REMOVE ITEMS FROM SECTION-ORDER
function handleOrderClick(e) {
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-remove-item')) {
        const id = e.target.getAttribute('data-id');
        const index = order.findIndex(orderItem => orderItem.id === id);
        order.splice(index, 1);
        refreshOrderAndTotal();
    }
}
// CALCULATE ITEMS ADDED TO ORDER
function calculateTotal() {
    let total = 0;
    order.forEach(item => {
        total += item.price;
    });
    return total;
}
// RECALCULATES ADDED OR REMOVED ITEMS
function refreshOrderAndTotal() {
    orderHtml();
    // UPDATE THE TOTAL PRICE
    const total = calculateTotal();
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}
// RENDER MENU ITEMS ADDED TO THE SECTION ORDER
function orderHtml() {
    orderEl.innerHTML = '';
    if(order.length > 0) {
        orderEl.innerHTML = '<h2>Your Order</h2>';
        order.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item-wrapper');
            orderItem.innerHTML = `
                <div class="item-info">
                    <h2>${item.name}</h2>
                    <button class="btn-remove-item" data-id="${item.id}">Remove</button>
                </div>
                <h3>$${item.price}</h3>
            `;
            orderEl.appendChild(orderItem);
        });

        // APPEND THE TOTAL PRICE TO THE ORDER
        const totalOrder = document.createElement('div');
        totalOrder.innerHTML = `
        <hr>
        <div class="total-price-wrapper">
            <h2>Total Price:</h2>
            <h3>$${Math.round(calculateTotal())}</h3>
        </div>
        <button class="btn btn-complete-order">Complete Order</button>
        `;
        orderEl.appendChild(totalOrder);

        // EVENT LISTENER FOR COMPLETE ORDER BUTTON
        const orderCompleteBtnEL = document.querySelector('.btn-complete-order');
        orderCompleteBtnEL.addEventListener('click', function() {
            const modal = document.querySelector('#section-modal');
            modal.style.display = 'block';
            // DISABLES REMOVE ITEMS BUTTON WHEN BTN-COMPLETE-ORDER IS CLICKED
            const removeItemButtons = document.querySelectorAll('.btn-remove-item');
            removeItemButtons.forEach(function(button) {
                button.disabled = true;
            });
        });
    }
}
// RENDER MENU TO THE SECTION-MENU
function menuHtml() {
    menuArray.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-wrapper');
        menuItem.innerHTML = `
            <span class="menu-emoji">${item.emoji}</span>
            <div class="menu-info"> 
                <h2>${item.name}</h2>
                <p>${item.ingredients.join(', ')}</p>
                <h3>$${item.price}</h3>
            </div>
            <button class="btn-add-item" data-id="${item.id}" data-add="${item.id}">+</button>
        `;
        menuEl.appendChild(menuItem);
    });
}

menuHtml();
menuEl.addEventListener('click', handleMenuClick);
orderEl.addEventListener('click', handleOrderClick);

