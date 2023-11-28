/* eslint-disable no-undef */
$(() => {
    $('input[name="username"]').trigger('focus');

    $('#login').on('submit', (e) => {
        e.preventDefault();

        const username = $('input[name="username"]').val();
        const password = $('input[name="password"]').val();

        $.ajax({
            url: '/login',
            method: 'POST',
            data: {
                username,
                password
            },
            success: (response) => {
                console.log(`🚀 🚀 file: login.js:19 🚀 $ 🚀 response`, response);
                toastr[response.error ? 'error' : 'success'](response.message);
                if (!response.error) {
                    window.location.href = '/';
                }
            }, error: (response) => {
                console.log(response);
                toastr[response.responseJSON?.error ? 'error' : 'success'](response.responseJSON?.message);
            }
        });
    });
});