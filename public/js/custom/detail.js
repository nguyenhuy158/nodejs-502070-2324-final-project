/* eslint-disable no-undef */
$(function () {

    // change main product thumbnail
    $('#btn-change-thumbnail').on('click', function () {
        const newMainThumbnail = $('#select-main-thumbnail').val();

        $.ajax({
            url: `/products/${productId}/main-thumbnail`,
            method: 'PUT',
            data: {
                imageUrls: newMainThumbnail,
            },
            success: function (response) {
                toastr.success(response.message || 'Change main thumbnail successfully');
                reloadThumbnail();
            },
            error: function (response) {
                toastr.error(response.responseJSON?.message || 'Error change thumbnail');
            },
        }).always(() => {
            $('#change-thumbnail-modal').modal('hide');
        });
    });

    $('#btn-add-thumbnail').on('click', () => {
        $('#upload-form').submit();
    });
    $('#upload-form').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: `/products/${productId}/imageUrls`,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                toastr.success(response.message || 'Add thumbnail successfully');
                reloadThumbnail();
            },
            error: function (response) {
                toastr.error(response.responseJSON?.message || 'Error add thumbnail');
            },
        }).always(() => {
            $('#add-thumbnail-modal').modal('hide');
        });
    });

    // remove product thumbnail
    $('#btn-remove-thumbnail').on('click', function () {
        const removeThumbnail = $('#select-remove-thumbnail').val();

        $.ajax({
            url: `/products/${productId}/imageUrls`,
            method: 'PUT',
            data: {
                imageUrls: removeThumbnail,
            },
            success: function (response) {
                toastr.success(response.message || 'Remove thumbnail successfully');
                reloadThumbnail();
            },
            error: function (response) {
                toastr.error(response.responseJSON?.message || 'Error remove thumbnail');
            },
        }).always(() => {
            $('#remove-thumbnail-modal').modal('hide');
        });

    });

    // add product to cart
    $('.add-product-to-cart').on('click', function () {
        const productId = $(this).data('product-id');

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


    $('.fotorama').fotorama();
    function reloadThumbnail() {
        $.ajax({
            url: `/api/products/${productId}`,
            type: 'GET',
            success: (response) => {
                // console.log(response);

                const data = response.imageUrls.map((imageUrl) => ({
                    img: imageUrl,
                    thumb: imageUrl,
                }));
                // console.log(`🚀 🚀 file: detail.js:101 🚀 data 🚀 data`, data);

                $('.fotorama').remove();
                $('.fotorama-container').append('<div class="fotorama" data-width="90%" data-nav="thumbs" data-ratio="800/700" data-allowfullscreen="true" data-loop="true" data-keyboard="true"></div>');
                $('.fotorama').fotorama({
                    data: data
                });
            },
            error: (response) => {
                toastr.error(response.responseJSON?.message);
            }
        });
    }
});