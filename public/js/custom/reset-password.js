/* eslint-disable no-undef */
$(() => {
	$('form').on('submit', function (e) {
		showSpinner();
		e.preventDefault();

		const email = $('input[name="email"]').val();
		$.ajax({
			url: '/reset-password',
			type: 'post',
			data: {
				email
			},
			success: function (data) {
				toastr[data.error ? 'error' : 'success'](data.message);
				if (!data.error) {
					$('form').trigger('reset');
				}
			},
			error: function (error) {
				toastr.error(error.responseJSON?.message);
			}
		}).always(() => {
			hideSpinner();
		});
	});
});