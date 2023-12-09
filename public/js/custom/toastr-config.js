
/* eslint-disable no-undef */
$(() => {
    const notification = JSON.parse(localStorage.getItem('notification')) || undefined;

    if (notification) {
        const notificationType = Object.keys(notification)[0];
        if (notificationType !== undefined && notificationType !== null) {
            const notificationMessage = notification[notificationType][0];

            if (notificationType === 'error') {
                toastr.error(notificationMessage);
            } else {
                toastr.success(notificationMessage);
            }

            localStorage.removeItem('notification');
        }
    }
});

toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    onclick: null,
    showDuration: '3000',
    hideDuration: '3000',
    timeOut: '5000',
    extendedTimeOut: '5000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
};