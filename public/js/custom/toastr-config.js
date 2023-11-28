/* eslint-disable no-undef */
// TODO uncomment this
// $(() => {
//     const notification = sessionStorage.getItem('notification')
//     const notificationType = sessionStorage.getItem('notificationType')

//     if (notification) {
//         if (notificationType === 'success') {
//             toastr.success(notification)
//         } else if (notificationType === 'error') {
//             toastr.error(notification)
//         }

//         sessionStorage.removeItem('notification')
//         sessionStorage.removeItem('notificationType')
//     }
// })
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