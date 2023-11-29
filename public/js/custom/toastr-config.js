
/* eslint-disable no-undef */
$(() => {
    const notification = JSON.parse(localStorage.getItem('notification')) || undefined;
    console.log(`🚀 🚀 file: toastr-config.js:5 🚀 notification`, notification);

    if (notification) {
        const notificationType = Object.keys(notification)[0];
        const notificationMessage = notification[notificationType][0];

        if (notificationType === 'error') {
            toastr.error(notificationMessage);
        } else {
            toastr.success(notificationMessage);
        }

        localStorage.removeItem('notification');
    }
});

toastr.options = {
    closeButton: true,
    debug: true,
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