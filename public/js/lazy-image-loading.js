// https://www.base64-image.de/
// https://loading.io/
function lazyImageLoading() {
    $('.lazy').lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 100,
        combined: true,
        visibleOnly: true,
        delay: 1000,
        defaultImage: LOADING_1,
        placeholder: LOADING_1,
        enableThrottle: true,
        throttle: 500,
        appendScroll: $('table'),
        onError: function (element) {
            // console.log('[lazy] error loading ' + element.data('src'));
        },
        beforeLoad: function (element) {
            // console.log('[lazy] before loading ' + element.data('src'));
        },
        afterLoad: function (element) {
            // console.log('[lazy] after loading ' + element.data('src'));
        },
        onFinishedAll: function () {
            // console.log('[lazy] all elements loading');
        }
    });
}

