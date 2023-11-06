/* eslint-disable no-undef */
$(() => {
    $('#regions').select2({
        ajax: {
            delay: 250,
            placeholder: 'Select an regions',
            url: '/vietnam-address-api.json',
            dataType: 'json',
            data: function (params) {
                var query = {
                    search: params.term,
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

    $('#districts').select2({
        ajax: {
            disabled: true,
            delay: 250,
            placeholder: 'Select an regions',
            url: '/vietnam-address-api.json',
            dataType: 'json',
            data: function (params) {
                var query = {
                    search: params.term,
                };
                return query;
            },
            processResults: function (data) {
                const districts = data
                    .filter(f => f.codename == $('#regions').val())[0].districts;

                const names = districts
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
        ajax: {
            delay: 250,
            disabled: true,
            placeholder: 'Select an regions',
            url: '/vietnam-address-api.json',
            dataType: 'json',
            data: function (params) {
                var query = {
                    search: params.term,
                };
                return query;
            },
            processResults: function (data) {
                const districts = data
                    .filter(f => f.codename == $('#regions').val())[0].districts;

                const wards = districts
                    .filter(f => f.codename == $('#districts').val())[0].wards;

                const names = wards.map((p) => {
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

    $('#regions').on('change', function () {
        $("#districts").prop("disabled", $('#regions').val() === '');
    });
    $('#districts').on('change', function () {
        $("#wards").prop("disabled", $('#districts').val() === '');
    });
});