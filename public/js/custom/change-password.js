
$(() => {

    $('#change-password').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = formDataToJson(formData);
        console.log(`🚀 🚀 file: change-password.js:10 🚀 data`, data);

        $.ajax({
            url: `/change-password`,
            type: 'POST',
            data: data,
            success: (response) => {
                console.log(`🚀 🚀 file: 🚀 response`, response);
                toastr[response.error ? 'error' : 'success'](response.message);
                if (!response.error) {
                    $('#change-password').trigger('reset');
                }
            },
            error: (error) => {
                console.log(`🚀 🚀 file: 🚀 error`, error.responseJSON);
                toastr[error.responseJSON?.error ? 'error' : 'success'](error.responseJSON?.message);
            }
        });
    });

});