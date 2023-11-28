/* eslint-disable no-undef */
$(() => {
	$('form').on('submit', function (e) {
		e.preventDefault();

		const email = $('input[name="email"]').val();
		$.ajax({
			url: '/password-reset',
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
		});
	});
});