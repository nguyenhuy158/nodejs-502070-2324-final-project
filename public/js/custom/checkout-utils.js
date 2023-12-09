/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function updateCart() {
    // update total bill
    let totalBill = 0;
    $(".product-card").each(function (index, element) {
        const price = $(element).find(".price").text();
        const quantity = $(element).find(".quantity").text();
        const total = VND(price).value * (+quantity);
        totalBill += total;
    });
    $("#total-money").text(VND(totalBill).format());

    // update total product
    $('#total-products').text($(".product-card").length);

    // update given money
    const total = parseFloat(currency($('#total-money').text()).value);
    const given = parseFloat(VND($('#input-given-money').val()).value);
    if (isNaN(given)) {
        $('#given-money').text('');
        $('#exchange-money').text('');
    } else {
        let exchange = given - total;
        $('#given-money').text(VND(given).format());
        exchange = exchange >= 0 ? exchange : 0;
        $('#exchange-money').text(VND(exchange).format());
    }
    getTotalQuantiy();
}

function loadInfoCart() {
    $.ajax({
        url: `/api/carts/current`,
        type: 'GET',
        success: (response) => {
            // console.log(`🚀 🚀 file: 🚀 response`, response.cart);
            toastr.success(response.message);

            if (response.cart?.products) {
                $("#products-container").text("");
                response.cart?.products.forEach((p) => {
                    // console.log(`🚀 🚀 file: checkout.js:26 🚀 p`, p);
                    const productData = {
                        _id: p.product._id,
                        imageUrl: p.product.imageUrls[0],
                        name: p.product.productName,
                        quantity: p.quantity,
                        price: p.product.retailPrice,
                        desc: p.product.desc || ''
                    };
                    $("#products-container").createProductCardAndAppend(productData);
                });

                updateCart();
            }
        },
        error: (error) => {
            // console.log(`🚀 🚀 file: 🚀 error`, error.responseJSON);
            toastr.error(error.responseJSON?.message);
        }
    });
}

function loadInfoCustomer() {
    const phone = $('#phone-number').val();

    // validate phone number
    const validPhoneNumberPattern = /^0\d{9}$/;
    if (!validPhoneNumberPattern.test(phone)) {
        toastr.error('Invalid phone number format');
        return;
    }

    $('#load-customer i').addClass('bx-spin');
    $.ajax({
        url: `/api/customers/${phone}`,
        method: 'GET',
        success: function (response) {
            const customer = response.customer;

            if (customer) {
                toastr.success(response.message);

                $(`input[name="fullName"]`).val(customer.fullName);
                $(`input[name="address"]`).val(customer.address.address);
            } else {
                toastr.error(response.message);
            }
        },
        error: function (error) {
            toastr.error(error.responseJSON?.message);
        }
    }).always(function () {
        setTimeout(() => {
            $('#load-customer i').removeClass('bx-spin');
        }, 1000);
    });
}

function addProductToCartById(productId) {
    $.ajax({
        url: `/api/products/add-cart/${productId}`,
        type: 'PUT',
        success: (response) => {
            console.log(`🚀 🚀 file: 🚀 response`, response);
            toastr.success(response.message);
        },
        error: (error) => {
            console.log(`🚀 🚀 file: 🚀 error`, error.responseJSON);
            toastr.error(error.responseJSON?.message);
        }
    });
}

function isCanCheckout() {
    const phone = $('#phone-number').val();
    const fullName = $('#full-name').val();
    const address = $('#address').val();
    const region = $('#regions').val();
    const district = $('#districts').val();
    const ward = $('#wards').val();
    const givenAmount = VND($('#given-money').text()).value;
    const totalBill = VND($('#total-money').text()).value;

    if (!phone || !fullName || !address || !region || !district || !ward) {
        toastr.error('Please fill in all the information');
        return false;
    }
    if ($('#products-container').find('.product-card').length <= 0) {
        toastr.error('Please add at least one product');
        return false;
    }
    if (givenAmount < totalBill) {
        toastr.error('Given amount must be greater than total bill');
        return false;
    }
    return true;
}

function clearCart() {
    $('#products-container').text('');
    updateCart();
    $('#customer-info').trigger('reset');
    $('#given-money').text(VND(0).format())
    $('#exchange-money').text(VND(0).format())

    $('#regions').val(null).trigger('change');
    $('#districts').val(null).trigger('change').attr('disabled', true);
    $('#wards').val(null).trigger('change').attr('disabled', true);
}


$(document).off('click', '.btn-decrement, .btn-increment').on('click', '.btn-decrement, .btn-increment', function () {

    const productCard = $(this).parents('[data-id]').first();
    const productId = productCard.data('id');
    // console.log(`🚀 🚀 file: checkout.js:22 🚀 productId`, productId);

    const quantity = $(this).siblings('.quantity');
    const quantityValue = quantity.text();

    let action = '';
    if (!isNaN(quantityValue)) {
        if (this.classList.contains('btn-decrement') && quantityValue > 1) {
            quantity.text(+quantityValue - 1);
            action = 'decrement';
        }
        if (this.classList.contains('btn-increment') && quantityValue > 0) {
            quantity.text(+quantityValue + 1);
            action = 'increment';
        }
        if (action !== '') {
            $.ajax({
                url: `/api/carts/products/${productId}/${action}`,
                type: 'PUT',
                success: function (response) {
                    // console.log(`🚀 🚀 file: checkout.js:35 🚀 response`, response);
                    updateCart();
                },
                error: function (error) {
                    // console.log(`🚀 🚀 file: checkout.js:38 🚀 error`, error.responseJSON?.message);
                    toastr.error('Update fail');
                    quantity.text(+quantityValue);
                }
            });
        }

    }
});

$(document).off('click', '.btn-remove-product').on('click', '.btn-remove-product', function () {
    const productCard = $(this).parents('[data-id]').first();
    const productId = productCard.data('id');
    // console.log(`🚀 🚀 file: checkout.js:22 🚀 productId`, productId);

    $.ajax({
        url: `/api/carts/products/${productId}`,
        type: 'DELETE',
        success: function (response) {
            // console.log(`🚀 🚀 file: checkout.js:35 🚀 response`, response);
            productCard.remove();
            toastr.success('Remove product success');
            updateCart();
        },
        error: function (error) {
            // console.log(`🚀 🚀 file: checkout.js:38 🚀 error`, error.responseJSON?.message);
            toastr.error('Remove product fail');
        }
    });
});

