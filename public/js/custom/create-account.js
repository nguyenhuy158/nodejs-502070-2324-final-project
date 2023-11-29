/* eslint-disable no-undef */
$(() => {
    $('#create-account').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: '/api/users',
            type: 'POST',
            data: formDataToJson(formData),
            success: (response) => {
                console.log(` response`, response);
                toastr.success(response.message);
                this.reset();
            },
            error: (error) => {
                console.log(` error`, error.responseJSON);
                toastr.error(error.responseJSON?.message);
            }
        });
    });
});
