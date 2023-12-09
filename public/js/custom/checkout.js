/* eslint-disable no-undef */

$(() => {
    // $("#phone-number").on('type', function (e) {
    //     $(this).val(libphonenumber.parsePhoneNumber('0837377853', "VN").formatNational());
    // })

    // reset money
    $('#total-money').val(VND(0).format());
    $('#given-money').val(VND(0).format());
    $('#exchange-money').val(VND(0).format());
    

    // custom input given money
    $('#input-given-money').val(VND(0).format());
    $('#input-given-money').on('input', function (e) {
        if (e.originalEvent.inputType === 'deleteContentBackward') {
            $(this).val(
                VND(
                    Math.floor(VND($(this).val()).value / 10)
                ).format()
            );
        } else {
            $(this).val(VND($(this).val()).format());
        }
        updateCart();
    });

    // checkout and print recipe
    $('.btn-checkout').on('click', function () {
        if (!isCanCheckout()) {
            return;
        }
        $.ajax({
            url: `/checkout`,
            type: 'POST',
            data: {
                phone: $('#phone-number').val(),
                fullName: $('#full-name').val(),
                address: $('#address').val(),
                region: $('#regions').val(),
                district: $('#districts').val(),
                ward: $('#wards').val(),
                givenAmount: VND($('#given-money').text()).value,
            },
            success: (response) => {
                console.log(`🚀 🚀 file: 🚀 response`, response);
                toastr.success(response.message);
                
                clearCart();
                
                // print recipe
                $('#frMauIn').attr('src', `/checkout/recipe/${response.order._id}`);
                setTimeout(function () {
                    window.frames["frMauIn"].focus();
                    window.frames["frMauIn"].print();
                }, 3000);
            },
            error: (error) => {
                console.log(`🚀 🚀 file: 🚀 error`, error.responseJSON);
                toastr.error(error.responseJSON?.message);
            }
        });
    });

    loadInfoCart();

    $('#phone-number').on('blur', function () {
        loadInfoCustomer();
    });

    $('#load-customer').on('click', function () {
        loadInfoCustomer();
    });
});
