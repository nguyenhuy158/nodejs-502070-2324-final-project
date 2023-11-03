$(() => {
    let table = $("#product-table")
        .DataTable({
            responsive: true,
            rowId: '_id',
            fixedHeader: true,
            search: {
                caseInsensitive: false,
                regex: true
            },
            language: {
                zeroRecords: "No records to display",
                emptyTable: "No data available in table",
                decimal: '.',
                thousands: ','
            },
            retrieve: true,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            stateSave: true,
            scrollX: true,
            scrollY: "50vh",
            scrollCollapse: true,
            order: [[0, 'asc']],
            processing: true,
            autoWidth: true,
            ajax: {
                url: '/api/products',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    },
                    orderable: false
                },
                { data: 'barcode' },
                {
                    data: 'productName',
                    render: function (data, type, row) {
                        return `<a href="/products/${row._id}">${data}</a>`;
                    }
                },
                {
                    data: 'importPrice',
                    render: function (data, type, row) {
                        const number = parseInt(data, 10);
                        return number.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        });
                    }
                },
                {
                    data: 'retailPrice',
                    render: function (data, type, row) {
                        const number = parseInt(data, 10);
                        return number.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        });
                    }
                },
                { data: 'category.name' },
                {
                    data: 'imageUrls',
                    render: function (data, type, row) {
                        return `<a class="image-popup" href=${data[0]} title="${row.productName}">
									<img class="lazy" width="100" height="100" data-src="${data[0]}"/>
									</a>`;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const viewBtn = `<a class="my-1 btn btn-primary" href="/products/${row._id}">
									<span class="iconify" data-icon="carbon:view"></span>
									</a>`;
                        const updateBtn = `<button class="my-1 btn btn-success btn-edit">
								<span class="iconify" data-icon="mingcute:edit-line"></span>
								</button>`;
                        const deleteBtn = `<button class="my-1 btn btn-danger delete-btn">
								<span class="iconify" data-icon="mdi:delete-outline"></span>
								</button>`;
                        const demo = ``;


                        return `${viewBtn} ${updateBtn} ${deleteBtn} ${demo}`;
                    }
                },
            ]
        });
    table.on('draw.dt', function () {
        var info = table.page.info();
        table.column(0, { search: 'applied' })
            .nodes()
            .each(function (cell, i) {
                cell.innerHTML = i + 1 + info.start;
            });

        lazyImageLoading();
        magnificPopup();
    });

    $("#product-table")
        .DataTable({
            retrieve: true,
            stateSave: true,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
            },
            stateLoadCallback: function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance));
            }
        });

    $('#reload-product-table').on('click', () => {
        $('#product-table').DataTable().ajax.reload(function (json) {
            console.log("The data has been refreshed:", json);
        });
    });
});