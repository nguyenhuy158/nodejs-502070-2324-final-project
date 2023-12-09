/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//Focus el	ement on sidebar
const sideLinks = document.querySelectorAll(
	".sidebar .side-menu li a:not(.logout)"
);

sideLinks.forEach((item) => {
	const li = item.parentElement;
	item.addEventListener("click", () => {
		sideLinks.forEach((i) => {
			i.parentElement.classList.remove("active");
		});
		li.classList.add("active");
	});
});

//Toggle sidebar
const menuBar = document.querySelector(".content nav .bx.bx-menu");
const sideBar = document.querySelector(".sidebar");

menuBar.addEventListener("click", () => {
	sideBar.classList.toggle("close");
});

//Search Bar
const searchBtn = document.querySelector(
	".content nav form .form-input button"
);
const searchBtnIcon = document.querySelector(
	".content nav form .form-input button .bx"
);
const searchForm = document.querySelector(".content nav form");

// TODO uncomment
// searchBtn.addEventListener("click", function (e) {
// 	if (window.innerWidth < 576) {
// 		e.preventDefault;
// 		searchForm.classList.toggle("show");
// 		if (searchForm.classList.contains("show")) {
// 			searchBtnIcon.classList.replace("bx-search", "bx-x");
// 		} else {
// 			searchBtnIcon.classList.replace("bx-x", "bx-search");
// 		}
// 	}
// });

window.addEventListener("resize", () => {
	if (window.innerWidth < 768) {
		sideBar.classList.add("close");
	} else {
		sideBar.classList.remove("close");
	}
	if (window.innerWidth > 576) {
		// searchBtnIcon.classList.replace("bx-x", "bx-search");
		searchForm.classList.remove("show");
	}
});

// THEME TOGGLE
const toggler = document.getElementById("theme-toggle");
toggler.addEventListener("change", function () {
	if (this.checked) {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
});
// THEME TOGGLE

// TODO: just change
function reloadTable() {
	$('span:contains("Reload")').trigger('click');
}

// function formatCurrency(input) {
// 	const numericValue = input.value.replace(/[^0-9.]/g, '');

// 	const formattedValue = new Intl.NumberFormat('vi-VN', {
// 		style: 'currency',
// 		currency: 'VND',
// 		minimumFractionDigits: 0,
// 	}).format(numericValue);

// 	input.value = formattedValue;
// }

// Convert form data to JSON
function formDataToJson(formData) {
	const json = {};
	formData.forEach((value, key) => {
		if (json[key]) {
			if (Array.isArray(json[key])) {
				json[key].push(value);
			} else {
				json[key] = [json[key], value];
			}
		} else {
			json[key] = value;
		}
	});
	return json;
}


// LOGOUT
$(() => {
	$('a.logout').off('click').on('click', function (e) {
		e.preventDefault();
		$.ajax({
			url: '/logout',
			method: 'GET',
			success: (response) => {
				toastr[response.error ? 'error' : 'success'](response.message);
				if (!response.error) {
					window.location.href = '/login';
				}
			}, error: (response) => {
				toastr[response.responseJSON?.error ? 'error' : 'success'](response.responseJSON?.message);
			}
		});
	});
});