/* eslint-disable no-undef */
$(() => {
    $('.add-product-to-cart').on('click', function () {

        const productId = $(this).parent().find('input[type="hidden"][name="_id"]').val();

        $.ajax({
            url: `/api/products/add-cart/${productId}`,
            type: 'PUT',
            success: (response) => {
                toastr.success(response.message);
            },
            error: (error) => {
                toastr.error(error.responseJSON?.message);
            }
        });
    });
});