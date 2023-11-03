// -------------------------------------- 
// ******************  js functions for checkout page
// -------------------------------------- 


'use strict';

// const decrementBtn = document.querySelectorAll('#decrement');
// const quantityElement = document.querySelectorAll('#quantity');
// const incrementBtn = document.querySelectorAll('#increment');
const priceElement = document.querySelectorAll('#price');
const subtotalElement = document.querySelector('#subtotal');
const taxElement = document.querySelector('#tax');
const totalElement = document.querySelector('#total');


// for (let i = 0; i < incrementBtn.length; i++) {
//     incrementBtn[i].addEventListener('click', function () {
//         // get quantity value based on clicked 'increment' button sibling  
//         let increment = Number(this.previousElementSibling.textContent);

//         increment++;

//         // show the increment variable value
//         this.previousElementSibling.textContent = increment;

//         totalCalc();
//     });


//     decrementBtn[i].addEventListener('click', function () {
//         // get quantity value based on clicked 'decrement' button sibling  
//         let decrement = Number(this.nextElementSibling.textContent);
    
//         decrement = decrement <= 1 ? 1 : decrement - 1;
    
//         // show the decrement variable value
//         this.nextElementSibling.textContent = decrement;
    
//         totalCalc();
//     });
// }

document.querySelectorAll(".product-card").forEach((productCard) => {
    const quantityElement = productCard.querySelector("#quantity");
    const incrementButton = productCard.querySelector("#increment");
    const decrementButton = productCard.querySelector("#decrement");

    incrementButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityElement.textContent);
        const newQuantity = currentQuantity + 1;
        quantityElement.textContent = newQuantity;
        updatePrices();
    });

    decrementButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityElement.textContent);
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            quantityElement.textContent = newQuantity;
            updatePrices();
        }
    });
});

const totalCalc = function () {
    const tax = 0.05;
    let subtotal = 0;
    let totalTax = 0;
    let total = 0;

    // calculating subtotal value
    for (let i = 0; i < quantityElement.length; i++) {
        subtotal += Number(quantityElement[i].textContent) * Number(priceElement[i].textContent);
    }

    // show subtotal variable value on subtotalElement
    subtotalElement.textContent = subtotal.toFixed(2);

    // calculate totalTax
    totalTax = subtotal * tax;

    // show totalTax on taxElement
    taxElement.textContent = totalTax.toFixed(2);

    // calculate total
    total = subtotal + totalTax;

    // show total on totalElement
    totalElement.textContent = total.toFixed(2);
}