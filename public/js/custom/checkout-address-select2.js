$(() => {
    $('#regions').select2({
        dropdownAutoWidth: true,
        delay: 250,
        debug: true,
        width: "100%",
        placeholder: 'Select an regions',
        ajax: {
            url: '/search/address',
            dataType: 'json',
            data: function (params) {
                const query = {
                    q: params.term,
                    type: 'regions'
                };
                return query;
            },
            sorter: function (e) {
            },
            processResults: function (data) {
                const names = data.map((p) => {
                    return {
                        "id": p.codename,
                        "text": p.name
                    };
                });

                return {
                    results: names
                };
            },
            cache: true
        }
    });

    $('#districts').select2({
        disabled: true,
        placeholder: 'Select an districts',
        ajax: {
            delay: 250,
            url: '/search/address',
            dataType: 'json',
            data: function (params) {
                const query = {
                    q: params.term,
                    type: 'districts',
                    regioncode: $('#regions').val()
                };
                return query;
            },
            processResults: function (data) {

                const names = data
                    .map((p) => {
                        return {
                            "id": p.codename,
                            "text": p.name
                        };
                    });


                return {
                    results: names
                };
            },
            cache: true
        }
    });

    $('#wards').select2({
        disabled: true,
        placeholder: 'Select an wards',
        ajax: {
            delay: 250,
            url: '/search/address',
            dataType: 'json',
            data: function (params) {
                const query = {
                    q: params.term,
                    type: 'wards',
                    regioncode: $('#regions').val(),
                    districtcode: $('#districts').val()
                };
                return query;
            },
            processResults: function (data) {

                const names = data.map((p) => {
                    return {
                        "id": p.codename,
                        "text": p.name
                    };
                });

                return {
                    results: names
                };
            },
            cache: true
        }
    });

    // handle disable districts when regions is empty
    // handle disable wards when districts is empty
    $('#regions').on('change', function () {
        $("#districts").prop("disabled", $('#regions').val() === '');
    });
    $('#districts').on('change', function () {
        $("#wards").prop("disabled", $('#districts').val() === '');
    });
});